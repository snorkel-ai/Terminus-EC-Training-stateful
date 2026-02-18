"""
Modern CLI UI components using Rich.

Inspired by modern CLIs like Ghostty, Open Codex, etc.
"""
from __future__ import annotations

import sys
import time
from contextlib import contextmanager
from pathlib import Path
from typing import Any, Callable

from rich.console import Console, Group
from rich.live import Live
from rich.panel import Panel
from rich.progress import (
    BarColumn,
    Progress,
    SpinnerColumn,
    TaskProgressColumn,
    TextColumn,
    TimeElapsedColumn,
)
from rich.table import Table
from rich.text import Text
from rich.rule import Rule
from rich.tree import Tree
from rich.style import Style
from rich.box import ROUNDED, HEAVY, DOUBLE, MINIMAL, SIMPLE
from rich import box

# Initialize console
console = Console()

# Brand colors
BRAND_PRIMARY = "#6366f1"  # Indigo
BRAND_SECONDARY = "#8b5cf6"  # Purple
BRAND_ACCENT = "#06b6d4"  # Cyan
SUCCESS = "#10b981"  # Emerald
WARNING = "#f59e0b"  # Amber
ERROR = "#ef4444"  # Red
MUTED = "#6b7280"  # Gray

# Styles
style_brand = Style(color=BRAND_PRIMARY, bold=True)
style_accent = Style(color=BRAND_ACCENT)
style_success = Style(color=SUCCESS)
style_warning = Style(color=WARNING)
style_error = Style(color=ERROR)
style_muted = Style(color=MUTED)


# ============================================================================
# LOGO & BRANDING
# ============================================================================

LOGO = """
[bold #6366f1]╔══════════════════════════════════════════════════════════════╗[/]
[bold #6366f1]║[/]                                                              [bold #6366f1]║[/]
[bold #6366f1]║[/]   [bold #8b5cf6]███████╗[/][bold #7c3aed]████████╗[/][bold #6d28d9]██████╗ [/]                               [bold #6366f1]║[/]
[bold #6366f1]║[/]   [bold #8b5cf6]██╔════╝[/][bold #7c3aed]╚══██╔══╝[/][bold #6d28d9]██╔══██╗[/]                               [bold #6366f1]║[/]
[bold #6366f1]║[/]   [bold #8b5cf6]███████╗[/][bold #7c3aed]   ██║   [/][bold #6d28d9]██████╔╝[/]                               [bold #6366f1]║[/]
[bold #6366f1]║[/]   [bold #8b5cf6]╚════██║[/][bold #7c3aed]   ██║   [/][bold #6d28d9]██╔══██╗[/]                               [bold #6366f1]║[/]
[bold #6366f1]║[/]   [bold #8b5cf6]███████║[/][bold #7c3aed]   ██║   [/][bold #6d28d9]██████╔╝[/]                               [bold #6366f1]║[/]
[bold #6366f1]║[/]   [bold #8b5cf6]╚══════╝[/][bold #7c3aed]   ╚═╝   [/][bold #6d28d9]╚═════╝ [/]                               [bold #6366f1]║[/]
[bold #6366f1]║[/]                                                              [bold #6366f1]║[/]
[bold #6366f1]║[/]   [dim]Snorkel Terminal-Bench[/]           [dim #6b7280]v1.0.0[/]                  [bold #6366f1]║[/]
[bold #6366f1]║[/]                                                              [bold #6366f1]║[/]
[bold #6366f1]╚══════════════════════════════════════════════════════════════╝[/]
"""

LOGO_SMALL = """[bold #8b5cf6]STB[/] [dim]•[/] [#6b7280]Snorkel Terminal-Bench[/]"""


def print_logo(small: bool = False) -> None:
    """Print the STB logo"""
    if small:
        console.print(LOGO_SMALL)
    else:
        console.print(LOGO)


def print_welcome(user_email: str | None = None) -> None:
    """Print welcome message with user info"""
    console.print()
    print_logo()
    console.print()
    
    if user_email:
        console.print(f"  [dim]Welcome back,[/] [bold #06b6d4]{user_email}[/]")
    else:
        console.print(f"  [dim]Welcome to Terminal-Bench[/]")
    
    console.print()


# ============================================================================
# STATUS & DASHBOARD
# ============================================================================

