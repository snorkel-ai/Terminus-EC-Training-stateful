# Snorkel Terminal-Bench CLI - User Guide

A command-line tool for submitting and managing your Snorkel Terminal-Bench assignments.

## Installation

### Prerequisites

- Python 3.10 or higher

### Install from Wheel Link (Recommended)

- Install the CLI using pip with the pre-built wheel on cloud:

```bash
pip install https://snorkel-python-wheels.s3.us-west-2.amazonaws.com/stb/snorkelai_stb-<version>-py3-none-any.whl
```

Replace `<version>` with the desired version number (e.g., `1.0.0`).

- Install the CLI using pip with the pre-built wheel file:
  ```bash
  pip install <Whl_FILE_PATH>
  ```

The `stb` command will be available in your Python environment globally.

Use `stb --help` to check if it is installed. If it shows the help output, it means installation was successful.

```
Usage: stb [OPTIONS] COMMAND [ARGS]...

  Snorkel Terminal-Bench CLI - Manage Terminal-Bench task submissions

Options:
  --help  Show this message and exit.

Commands:
  login        Authenticate with Snorkel Terminal-Bench and store API key
  submissions  Manage submissions
```

## Setup

### Authentication

You need a Snorkel API key to use this tool. There are two ways to authenticate:

#### Option 1: Login Command (Recommended)

Use the `stb login` command to authenticate:

```bash
stb login
```

This will open the Experts platform website. Click the email dropdown in the top-right corner, select 'New API Key', and copy it. Return to your terminal and paste the API key.

Once logged in, you won't need to set environment variables for future commands.

#### Option 2: Environment Variable

Alternatively, you can set your API key as an environment variable:

```bash
export SNORKEL_API_KEY=your_api_key_here
```

Note: If both are set, the environment variable takes precedence over the stored key from `stb login`.

## Usage

The CLI provides three main commands:

### 1. Create a New Submission

Submit your work for the first time:

```bash
stb submissions create --project-id YOUR_PROJECT_ID ./path/to/your/submission
```

YOUR_PROJECT_ID is on the URL of the website like "https://experts.snorkel-ai.com/projects/<project_id>/..."

> For example, for project terminus-project-v2 submission, YOUR_PROJECT_ID should be 69f8137a-dc22-4d3a-a6eb-66b7e9f6047d

What happens:

- Your folder is zipped and uploaded
- Automatic checks run to validate your submission
- If checks pass, your submission is created and a submission ID (UUID) is saved in `.snorkel_config`

Example:

```bash
stb submissions create --project-id proj-456 ./my-assignment
```

### 2. Update an Existing Submission

Update a submission that needs revision:

```bash
stb submissions update --project-id YOUR_PROJECT_ID ./path/to/your/submission
```

Requirements:

- The submission must be in "NEEDS_REVISION" state

Example:

```bash
stb submissions update --project-id proj-456 ./my-assignment
```

### 3. List Your Submissions

View all your submissions:

```bash
stb submissions list
```

Or filter by project:

```bash
stb submissions list --project-id YOUR_PROJECT_ID
```

Example:

```bash
stb submissions list --project-id proj-456
```

Assignment States:

- `EVALUATION_PENDING` - Waiting for system evaluation
- `NEEDS_REVISION` - Reviewer requested changes (can update)
- `COMPLETED` - Task accepted, waiting for reviewers' review

## Common Options

All commands support these options:

- `--project-id`: Your project ID (required for create/update)

## Troubleshooting

### "This folder has already been submitted"

This error occurs when using `stb submissions create` on a folder that has already been submitted. Use `stb submissions update` to update the existing submission instead.

### "Cannot update: submission is in X state (must be NEEDS_REVISION)"

You can only update submissions that are in "NEEDS_REVISION" state. Check your submission status in the Snorkel platform or use `stb submissions list` to see the current state.

### "Feedback did not pass"

Your submission failed the automatic validation checks. Review the detailed feedback output to see what needs to be fixed, make the necessary changes, and try again.

### 'Error: No .snorkel_config file found in the folder.'

The 'update' command requires a .snorkel_config file with a submission_id. You could:

1. Use 'stb submissions create' first to create a new submission.
2. For an already created submission, manually get the UUID from the top-right corner of the submission page, then create a `.snorkel_config` file in the task folder with the content:
   ```
   submission_id: <TASK_UUID>
   ```

### API Key Issues

If you get authentication errors:

- Run `stb login` to authenticate and store your API key
- Verify your API key is correct in the Snorkel Terminal-Bench portal
- If using environment variables, make sure it's set: `echo $SNORKEL_API_KEY`
- Remember: environment variables take precedence over stored credentials from `stb login`

## Support

For issues or questions, please contact your project administrator or refer to the Snorkel Terminal-Bench documentation.
