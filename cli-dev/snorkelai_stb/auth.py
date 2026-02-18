#!/usr/bin/env python3
"""Main CLI entry point with modern UI and guided onboarding"""
from __future__ import annotations

import sys
import webbrowser
from pathlib import Path

import click

from snorkelai_stb.submissions import submissions
from snorkelai_stb.utils import set_api_key, get_api_key, list_submission_ids, Config


def get_user_email() -> str | None:
    """Try to get the user's email from config"""
    try:
        return Config.get("user", "email")
    except Exception:
        return None


def is_logged_in() -> bool:
    """Check if user has an API key configured"""
    try:
        get_api_key()
        return True
    except ValueError:
        return False


def do_login(env: str = "prod") -> bool:
    """Run the login flow. Returns True if successful."""
    from snorkelai_stb.ui import console, print_success, print_error, BRAND_PRIMARY, BRAND_ACCENT
    from InquirerPy import inquirer
    
    env_urls = {
        "prod": "https://experts.snorkel-ai.com",
        "dev": "https://experts-dev.snorkel-ai.com",
        "staging": "https://experts-stg.snorkel-ai.com",
    }
    base_url = env_urls.get(env.lower(), env_urls["prod"])
    api_key_url = f"{base_url}/home"

    console.print()
    console.print(f"  [bold]🔐 Let's get you authenticated[/]")
    console.print()
    console.print(f"  [dim]1.[/] Open [{BRAND_ACCENT}]{api_key_url}[/]")
    console.print(f"  [dim]2.[/] Copy your API key from the dashboard")
    console.print(f"  [dim]3.[/] Paste it below")
    console.print()

    # Try to open browser
    try:
        webbrowser.open(api_key_url)
        console.print(f"  [dim italic]Opening browser...[/]")
        console.print()
    except Exception:
        pass

    # Prompt for API key
    try:
        api_key = inquirer.secret(
            message="Paste your API key:",
            qmark="  🔑",
            transformer=lambda _: "[hidden]",
        ).execute()
    except KeyboardInterrupt:
        console.print()
        return False
    
    if not api_key or not api_key.strip():
        print_error("API key cannot be empty")
        return False

    # Store the key
    try:
        set_api_key(api_key.strip())
        print_success("You're logged in!")
        return True
    except Exception as e:
        print_error(f"Failed to save API key: {e}")
        return False


def show_home_screen():
    """Show the main home screen with interactive menu"""
    from snorkelai_stb.ui import (
        console,
        print_logo,
        print_status_dashboard,
        print_submissions_table,
        print_file_tree,
        print_error,
        print_hint,
        print_success,
        progress_spinner,
        confirm,
        BRAND_PRIMARY,
        BRAND_ACCENT,
        MUTED,
    )
    from InquirerPy import inquirer
    from InquirerPy.separator import Separator
    
    while True:
        # Clear screen effect - print some newlines
        console.print("\n" * 2)
        
        # Show logo
        print_logo(small=True)
        console.print()
        
        # Fetch and show status
        try:
            api_key = get_api_key()
            with progress_spinner("Loading..."):
                subs = list_submission_ids(project_id=None, api_key=api_key, env="prod")
            print_status_dashboard(subs)
        except Exception:
            subs = []
        
        console.print()
        
        # Build menu choices based on state
        choices = []
        
        # Primary actions
        choices.append({"name": "📤  Create new submission", "value": "create"})
        choices.append({"name": "📋  View my submissions", "value": "list"})
        
        # Show update option if there are submissions needing revision
        needs_revision = [s for s in subs if s.get("assignment_state") == "NEEDS_REVISION"]
        if needs_revision:
            choices.append({"name": f"🔄  Update a submission ({len(needs_revision)} need revision)", "value": "update"})
        
        choices.append(Separator())
        choices.append({"name": "❓  Help & documentation", "value": "help"})
        choices.append({"name": "👋  Exit", "value": "exit"})
        
        # Show menu
        try:
            action = inquirer.select(
                message="What would you like to do?",
                choices=choices,
                default="create",
                pointer="❯",
                qmark="",
                amark="",
                instruction="",
            ).execute()
        except KeyboardInterrupt:
            console.print(f"\n  [dim]Goodbye! 👋[/]\n")
            break
        
        # Handle actions
        if action == "exit":
            console.print(f"\n  [dim]Goodbye! 👋[/]\n")
            break
            
        elif action == "create":
            handle_create_submission()
            
        elif action == "list":
            handle_view_submissions(subs)
            
        elif action == "update":
            handle_update_submission(needs_revision)
            
        elif action == "help":
            handle_help()