def print_status_dashboard(submissions: list[dict[str, Any]]) -> None:
    """Print a status dashboard showing submission overview"""
    
    # Count by state
    needs_revision = sum(1 for s in submissions if s.get("assignment_state") == "NEEDS_REVISION")
    pending = sum(1 for s in submissions if s.get("assignment_state") == "EVALUATION_PENDING")
    completed = sum(1 for s in submissions if s.get("assignment_state") == "COMPLETED")
    
    # Create status grid
    status_text = Text()
    
    if needs_revision > 0:
        status_text.append("  ⚠️  ", style="bold")
        status_text.append(f"{needs_revision} ", style=f"bold {WARNING}")
        status_text.append("need revision\n", style=MUTED)
    
    if pending > 0:
        status_text.append("  ⏳ ", style="bold")
        status_text.append(f"{pending} ", style=f"bold {BRAND_ACCENT}")
        status_text.append("pending review\n", style=MUTED)
    
    if completed > 0:
        status_text.append("  ✓  ", style="bold")
        status_text.append(f"{completed} ", style=f"bold {SUCCESS}")
        status_text.append("completed\n", style=MUTED)
    
    if not submissions:
        status_text.append("  [dim]No submissions yet. Ready to submit your first task![/]\n")
    
    panel = Panel(
        status_text,
        title="[bold]Your Submissions[/]",
        title_align="left",
        border_style=MUTED,
        box=box.ROUNDED,
        padding=(0, 1),
    )
    
    console.print(panel)


def print_quick_commands() -> None:
    """Print quick command reference"""
    
    commands = Table(
        show_header=False,
        box=None,
        padding=(0, 2),
        expand=False,
    )
    commands.add_column(style=f"bold {BRAND_ACCENT}", no_wrap=True)
    commands.add_column(style=MUTED)
    
    commands.add_row("stb submit <folder>", "Submit a new task")
    commands.add_row("stb list", "View your submissions")
    commands.add_row("stb status", "Check submission status")
    commands.add_row("stb update <folder>", "Update a revision")
    
    panel = Panel(
        commands,
        title="[bold]Quick Commands[/]",
        title_align="left",
        border_style=MUTED,
        box=box.ROUNDED,
        padding=(0, 1),
    )
    
    console.print(panel)


# ============================================================================
# INTERACTIVE MENU
# ============================================================================

def show_interactive_menu() -> str | None:
    """Show interactive menu and return selected action"""
    from InquirerPy import inquirer
    from InquirerPy.separator import Separator
    
    choices = [
        {"name": "📤  Submit a new task", "value": "submit"},
        {"name": "📋  View my submissions", "value": "list"},
        {"name": "🔄  Update a submission", "value": "update"},
        Separator(),
        {"name": "⚙️   Settings", "value": "settings"},
        {"name": "❓  Help", "value": "help"},
        Separator(),
        {"name": "👋  Exit", "value": "exit"},
    ]
    
    result = inquirer.select(
        message="What would you like to do?",
        choices=choices,
        default="submit",
        pointer="❯",
        qmark="",
        amark="",
        instruction="(↑/↓ to move, Enter to select)",
    ).execute()
    
    return result


# ============================================================================
# SUBMISSION FLOW UI
# ============================================================================

def print_submission_header(folder_path: Path, project_id: str, is_update: bool = False) -> None:
    """Print header for submission process"""
    action = "Updating" if is_update else "Submitting"
    icon = "🔄" if is_update else "📤"
    
    console.print()
    console.print(f"  {icon} [bold]{action} task[/]")
    console.print(f"     [dim]Folder:[/]  {folder_path.name}/")
    console.print(f"     [dim]Project:[/] {project_id[:8]}...")
    console.print()


def print_file_tree(folder_path: Path, max_files: int = 15) -> None:
    """Print a tree view of files being submitted"""
    
    tree = Tree(
        f"[bold {BRAND_ACCENT}]📁 {folder_path.name}[/]",
        guide_style=MUTED,
    )
    
    files = list(folder_path.rglob("*"))
    files = [f for f in files if f.is_file() and f.name != ".snorkel_config"]
    
    total_size = sum(f.stat().st_size for f in files)
    
    # Group by directory
    shown = 0
    for file in sorted(files)[:max_files]:
        rel_path = file.relative_to(folder_path)
        size = file.stat().st_size
        size_str = format_size(size)
        
        icon = get_file_icon(file.suffix)
        tree.add(f"{icon} [dim]{rel_path}[/]  [{MUTED}]{size_str}[/]")
        shown += 1
    
    if len(files) > max_files:
        tree.add(f"[dim]... and {len(files) - max_files} more files[/]")
    
    panel = Panel(
        tree,
        title=f"[bold]Files to submit[/] [dim]({len(files)} files, {format_size(total_size)})[/]",
        title_align="left",
        border_style=MUTED,
        box=box.ROUNDED,
        padding=(0, 1),
    )
    
    console.print(panel)


