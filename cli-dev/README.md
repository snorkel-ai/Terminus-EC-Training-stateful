# STB CLI Development Environment

This folder contains an editable copy of the STB CLI for local development.

## Quick Start

```bash
cd cli-dev

# Install dependencies (if not already installed)
pip install click certifi platformdirs typing_extensions

# Run in dev mode (uses stubbed API responses)
python run_stb.py submissions create test-task --project-id test-123

# Or run individual commands
python run_stb.py submissions list
python run_stb.py submissions update test-task --project-id test-123
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `STB_DEV_MODE` | Enable stubbed APIs (`1`, `true`, `yes`) | Required for stubs |
| `STB_STUB_FEEDBACK_OUTCOME` | Control feedback result (`PASS` or `FAIL`) | `PASS` |
| `STB_STUB_SUBMISSION_STATE` | Submission state for updates | `NEEDS_REVISION` |

## Testing Different Scenarios

```bash
# Test successful submission
python run_stb.py submissions create test-task --project-id test-123

# Test failed feedback
STB_STUB_FEEDBACK_OUTCOME=FAIL python run_stb.py submissions create test-task --project-id test-123

# Test submission list
python run_stb.py submissions list --project-id test-123
```

## File Structure

```
cli-dev/
├── run_stb.py              # Dev runner script
├── test-task/              # Sample task folder for testing
│   ├── main.py
│   └── README.md
└── snorkelai_stb/          # The CLI package (editable)
    ├── __init__.py
    ├── auth.py             # Login command
    ├── submissions.py      # Main submission commands
    ├── utils.py            # API helpers
    └── stubs.py            # Stubbed responses for dev mode
```

## Making Changes

Edit files in `snorkelai_stb/` and re-run - changes take effect immediately.

Key files for UX improvements:
- `submissions.py` - The main CLI commands and output formatting
- `stubs.py` - Control stubbed API behavior and timing
