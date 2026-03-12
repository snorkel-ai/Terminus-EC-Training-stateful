# Writing Task Instructions and Configuration

In Harbor 2.0, task instructions and configuration are separated into two files:
- **`instruction.md`** — Task instructions shown to the agent (markdown format)
- **`task.toml`** — Task configuration and metadata (TOML format)

Writing clear, unambiguous instructions is critical to task quality.

## instruction.md Structure

The `instruction.md` file contains the task instructions in markdown format. Keep the langauge natural, just how you or any Engineer would interact with an AI agent, and be succinct in terms of the length of the prompt.

**Consult the [Prompt Styling Guide](/portal/docs/reference/prompt-styling) for details on what we are looking for in your written instructions.**


## task.toml Structure

The `task.toml` file contains configuration and metadata:

```toml
# Task configuration schema version
version = "2.0"

# Task metadata (author, difficulty, categorization)
[metadata]
author_name = "anonymous"
author_email = "anonymous"
difficulty = "unknown"
category = "software-engineering"
# Options for subcategories are: "long_context", "tool_specific", "api_integration", "db_interaction", "ui_building"
subcategories = [ ]
# The number of milestones in the task (can be zero if not a milestone task)
number_of_milestones = 0
# Size of the codebase: minimal -> 0-20 files, small -> 20+ files, large -> 200+ files
codebase_size = "minimal"
# Coding languages used in the oracle solution or required by the agent
languages = [ "bash" ]
# For tool_specific, api_integration, and db_interaction subcategories, please include specific tool, api framework, or database software
tags = [ "file-operations",]
# Estimated time to complete (minutes)
expert_time_estimate_min = 60
junior_time_estimate_min = 120

# Verifier: runs the test script to check task completion
[verifier]
timeout_sec = 450.0

# Agent: limits how long the agent can run when attempting the task
[agent]
timeout_sec = 900.0

# Sandbox environment limits
[environment]
build_timeout_sec = 600.0
cpus = 2
memory_mb = 4096
storage_mb = 10240
```


### Metadata Section

| Field | Required | Description |
|-------|----------|-------------|
| `metadata.difficulty` | Yes | `easy`, `medium`, or `hard` |
| `metadata.category` | Yes | From task taxonomy |
| `metadata.tags` | Yes | 3-6 descriptive tags (array) |
| `metadata.codebase_size` | Yes | minimal, small, or large|
| `metadata.author_name` | Yes | Can be 'anonymous'|
| `metadata.author_email` | Yes | Can be 'anonymous' |
| `metadata.number_of_milestones`  | Yes | Integer number of milestones in your task. If no milestones, put **_0_**|
| `metadata.subcategories`  | Yes | List of the subtypes/subcategories that align with your task. If none align, then leave this field blank |

### Verifier Section

| Field | Required | Description |
|-------|----------|-------------|
| `verifier.timeout_sec` | No | Max seconds for verification (default: 120) |

### Agent Section

| Field | Required | Description |
|-------|----------|-------------|
| `agent.timeout_sec` | No | Max seconds for agent execution (default: 120) |

### Environment Section

| Field | Required | Description |
|-------|----------|-------------|
| `environment.build_timeout_sec` | No | Max seconds for build (default: 600) |
| `environment.docker_image` | No | Pre-built Docker image (optional) |
| `environment.cpus` | No | CPU allocation |
| `environment.memory_mb` | No | Memory allocation in MB |
| `environment.storage_mb` | No | Storage allocation in MB |

## Validation

Your task files will be validated by CI checks:

- `validate_task_fields` — All required fields present in `task.toml`
- `check_task_absolute_path` — Uses absolute paths in `instruction.md`
- `file_reference_mentioned` — Output files mentioned in `instruction.md`
- `typos` — No spelling errors

---

## Key Differences from Terminal-Bench

In Harbor 2.0:
- ✅ Instructions are in **markdown** (`instruction.md`) — better formatting and readability
- ✅ Configuration is in **TOML** (`task.toml`) — cleaner nested structure
- ✅ Separation of concerns — instructions vs. metadata
- ✅ No more multiline YAML strings — markdown handles formatting naturally

## Next Steps

- [Understand task components](/portal/docs/understanding-tasks/task-components)
- [Create Docker environment](/portal/docs/creating-tasks/creating-docker-environment)
- [Write oracle solution](/portal/docs/creating-tasks/writing-oracle-solution)
