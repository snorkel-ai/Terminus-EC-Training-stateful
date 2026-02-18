#!/usr/bin/env python3
"""CLI commands for submissions"""
from __future__ import annotations

import tempfile
import uuid
from datetime import datetime
from pathlib import Path

import click

from snorkelai_stb.utils import (
    FEEDBACK_TIMEOUT,
    config_file_exists,
    create_feedback,
    create_submission,
    get_api_key,
    get_assignment_id,
    get_assignment_task_id,
    get_feedback_button_info,
    get_project_task_type,
    get_submission_state,
    list_submission_ids,
    read_config_file,
    request_s3_presigned_url,
    upload_to_s3,
    write_config_file,
    zip_folder,
)


def _process_submission(
    api_key: str,
    project_id: str,
    env: str,
    folder_path: Path,
    is_update: bool,
    submission_id: str | None = None,
    dry_run: bool = False,
) -> int:
    """
    Common logic for creating or updating a submission with modern UI.
    """
    from snorkelai_stb.ui import (
        console,
        print_logo,
        print_submission_header,
        print_file_tree,
        print_feedback_results,
        print_success,
        print_error,
        print_warning,
        print_hint,
        progress_spinner,
        confirm,
        BRAND_PRIMARY,
        BRAND_ACCENT,
        SUCCESS,
        ERROR,
        WARNING,
        MUTED,
    )
    from rich.panel import Panel
    from rich import box

    # Print header
    print_submission_header(folder_path, project_id, is_update)
    
    # Show file preview
    print_file_tree(folder_path)
    console.print()
    
    # Dry run notice
    if dry_run:
        print_warning("DRY RUN MODE - No actual upload will occur")

    # For updates, validate that the submission is in NEEDS_REVISION state
    if submission_id and not dry_run:
        with progress_spinner("Checking submission status...") as spinner:
            try:
                current_state = get_submission_state(
                    project_id=project_id,
                    submission_id=submission_id,
                    api_key=api_key,
                    env=env,
                )
                if current_state != "NEEDS_REVISION":
                    print_error(
                        f"Cannot update submission",
                        f"Current state is {current_state}, must be NEEDS_REVISION"
                    )
                    return 1
            except Exception as e:
                print_error("Failed to validate submission state", str(e))
                return 1

    # Create a zip file in temp directory
    random_id = uuid.uuid4().hex[:8]
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    zip_filename = f"submission_{random_id}_{timestamp}.zip"
    zip_path = Path(tempfile.gettempdir()) / zip_filename

    try:
        # Step 1: Package files
        with progress_spinner("Packaging files...") as spinner:
            zip_folder(folder_path, zip_path)
            size_kb = zip_path.stat().st_size / 1024
        
        console.print(f"  [bold {SUCCESS}]✓[/] Packaged [bold]{size_kb:.1f} KB[/]")

        # In dry-run mode, stop here
        if dry_run:
            console.print()
            print_success("Dry run complete - no upload performed")
            if zip_path.exists():
                zip_path.unlink()
            return 0

        # Step 2: Prepare upload
        with progress_spinner("Preparing upload...") as spinner:
            task_type_str = get_project_task_type(project_id, api_key, env)
            
            if submission_id:
                submission_task_id = submission_id
                assignment_id = get_assignment_id(project_id, submission_id, api_key, env)
            else:
                submission_task_id, assignment_id = get_assignment_task_id(
                    project_id, task_type_str, api_key, env
                )
            
            feedback_field_name, feedback_id = get_feedback_button_info(project_id, api_key, env)
            
            presigned_response, upload_metadata = request_s3_presigned_url(
                project_id=project_id,
                task_uuid=assignment_id,
                filename=zip_filename,
                api_key=api_key,
                env=env,
            )
        
        console.print(f"  [bold {SUCCESS}]✓[/] Ready to upload")

        # Step 3: Upload
        with progress_spinner("Uploading to cloud...") as spinner:
            upload_to_s3(
                presigned_url=presigned_response["presignedUrl"],
                file_path=zip_path,
            )
        
        console.print(f"  [bold {SUCCESS}]✓[/] Uploaded")

        # Step 4: Run validations (this can take a while)
        console.print()
        console.print(f"  [bold]Running validations...[/] [dim](this may take a few minutes)[/]")
        
        with progress_spinner("Validating submission...") as spinner:
            feedback_response = create_feedback(
                task_type_str=task_type_str,
                task_id=submission_task_id,
                feedback_id=feedback_id,
                feedback_field_name=feedback_field_name,
                s3_key=presigned_response["s3Key"],
                filename=zip_filename,
                uploaded_at=upload_metadata["uploaded_at"],
                s3_uri=presigned_response["s3Uri"],
                api_key=api_key,
                env=env,
                timeout=FEEDBACK_TIMEOUT,
            )

        # Show feedback results
        print_feedback_results(feedback_response)
        
        feedback_outcome = feedback_response.get("feedback_outcome", "UNKNOWN")
        
        if feedback_outcome != "PASS":
            console.print()
            print_error("Submission not created", "Please fix the issues above and try again")
            if zip_path.exists():
                zip_path.unlink()
            return 1

        # Step 5: Create submission
        with progress_spinner("Creating submission...") as spinner:
            submission_manifest = {
                "submission_payload": {
                    "upload_a_zip_file": {
                        "s3Key": presigned_response["s3Key"],
                        "s3Uri": presigned_response["s3Uri"],
                        "filename": zip_filename,
                        "uploadedAt": upload_metadata["uploaded_at"],
                    },
                    feedback_field_name: feedback_response,
                    "code_difficulty_check_results": "",
                    "code_quality_check_results": "",
                    "checkbox_send_to_reviewer": True if submission_id else None,
                    "task_type_discriminator": task_type_str,
                },
                "selected_segments": {},
                "submission_id": {"id": submission_task_id},
                "rebuttal_notes": None,
            }
            
            create_submission(
                submission_manifest=submission_manifest,
                api_key=api_key,
                env=env,
            )

        # Write config file for new submissions
        if not is_update:
            try:
                write_config_file(folder_path, submission_task_id)
            except Exception:
                pass  # Non-fatal

        # Clean up
        if zip_path.exists():
            zip_path.unlink()

        # Success!
        console.print()
        action = "updated" if is_update else "created"
        
        success_panel = Panel(
            f"""
[bold {SUCCESS}]✓ Submission {action} successfully![/]

[dim]Submission ID:[/]  [bold]{submission_task_id[:16]}...[/]
[dim]Status:[/]         [bold {BRAND_ACCENT}]Pending Review[/]

[dim]View your submissions:[/]
  [bold {BRAND_PRIMARY}]stb list[/]

[dim]View in browser:[/]
  [{BRAND_ACCENT}]https://experts.snorkel.ai[/]
""",
            border_style=SUCCESS,
            box=box.ROUNDED,
            padding=(0, 2),
        )
        console.print(success_panel)
        
        return 0

    except KeyboardInterrupt:
        console.print()
        print_warning("Cancelled by user")
        if zip_path.exists():
            console.print(f"  [dim]Zip file retained at: {zip_path}[/]")
        raise
    except click.ClickException:
        if zip_path.exists():
            zip_path.unlink()
        raise
    except Exception as e:
        if zip_path.exists():
            zip_path.unlink()
        print_error("Submission failed", str(e))
        return 1