def handle_create_submission():
    """Handle the create submission flow"""
    from snorkelai_stb.ui import console, print_error, print_hint, BRAND_ACCENT
    from InquirerPy import inquirer
    from InquirerPy.validator import PathValidator
    
    console.print()
    console.print(f"  [bold]📤 Create New Submission[/]")
    console.print()
    
    # Get folder path
    try:
        folder = inquirer.filepath(
            message="Select your task folder:",
            default="./",
            validate=PathValidator(is_dir=True, message="Please select a folder"),
            qmark="  📁",
            amark="  📁",
        ).execute()
    except KeyboardInterrupt:
        return
    
    if not folder:
        return
    
    folder_path = Path(folder).resolve()
    
    # Check if already submitted
    from snorkelai_stb.utils import config_file_exists, read_config_file
    if config_file_exists(folder_path):
        try:
            config = read_config_file(folder_path)
            existing_id = config.get("submission_id", "unknown")
            print_error(
                "This folder was already submitted",
                f"Submission ID: {existing_id[:16]}..."
            )
            console.print()
            print_hint("Use 'Update a submission' to revise an existing submission")
            console.print()
            
            # Wait for input before returning to menu
            inquirer.text(message="Press Enter to continue...", qmark="", amark="").execute()
            return
        except Exception:
            pass
    
    # Get project ID
    try:
        project_id = inquirer.text(
            message="Project ID:",
            qmark="  🏷️ ",
            amark="  🏷️ ",
            validate=lambda x: len(x.strip()) > 0,
            invalid_message="Project ID is required",
        ).execute()
    except KeyboardInterrupt:
        return
    
    if not project_id:
        return
    
    console.print()
    
    # Run the submission
    from snorkelai_stb.submissions import _process_submission
    try:
        api_key = get_api_key()
        _process_submission(
            api_key=api_key,
            project_id=project_id.strip(),
            env="prod",
            folder_path=folder_path,
            is_update=False,
        )
    except Exception as e:
        print_error("Submission failed", str(e))
    
    console.print()
    # Wait for input before returning to menu
    try:
        inquirer.text(message="Press Enter to continue...", qmark="", amark="").execute()
    except KeyboardInterrupt:
        pass


def handle_view_submissions(subs: list):
    """Handle viewing submissions"""
    from snorkelai_stb.ui import console, print_submissions_table
    from InquirerPy import inquirer
    
    console.print()
    console.print(f"  [bold]📋 Your Submissions[/]")
    console.print()
    
    print_submissions_table(subs)
    
    # Wait for input before returning
    try:
        inquirer.text(message="Press Enter to continue...", qmark="", amark="").execute()
    except KeyboardInterrupt:
        pass


def handle_update_submission(needs_revision: list):
    """Handle updating a submission that needs revision"""
    from snorkelai_stb.ui import console, print_error, BRAND_ACCENT
    from InquirerPy import inquirer
    from InquirerPy.validator import PathValidator
    
    console.print()
    console.print(f"  [bold]🔄 Update Submission[/]")
    console.print()
    
    if not needs_revision:
        console.print(f"  [dim]No submissions need revision.[/]")
        console.print()
        try:
            inquirer.text(message="Press Enter to continue...", qmark="", amark="").execute()
        except KeyboardInterrupt:
            pass
        return
    
    # Let user pick which submission to update
    choices = []
    for sub in needs_revision:
        sub_id = sub.get("submission_id", "")
        proj_id = sub.get("project_id", "")
        display = f"{sub_id[:12]}... (project: {proj_id[:8]}...)"
        choices.append({"name": display, "value": sub})
    
    choices.append({"name": "← Back", "value": None})
    
    try:
        selected = inquirer.select(
            message="Which submission to update?",
            choices=choices,
            pointer="❯",
            qmark="  ",
        ).execute()
    except KeyboardInterrupt:
        return
    
    if not selected:
        return
    
    # Get folder path
    console.print()
    try:
        folder = inquirer.filepath(
            message="Select your updated task folder:",
            default="./",
            validate=PathValidator(is_dir=True, message="Please select a folder"),
            qmark="  📁",
            amark="  📁",
        ).execute()
    except KeyboardInterrupt:
        return
    
    if not folder:
        return
    
    folder_path = Path(folder).resolve()
    
    console.print()
    
    # Run the update
    from snorkelai_stb.submissions import _process_submission
    try:
        api_key = get_api_key()
        _process_submission(
            api_key=api_key,
            project_id=selected.get("project_id", ""),
            env="prod",
            folder_path=folder_path,
            is_update=True,
            submission_id=selected.get("submission_id"),
        )
    except Exception as e:
        print_error("Update failed", str(e))
    
    console.print()
    try:
        inquirer.text(message="Press Enter to continue...", qmark="", amark="").execute()
    except KeyboardInterrupt:
        pass