def get_file_icon(suffix: str) -> str:
    """Get icon for file type"""
    icons = {
        ".py": "🐍",
        ".js": "📜",
        ".ts": "📘",
        ".json": "📋",
        ".md": "📝",
        ".txt": "📄",
        ".yaml": "⚙️",
        ".yml": "⚙️",
        ".sh": "🔧",
        ".sql": "🗃️",
        ".html": "🌐",
        ".css": "🎨",
    }
    return icons.get(suffix.lower(), "📄")


def format_size(size: int) -> str:
    """Format file size in human-readable form"""
    for unit in ["B", "KB", "MB", "GB"]:
        if size < 1024:
            return f"{size:.1f} {unit}" if unit != "B" else f"{size} {unit}"
        size /= 1024
    return f"{size:.1f} TB"


@contextmanager
def submission_progress():
    """Context manager for submission progress display"""
    progress = Progress(
        SpinnerColumn(spinner_name="dots", style=BRAND_PRIMARY),
        TextColumn("[bold]{task.description}"),
        BarColumn(bar_width=30, style=MUTED, complete_style=BRAND_PRIMARY),
        TaskProgressColumn(),
        TimeElapsedColumn(),
        console=console,
        transient=True,
    )
    
    with progress:
        yield progress


class SubmissionTracker:
    """Track and display submission progress with a modern UI"""
    
    def __init__(self):
        self.steps = [
            ("zip", "Packaging files", 0.1),
            ("upload", "Uploading to cloud", 0.2),
            ("validate", "Running validations", 0.5),
            ("submit", "Creating submission", 0.2),
        ]
        self.current_step = 0
        self.console = console
    
    def start(self) -> None:
        """Start the progress display"""
        self.console.print()
    
    def update(self, step: str, status: str = "running") -> None:
        """Update current step status"""
        icons = {
            "running": f"[{BRAND_ACCENT}]⠋[/]",
            "done": f"[{SUCCESS}]✓[/]",
            "error": f"[{ERROR}]✗[/]",
        }
        icon = icons.get(status, icons["running"])
        
        step_names = {
            "zip": "Packaging",
            "upload": "Uploading",
            "validate": "Validating",
            "submit": "Submitting",
        }
        name = step_names.get(step, step)
        
        self.console.print(f"  {icon} {name}")
    
    def complete(self, submission_id: str) -> None:
        """Show completion message"""
        self.console.print()
        
        success_panel = Panel(
            f"""
[bold {SUCCESS}]✓ Submission created successfully![/]

[dim]Submission ID:[/] [bold]{submission_id[:8]}...[/]
[dim]Status:[/]        [bold {BRAND_ACCENT}]Pending Review[/]

[dim]View in browser:[/]
  [link=https://experts.snorkel.ai]https://experts.snorkel.ai[/]
""",
            border_style=SUCCESS,
            box=box.ROUNDED,
            padding=(0, 2),
        )
        
        self.console.print(success_panel)


@contextmanager  
def progress_spinner(message: str):
    """Show a spinner with elapsed time for long operations"""
    with console.status(f"[bold {BRAND_PRIMARY}]{message}[/]", spinner="dots") as status:
        start_time = time.time()
        
        class SpinnerContext:
            def update(self, new_message: str) -> None:
                elapsed = time.time() - start_time
                status.update(f"[bold {BRAND_PRIMARY}]{new_message}[/] [dim]({elapsed:.0f}s)[/]")
            
            def elapsed(self) -> float:
                return time.time() - start_time
        
        yield SpinnerContext()


# ============================================================================
# FEEDBACK DISPLAY
# ============================================================================