@click.group()
def submissions():
    """Manage submissions"""
    pass


@submissions.command()
@click.option("--project-id", required=True, help="Project ID")
@click.option(
    "--env",
    type=click.Choice(["prod", "dev", "staging"], case_sensitive=False),
    default="prod",
    hidden=True,
    help="Environment to submit to",
)
@click.option(
    "--dry-run",
    is_flag=True,
    default=False,
    help="Create zip file without uploading (for testing)",
)
@click.argument(
    "folder_name", type=click.Path(exists=True, file_okay=False, dir_okay=True)
)
def create(project_id, env, dry_run, folder_name):
    """Create and upload a new submission from FOLDER_NAME"""

    try:
        api_key = get_api_key()
    except ValueError as e:
        raise click.ClickException(str(e)) from e

    folder_path = Path(folder_name).resolve()

    # Check for existing .snorkel_config file to prevent duplicate submissions
    # Skip this check in dry-run mode since we're just testing and not actually submitting
    if not dry_run and config_file_exists(folder_path):
        try:
            config = read_config_file(folder_path)
            existing_submission_id = config.get("submission_id", "unknown")
            raise click.ClickException(
                f"This folder has already been submitted "
                f"(submission_id: {existing_submission_id}).\n"
                f"A submission already exists for this task folder. "
                f"If you want to update the existing submission, use "
                f"'stb submissions update' instead.\n"
                f"If you want to create a new submission, remove the "
                f".snorkel_config file first."
            )
        except ValueError:
            # If config file is malformed, still error out but with a different message
            raise click.ClickException(
                "This folder contains a .snorkel_config file that appears to be malformed.\n"
                "Please remove it if you want to create a new submission."
            ) from None

    return _process_submission(
        api_key=api_key,
        project_id=project_id,
        env=env,
        folder_path=folder_path,
        is_update=False,
        submission_id=None,
        dry_run=dry_run,
    )