def handle_help():
    """Show help and documentation"""
    from snorkelai_stb.ui import console, BRAND_PRIMARY, BRAND_ACCENT, MUTED
    from InquirerPy import inquirer
    from rich.panel import Panel
    from rich import box
    
    console.print()
    
    help_text = f"""
[bold]Getting Started[/]

  [bold]1. Create a submission[/]
     Prepare your task folder with your solution, then submit it
     for review. Your code will be validated automatically.

  [bold]2. Check your submissions[/]
     View the status of all your submissions. Submissions can be:
     • [bold {BRAND_ACCENT}]Pending[/] - Waiting for review
     • [bold #f59e0b]Needs Revision[/] - Reviewer requested changes  
     • [bold #10b981]Completed[/] - Approved and done

  [bold]3. Update a submission[/]
     If a reviewer requests changes, update your task folder
     and submit the revision.

[bold]Command Line Usage[/]

  [dim]$[/] stb                           [dim]# Interactive mode[/]
  [dim]$[/] stb list                       [dim]# List submissions[/]
  [dim]$[/] stb submissions create <dir>   [dim]# Submit directly[/]
  [dim]$[/] stb submissions update <dir>   [dim]# Update directly[/]

[bold]Need Help?[/]

  Documentation: [{BRAND_ACCENT}]https://docs.snorkel.ai/terminal-bench[/]
  Support:       [{BRAND_ACCENT}]support@snorkel.ai[/]
"""
    
    panel = Panel(
        help_text,
        title="[bold]Help & Documentation[/]",
        title_align="left",
        border_style=MUTED,
        box=box.ROUNDED,
        padding=(0, 2),
    )
    
    console.print(panel)
    console.print()
    
    try:
        inquirer.text(message="Press Enter to continue...", qmark="", amark="").execute()
    except KeyboardInterrupt:
        pass


@click.group(invoke_without_command=True)
@click.pass_context
def cli(ctx):
    """Snorkel Terminal-Bench CLI - Manage Terminal-Bench task submissions"""
    if ctx.invoked_subcommand is None:
        run_interactive_mode()


def run_interactive_mode():
    """Run the full interactive experience"""
    from snorkelai_stb.ui import console, print_logo, print_welcome
    
    # Show welcome logo
    console.print()
    print_logo()
    console.print()
    
    # Check if logged in
    if not is_logged_in():
        console.print(f"  [dim]Welcome to Terminal-Bench![/]")
        console.print()
        
        # Run login flow
        success = do_login()
        if not success:
            console.print(f"  [dim]Run [bold]stb[/] again when you're ready to log in.[/]")
            console.print()
            return
    
    # Show home screen
    show_home_screen()


cli.add_command(submissions)


@cli.command()
@click.option(
    "--env",
    type=click.Choice(["prod", "dev", "staging"], case_sensitive=False),
    default="prod",
    hidden=True,
)
def login(env):
    """Authenticate with Snorkel Terminal-Bench"""
    from snorkelai_stb.ui import print_logo, console
    
    console.print()
    print_logo()
    console.print()
    
    success = do_login(env)
    if success:
        console.print(f"  [dim]Run [bold]stb[/] to get started![/]")
        console.print()


@cli.command()
def home():
    """Open the interactive Terminal-Bench dashboard"""
    run_interactive_mode()


@cli.command(name="list")
@click.option("--project-id", required=False, default=None, help="Filter by project ID")
@click.option(
    "--env",
    type=click.Choice(["prod", "dev", "staging"], case_sensitive=False),
    default="prod",
    hidden=True,
)
def list_cmd(project_id, env):
    """List your submissions"""
    from snorkelai_stb.ui import console, print_submissions_table, print_error, progress_spinner
    
    try:
        api_key = get_api_key()
    except ValueError:
        print_error("Not logged in", "Run 'stb login' first")
        raise SystemExit(1)
    
    with progress_spinner("Fetching submissions..."):
        try:
            subs = list_submission_ids(project_id=project_id, api_key=api_key, env=env)
        except Exception as e:
            print_error(f"Failed to fetch submissions: {e}")
            raise SystemExit(1)
    
    print_submissions_table(subs)


@cli.command()
def status():
    """Show your current submission status"""
    from snorkelai_stb.ui import (
        console,
        print_logo,
        print_status_dashboard,
        print_error,
        progress_spinner,
    )
    
    try:
        api_key = get_api_key()
    except ValueError:
        print_error("Not logged in", "Run 'stb login' first")
        raise SystemExit(1)
    
    console.print()
    print_logo(small=True)
    console.print()
    
    with progress_spinner("Checking status..."):
        try:
            subs = list_submission_ids(project_id=None, api_key=api_key, env="prod")
        except Exception as e:
            print_error(f"Failed to fetch status: {e}")
            raise SystemExit(1)
    
    print_status_dashboard(subs)
    console.print()