def print_feedback_results(feedback_response: dict[str, Any]) -> None:
    """Display feedback/validation results in a nice format"""
    
    outcome = feedback_response.get("feedback_outcome", "UNKNOWN")
    metadata = feedback_response.get("metadata", {})
    static_checks = metadata.get("static_checks", [])
    
    # Outcome header
    if outcome == "PASS":
        console.print(f"\n  [bold {SUCCESS}]✓ All checks passed[/]\n")
    else:
        console.print(f"\n  [bold {ERROR}]✗ Some checks failed[/]\n")
    
    # Check results
    if static_checks:
        table = Table(
            show_header=True,
            header_style=f"bold {MUTED}",
            box=box.SIMPLE,
            padding=(0, 1),
            expand=False,
        )
        table.add_column("Check", style="bold")
        table.add_column("Status", justify="center")
        table.add_column("Details", style="dim")
        
        for check in static_checks:
            name = check.get("name", "Unknown")
            status = check.get("status", "UNKNOWN")
            logs = check.get("full_logs", "")
            
            # Status icon
            if status == "PASS":
                status_display = f"[{SUCCESS}]✓ Pass[/]"
            elif status == "FAIL":
                status_display = f"[{ERROR}]✗ Fail[/]"
            elif status == "SKIP":
                status_display = f"[{MUTED}]○ Skip[/]"
            else:
                status_display = f"[{WARNING}]? {status}[/]"
            
            # Truncate logs for table
            log_preview = logs.split("\n")[0][:40] if logs else "-"
            if len(logs) > 40:
                log_preview += "..."
            
            table.add_row(name, status_display, log_preview)
        
        console.print(table)
        
        # Show full logs for failed checks
        failed_checks = [c for c in static_checks if c.get("status") == "FAIL"]
        if failed_checks:
            console.print()
            for check in failed_checks:
                logs = check.get("full_logs", "")
                if logs:
                    console.print(Panel(
                        logs,
                        title=f"[bold {ERROR}]{check.get('name', 'Error')} - Details[/]",
                        title_align="left",
                        border_style=ERROR,
                        box=box.ROUNDED,
                    ))


# ============================================================================
# SUBMISSION LIST
# ============================================================================

def print_submissions_table(submissions: list[dict[str, Any]]) -> None:
    """Print submissions in a modern table format"""
    
    if not submissions:
        console.print(Panel(
            "[dim]No submissions found. Submit your first task with:[/]\n\n"
            f"  [bold {BRAND_ACCENT}]stb submit <folder> --project-id <id>[/]",
            border_style=MUTED,
            box=box.ROUNDED,
        ))
        return
    
    table = Table(
        show_header=True,
        header_style=f"bold {BRAND_PRIMARY}",
        box=box.ROUNDED,
        border_style=MUTED,
        padding=(0, 1),
        expand=True,
    )
    
    table.add_column("#", justify="right", style="dim", width=4)
    table.add_column("Submission ID", style="bold")
    table.add_column("Status", justify="center")
    table.add_column("Project", style="dim")
    
    for idx, sub in enumerate(submissions, 1):
        sub_id = sub.get("submission_id", "")
        display_id = sub_id[:12] + "..." if len(sub_id) > 15 else sub_id
        
        state = sub.get("assignment_state", "UNKNOWN")
        
        # State styling
        state_styles = {
            "NEEDS_REVISION": (f"[{WARNING}]⚠ Needs Revision[/]", WARNING),
            "EVALUATION_PENDING": (f"[{BRAND_ACCENT}]⏳ Pending[/]", BRAND_ACCENT),
            "COMPLETED": (f"[{SUCCESS}]✓ Completed[/]", SUCCESS),
        }
        state_display, _ = state_styles.get(state, (f"[{MUTED}]{state}[/]", MUTED))
        
        proj_id = sub.get("project_id", "")
        display_proj = proj_id[:12] + "..." if len(proj_id) > 15 else proj_id
        
        table.add_row(str(idx), display_id, state_display, display_proj)
    
    console.print()
    console.print(table)
    console.print()


# ============================================================================
# MESSAGES
# ============================================================================

def print_error(message: str, details: str | None = None) -> None:
    """Print error message"""
    console.print(f"\n  [bold {ERROR}]✗ Error:[/] {message}")
    if details:
        console.print(f"    [dim]{details}[/]")
    console.print()


def print_success(message: str) -> None:
    """Print success message"""
    console.print(f"\n  [bold {SUCCESS}]✓[/] {message}\n")


def print_warning(message: str) -> None:
    """Print warning message"""
    console.print(f"\n  [bold {WARNING}]⚠[/] {message}\n")


def print_info(message: str) -> None:
    """Print info message"""
    console.print(f"\n  [bold {BRAND_ACCENT}]ℹ[/] {message}\n")


def print_hint(message: str) -> None:
    """Print a hint/tip"""
    console.print(f"  [dim]💡 {message}[/]")


# ============================================================================
# CONFIRM PROMPTS
# ============================================================================

def confirm(message: str, default: bool = True) -> bool:
    """Ask for confirmation"""
    from InquirerPy import inquirer
    
    return inquirer.confirm(
        message=message,
        default=default,
        qmark="",
        amark="",
    ).execute()


def select_folder() -> Path | None:
    """Interactive folder selection"""
    from InquirerPy import inquirer
    from InquirerPy.validator import PathValidator
    
    result = inquirer.filepath(
        message="Select task folder:",
        default="./",
        validate=PathValidator(is_dir=True, message="Please select a directory"),
        qmark="📁",
    ).execute()
    
    return Path(result) if result else None