@submissions.command()
@click.option("--project-id", required=True, help="Project ID")
@click.option(
    "--env",
    type=click.Choice(["prod", "dev", "staging"], case_sensitive=False),
    default="prod",
    hidden=True,
    help="Environment to submit to",
)
@click.option(
    "--dry-run",
    is_flag=True,
    default=False,
    help="Create zip file without uploading (for testing)",
)
@click.argument(
    "folder_name", type=click.Path(exists=True, file_okay=False, dir_okay=True)
)
def update(project_id, env, dry_run, folder_name):
    """Update an existing submission with new content from FOLDER_NAME"""

    try:
        api_key = get_api_key()
    except ValueError as e:
        raise click.ClickException(str(e)) from e

    folder_path = Path(folder_name).resolve()

    # Read submission_id from .snorkel_config
    if not config_file_exists(folder_path):
        raise click.ClickException(
            "No .snorkel_config file found in the folder.\n"
            "The 'update' command requires a .snorkel_config file with a submission_id.\n"
            "Use 'stb submissions create' first to create a new submission."
        )

    try:
        config = read_config_file(folder_path)
        submission_id = config.get("submission_id", "")
        if not submission_id:
            raise click.ClickException(
                "The .snorkel_config file is missing the submission_id field.\n"
                "Please check your .snorkel_config file."
            )
        click.echo(f"📄 Using submission_id from .snorkel_config: {submission_id}")
    except ValueError as e:
        raise click.ClickException(
            f"Failed to read .snorkel_config file: {e}\n"
            f"The config file may be malformed. Please check or remove it."
        ) from e

    return _process_submission(
        api_key=api_key,
        project_id=project_id,
        env=env,
        folder_path=folder_path,
        is_update=True,
        submission_id=submission_id,
        dry_run=dry_run,
    )


@submissions.command()
@click.option(
    "--project-id",
    required=False,
    default=None,
    help="Project ID (optional - lists all submissions if not provided)",
)
@click.option(
    "--env",
    type=click.Choice(["prod", "dev", "staging"], case_sensitive=False),
    default="prod",
    hidden=True,
    help="Environment to query",
)
def list(project_id, env):
    """List your submissions (optionally filtered by project)"""

    try:
        api_key = get_api_key()
    except ValueError as e:
        raise click.ClickException(str(e)) from e

    click.echo("📋 Fetching submissions...")

    try:
        submissions = list_submission_ids(
            project_id=project_id,
            api_key=api_key,
            env=env,
        )

        if not submissions:
            click.echo("No submissions found")
        else:
            click.echo(f"Found {len(submissions)} submission(s):\n")

            # Create table header with multiple columns
            click.echo(
                "┌─────┬────────────────────────────────────────┬──────────────────────┬────────────────────────────────────────┐"
            )
            click.echo(
                "│  #  │ Submission ID                          │ Assignment State     "
                "│ Project ID                             │"
            )
            click.echo(
                "├─────┼────────────────────────────────────────┼──────────────────────┼────────────────────────────────────────┤"
            )

            # Display each submission in table format
            for idx, sub in enumerate(submissions, 1):
                # Truncate submission ID if needed
                sub_id = sub["submission_id"]
                display_id = sub_id if len(sub_id) <= 38 else f"{sub_id[:35]}..."

                # Format assignment state
                assignment_state = sub.get("assignment_state", "")[:20].ljust(20)

                # Format project ID (truncate if needed)
                proj_id = sub.get("project_id", "")
                display_proj_id = (
                    proj_id if len(proj_id) <= 38 else f"{proj_id[:35]}..."
                )
                display_proj_id = display_proj_id[:38].ljust(38)

                click.echo(
                    f"│ {idx:3d} │ {display_id:<38} │ {assignment_state} │ {display_proj_id} │"
                )

            # Table footer
            click.echo(
                "└─────┴────────────────────────────────────────┴──────────────────────┴────────────────────────────────────────┘"
            )

    except Exception as e:
        raise click.ClickException(f"Failed to list submissions: {e}") from e

    return 0
