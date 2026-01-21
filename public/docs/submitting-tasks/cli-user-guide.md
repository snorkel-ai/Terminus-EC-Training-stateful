# Snorkel Terminal-Bench CLI - User Guide
A command-line tool for submitting and managing your Snorkel Terminal-Bench assignments.
## Installation
### Prerequisites
- Python 3.10 or higher
### Install from Wheel File
**Option 1: Install Directly from URL (Recommended)**
Install using pip directly from the wheel URL:
  ```bash
  pip install https://snorkel-python-wheels.s3.us-west-2.amazonaws.com/stb/snorkelai_stb-1.1.1-py3-none-any.whl
  ```
**Option 2: Install from Local File Path**
If you have the wheel file saved locally:
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
- Your folder is zipped with a timestamped filename (e.g., `my-assignment_20260120_143052.zip`)
- The zip is uploaded to S3
- Automatic checks run to validate your submission
- If checks pass, your submission is created
- A `.snorkel_config` file is written to your folder to track the submission ID
Example:
```bash
stb submissions create --project-id proj-456 ./my-assignment
```

### 2. Update an Existing Submission

Update a submission that needs revision:

```bash
stb submissions update --project-id YOUR_PROJECT_ID ./path/to/your/submission
```

By default, the update command reads the submission ID from the `.snorkel_config` file in your folder. Alternatively, you can provide it explicitly:

```bash
stb submissions update --project-id YOUR_PROJECT_ID --submission-id SUBMISSION_ID ./path/to/your/submission
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

The list command displays a formatted table with submission details including:
- Submission ID
- Assignment State (e.g., NEEDS_REVISION, SUBMITTED, APPROVED)
- Payment Status (e.g., PENDING, PAID)
- Project ID (when viewing multiple projects)

When filtering by a single project ID, the project ID is shown as a header instead of a column for cleaner output.

Example:
```bash
stb submissions list --project-id proj-456
```

Assignment States:
- `EVALUATION_PENDING` - Waiting for system evaluation
- `NEEDS_REVISION` - Reviewer requested changes (can update)
- `COMPLETED` - Task accepted, waiting for reviewers' review

### 4. Portkey API Access

The CLI provides commands to get OpenAI-compatible API access to Snorkel's LLM platform via Portkey:

#### Refresh Portkey API Key

Request a new Portkey API key:

```bash
stb portkey refresh
```

This command:
- Requests a new Portkey API key using your stored credentials
- Saves the key and gateway URL to your config
- Displays environment variables you can export to use with OpenAI-compatible clients

The Portkey API key has a $10 budget and expires in 30 days.

#### Show Current Portkey Credentials

Display your current Portkey credentials from config:

```bash
stb portkey show
```

This outputs the environment variables needed for OpenAI-compatible API access:
```bash
export OPENAI_API_KEY="your-portkey-key"
export OPENAI_BASE_URL="https://api.portkey.ai/v1"
```

## Common Options

Submission commands support these options:

- `--project-id`: Your project ID (required for create/update, optional for list)
- `--submission-id`: Submission ID for updates (optional - defaults to ID from `.snorkel_config`)

## Getting Help

For command-specific help:
```bash
stb --help
stb submissions --help
stb portkey --help
```

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

### Portkey API Issues

If you get errors with Portkey commands:
- Make sure you've run `stb login` first to authenticate
- Run `stb portkey refresh` to generate a new Portkey API key
- Remember that Portkey keys expire after 30 days and have a $10 budget
- Use `stb portkey show` to verify your current credentials

## Support
For issues or questions, please contact your project administrator or refer to the Snorkel Terminal-Bench documentation.
