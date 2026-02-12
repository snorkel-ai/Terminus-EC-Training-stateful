"""Utility functions for Snorkel Terminal-Bench"""
from __future__ import annotations

import json
import os
import ssl
import zipfile
from configparser import ConfigParser
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, TypedDict, cast
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen

import certifi
from platformdirs import user_config_dir
from typing_extensions import NotRequired

# Environment to base URL mapping
ENV_BASE_URLS = {
    "staging": "https://experts-stg.snorkel-ai.com/api/v1",
    "dev": "https://experts-dev.snorkel-ai.com/api/v1",
    "prod": "https://experts.snorkel-ai.com/api/v1",
}

# Config constants
CONFIG_FILE_NAME = ".snorkel_config"  # For folder-level configs
CONFIG_DIR = Path(user_config_dir("stb"))
CONFIG_PATH = CONFIG_DIR / "config.ini"

# Request defaults
DEFAULT_TIMEOUT = 30
FEEDBACK_TIMEOUT = 300  # 5 minutes for feedback (evaluations can take time)


def _get_ssl_context() -> ssl.SSLContext:
    """
    Create an SSL context using certifi's CA bundle.

    This ensures that SSL certificate verification works correctly
    across all platforms, especially on macOS where Python may not
    have access to system certificates by default.

    Returns:
        SSLContext configured with certifi's CA bundle
    """
    return ssl.create_default_context(cafile=certifi.where())


class S3PresignedUrlResponse(TypedDict):
    """Response structure for S3 pre-signed URL request"""

    presignedUrl: str
    s3Key: str
    s3Uri: str


class S3UploadMetadata(TypedDict):
    """Metadata to persist after requesting pre-signed URL"""

    s3_key: str
    s3_uri: str
    filename: str
    uploaded_at: str
    submission_id: NotRequired[str]


def get_base_url(env: str) -> str:
    """Get the base URL for the given environment"""
    return ENV_BASE_URLS.get(env.lower(), ENV_BASE_URLS["prod"])


def validate_s3_url(url: str) -> None:
    """
    Validate that a URL is a legitimate S3 presigned URL.

    Args:
        url: The URL to validate

    Raises:
        ValueError: If the URL is not a valid HTTPS S3 URL
    """
    try:
        parsed = urlparse(url)
    except Exception as e:
        raise ValueError(f"Invalid URL format: {e}") from e

    # Ensure the scheme is HTTPS
    if parsed.scheme != "https":
        raise ValueError(
            f"Invalid URL scheme: '{parsed.scheme}'. Only 'https' is allowed for S3 URLs."
        )

    # Validate that the netloc matches expected S3 domains
    netloc = parsed.netloc.lower()

    # Valid S3 domain patterns:
    # - s3.amazonaws.com
    # - s3-<region>.amazonaws.com (e.g., s3-us-west-2.amazonaws.com)
    # - <bucket>.s3.amazonaws.com
    # - <bucket>.s3-<region>.amazonaws.com (e.g., bucket.s3-us-west-2.amazonaws.com)
    # - s3.dualstack.<region>.amazonaws.com
    # - <bucket>.s3.dualstack.<region>.amazonaws.com
    # - s3-accelerate.amazonaws.com
    # - <bucket>.s3-accelerate.amazonaws.com

    # Check if netloc ends with .amazonaws.com and contains s3 pattern
    if not netloc.endswith(".amazonaws.com") and netloc != "s3.amazonaws.com":
        raise ValueError(
            f"Invalid S3 domain: '{netloc}'. URL does not match expected S3 domain patterns."
        )

    # Additional validation: must contain 's3' in the domain
    # This covers all valid S3 patterns: s3.amazonaws.com, .s3.amazonaws.com,
    # .s3-region.amazonaws.com, etc.
    if "s3" not in netloc:
        raise ValueError(
            f"Invalid S3 domain: '{netloc}'. URL does not match expected S3 domain patterns."
        )


def zip_folder(folder_path: Path, output_zip_path: Path) -> None:
    """
    Zip a folder and all its contents recursively, excluding .snorkel_config file.

    Args:
        folder_path: Path to the folder to zip
        output_zip_path: Path where the output zip file should be created

    Raises:
        FileNotFoundError: If the folder_path does not exist
        ValueError: If folder_path is not a directory
    """
    if not folder_path.exists():
        raise FileNotFoundError(f"Folder does not exist: {folder_path}")

    if not folder_path.is_dir():
        raise ValueError(f"Path is not a directory: {folder_path}")

    with zipfile.ZipFile(output_zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
        # Walk through all files and subdirectories
        for file_path in folder_path.rglob("*"):
            # Skip symlinks
            if file_path.is_symlink():
                continue
            # Skip .snorkel_config file
            if file_path.name == CONFIG_FILE_NAME:
                continue
            if file_path.is_file():
                # Calculate the archive name (relative path from folder_path)
                arcname = file_path.relative_to(folder_path)
                zipf.write(file_path, arcname)


def make_daas_request(
    endpoint: str,
    method: str = "GET",
    api_key: str | None = None,
    data: dict[str, Any] | None = None,
    timeout: int = 30,
) -> dict[str, Any] | list[Any]:
    """
    Make an HTTP request to the DaaS v2 service.

    Args:
        endpoint: The API endpoint URL
        method: HTTP method (GET, POST, PUT, DELETE, etc.)
        api_key: Optional API key for authentication
        data: Optional dictionary to send as JSON body
        timeout: Request timeout in seconds (default: 30)

    Returns:
        Dictionary or list containing the JSON response

    Raises:
        HTTPError: If the HTTP request fails
        URLError: If there's a network connection error
        ValueError: If the response is not valid JSON
    """
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    if api_key:
        headers["x-key"] = api_key

    # Prepare request body if data is provided
    body = json.dumps(data).encode("utf-8") if data else None

    # Create request
    request = Request(endpoint, data=body, headers=headers, method=method)

    try:
        with urlopen(request, timeout=timeout, context=_get_ssl_context()) as response:
            response_data = response.read().decode("utf-8")

            # Handle empty response
            if not response_data or response_data.strip() == "":
                return {}

            result = json.loads(response_data)

            # Handle null response
            if result is None:
                return {}

            # Ensure we return a dict or list (some endpoints return lists)
            if not isinstance(result, (dict, list)):
                raise ValueError(
                    f"Expected dict or list response from API, got "
                    f"{type(result).__name__}: {result}"
                )

            return result
    except HTTPError as e:
        # Read error response if available
        error_body = e.read().decode("utf-8") if e.fp else "No error details"
        raise HTTPError(
            e.url,
            e.code,
            f"HTTP {e.code}: {e.reason}. Details: {error_body}",
            e.headers,
            e.fp,
        ) from e
    except URLError as e:
        raise URLError(f"Network error: {e.reason}") from e
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON response: {e}") from e


def get_daas_resource(
    endpoint: str,
    method: str = "GET",
    api_key: str | None = None,
    data: dict[str, Any] | None = None,
    timeout: int = 30,
) -> dict[str, Any]:
    """
    Request a DaaS resource and return it as a dictionary.

    Use this for endpoints that return a single resource/object.

    Args:
        endpoint: The API endpoint URL
        method: HTTP method (GET, POST, PUT, DELETE, etc.)
        api_key: Optional API key for authentication
        data: Optional dictionary to send as JSON body
        timeout: Request timeout in seconds (default: 30)

    Returns:
        Dictionary containing the resource data

    Raises:
        HTTPError: If the HTTP request fails
        URLError: If there's a network connection error
        ValueError: If the response is not valid JSON or not a dict
    """
    result = make_daas_request(endpoint, method, api_key, data, timeout)
    if not isinstance(result, dict):
        raise ValueError(
            f"Expected dict response from API, got {type(result).__name__}: {result}"
        )
    return result


def list_daas_resources(
    endpoint: str,
    method: str = "GET",
    api_key: str | None = None,
    data: dict[str, Any] | None = None,
    timeout: int = 30,
) -> list[Any]:
    """
    Request a collection of DaaS resources and return them as a list.

    Use this for endpoints that return multiple resources/a collection.

    Args:
        endpoint: The API endpoint URL
        method: HTTP method (GET, POST, PUT, DELETE, etc.)
        api_key: Optional API key for authentication
        data: Optional dictionary to send as JSON body
        timeout: Request timeout in seconds (default: 30)

    Returns:
        List containing the collection of resources

    Raises:
        HTTPError: If the HTTP request fails
        URLError: If there's a network connection error
        ValueError: If the response is not valid JSON or not a list
    """
    result = make_daas_request(endpoint, method, api_key, data, timeout)
    if not isinstance(result, list):
        raise ValueError(
            f"Expected list response from API, got {type(result).__name__}: {result}"
        )
    return result


def get_submission_task_id(
    project_id: str,
    api_key: str,
    env: str = "prod",
    offset: int = 0,
    limit: int = 100,
) -> tuple[str, str]:
    """
    Fetch the submission task ID and task type string for a given project
    from the DaaS assignments endpoint.

    Args:
        project_id: UUID of the project
        api_key: API key for authentication
        env: Environment to use (prod, dev, or staging). Default: prod
        offset: Pagination offset (default: 0)
        limit: Maximum number of tasks to retrieve (default: 100, max: 100)

    Returns:
        A tuple of (task_id, task_type_str) where:
        - task_id: The task ID (UUID string) of the submission task
        - task_type_str: The task type string
          (e.g., "submission-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx")

    Raises:
        HTTPError: If the API request fails
        URLError: If there's a network connection error
        ValueError: If no submission task is found or response is invalid
    """
    # Get the base URL for the environment
    base_url = get_base_url(env)

    # Construct the endpoint URL with query parameters
    # Using assignments endpoint instead of management endpoint (non-admin)
    endpoint = (
        f"{base_url}/assignments"
        f"?project_id={project_id}"
        f"&task=SUBMISSION"
        f"&skip={offset}"
        f"&limit={limit}"
    )

    # Make the request
    response = get_daas_resource(endpoint, method="GET", api_key=api_key)

    # Parse the response to find the submission task
    assignments = response.get("assignments", [])

    if not assignments:
        raise ValueError(
            f"No assignments found for project {project_id}. "
            "Ensure the project is configured with a submission task."
        )

    # Get the first assignment
    assignment = assignments[0]

    # Extract the task ID (handle both string and nested object formats)
    task_id_field = assignment.get("task_id")
    if isinstance(task_id_field, dict):
        task_id = task_id_field.get("id")
    else:
        task_id = task_id_field

    if not task_id:
        raise ValueError(
            "Task ID not found in the assignment response. "
            "The API response format may have changed."
        )

    # Extract task_type from the assignment
    task_type_str = assignment.get("task_type", "")
    if not task_type_str:
        raise ValueError(
            "Task type not found in the assignment response. "
            "The API response format may have changed."
        )

    return task_id, task_type_str


def get_project_task_type(
    project_id: str,
    api_key: str,
    env: str = "prod",
) -> str:
    """
    Fetch the task_type for a project (e.g., "submission-<uuid>").

    Args:
        project_id: UUID of the project
        api_key: API key for authentication
        env: Environment to use (prod, dev, or staging). Default: prod

    Returns:
        The task_type string (e.g., "submission-90223b76-06f9-4006-8f00-3705c1921c29")

    Raises:
        HTTPError: If the API request fails
        URLError: If there's a network connection error
        ValueError: If task_type is not found in response
    """
    base_url = get_base_url(env)
    endpoint = f"{base_url}/projects/{project_id}"

    response = get_daas_resource(endpoint, method="GET", api_key=api_key)

    # Look for the submission task in task_infos array
    task_infos = response.get("task_infos", [])

    submission_task_type = None
    for task_info in task_infos:
        task_category = task_info.get("task_category")
        if task_category == "SUBMISSION":
            submission_task_type = task_info.get("task_type")
            break

    if not submission_task_type:
        raise ValueError(
            f"No SUBMISSION task found in project {project_id} task_infos. "
            "Ensure the project is configured with a submission task."
        )

    return str(submission_task_type)


def create_assignment(
    project_id: str,
    task_type: str,
    api_key: str,
    env: str = "prod",
    timeout: int = 30,
) -> dict[str, Any]:
    """
    Create a new assignment for a project and task type.

    Args:
        project_id: UUID of the project
        task_type: Task type string (e.g., "submission-<uuid>")
        api_key: API key for authentication
        env: Environment to use (prod, dev, or staging). Default: prod
        timeout: Request timeout in seconds (default: 30)

    Returns:
        Dictionary containing the API response

    Raises:
        HTTPError: If the API request fails
        URLError: If there's a network connection error
        ValueError: If the response is not valid JSON
    """
    base_url = get_base_url(env)
    endpoint = f"{base_url}/assignment"

    payload = {
        "project_id": {"id": project_id},
        "task_type": task_type,
    }

    result = get_daas_resource(
        endpoint=endpoint,
        method="POST",
        api_key=api_key,
        data=payload,
        timeout=timeout,
    )

    return result


def get_assignment_task_id(
    project_id: str,
    task_type: str,
    api_key: str,
    env: str = "prod",
    skip: int = 0,
    limit: int = 1,
) -> tuple[str, str]:
    """
    Fetch the task_id and assignment_id from the assignment endpoint for a specific task_type.
    If no assignment is available, creates a new one first.

    Args:
        project_id: UUID of the project
        task_type: Task type string (e.g., "submission-<uuid>")
        api_key: API key for authentication
        env: Environment to use (prod, dev, or staging). Default: prod
        skip: Number of records to skip (default: 0)
        limit: Maximum number of records to retrieve (default: 1)

    Returns:
        A tuple of (task_id, assignment_id) where both are UUID strings

    Raises:
        HTTPError: If the API request fails
        URLError: If there's a network connection error
        ValueError: If no tasks found or required IDs are not in response
    """
    base_url = get_base_url(env)
    endpoint = (
        f"{base_url}/assignment/{project_id}/{task_type}?skip={skip}&limit={limit}"
    )

    response = get_daas_resource(endpoint, method="GET", api_key=api_key)

    tasks = response.get("tasks", [])

    # If no tasks available, create a new assignment
    if not tasks:
        create_assignment(project_id, task_type, api_key, env)

        # Retry fetching after creating assignment
        response = get_daas_resource(endpoint, method="GET", api_key=api_key)

        tasks = response.get("tasks", [])

        if not tasks:
            raise ValueError(
                f"No tasks found in assignment after creation for project "
                f"{project_id} and task_type {task_type}. Response: {response}"
            )

    # Get the first task
    task = tasks[0]

    # Extract task_id
    task_id_field = task.get("task_id")
    if isinstance(task_id_field, dict):
        task_id = task_id_field.get("id")
    else:
        task_id = task_id_field

    if not task_id:
        raise ValueError(
            "task_id not found in assignment response. "
            "The API response format may have changed."
        )

    # Extract assignment_id
    assignment_id_field = task.get("assignment_id")
    if isinstance(assignment_id_field, dict):
        assignment_id = assignment_id_field.get("id")
    else:
        assignment_id = assignment_id_field

    if not assignment_id:
        raise ValueError(
            "assignment_id not found in assignment response. "
            "The API response format may have changed."
        )

    return str(task_id), str(assignment_id)


def get_feedback_button_info(
    project_id: str,
    api_key: str,
    env: str = "prod",
) -> tuple[str, str]:
    """
    Fetch the feedback button field name and feedback_id from the project's form_schema.

    Args:
        project_id: UUID of the project
        api_key: API key for authentication
        env: Environment to use (prod, dev, or staging). Default: prod

    Returns:
        A tuple of (field_name, feedback_id) where:
        - field_name: The field name for the feedback button (e.g., "feedbackButton-5fbf3")
        - feedback_id: The feedback deployment ID (e.g., "tbench-dry-run-11-07-2025:IN_APP")

    Raises:
        HTTPError: If the API request fails
        URLError: If there's a network connection error
        ValueError: If no feedback button field is found in the form schema
    """
    # Get the base URL for the environment
    base_url = get_base_url(env)

    # Fetch project details
    endpoint = f"{base_url}/projects/{project_id}"

    response = get_daas_resource(endpoint, method="GET", api_key=api_key)

    # Extract form_schema
    form_schema = response.get("form_schema") or {}
    sections = form_schema.get("sections", [])

    # Look for feedbackButton field
    for section in sections:
        fields = section.get("fields", [])
        for field in fields:
            if field.get("type") == "feedbackButton":
                field_name = field.get("field")
                feedback_id = field.get("feedbackId")

                if field_name and feedback_id:
                    return str(field_name), str(feedback_id)

    # No feedbackButton field found
    raise ValueError(
        f"No feedbackButton field found in project {project_id} form_schema. "
        "The project may not be configured correctly for feedback."
    )


def upload_to_s3(
    presigned_url: str,
    file_path: Path,
    timeout: int = 300,
) -> None:
    """
    Upload a file to S3 using a pre-signed URL.

    Args:
        presigned_url: The pre-signed URL from S3
        file_path: Path to the file to upload
        timeout: Request timeout in seconds (default: 300 seconds / 5 minutes)

    Raises:
        FileNotFoundError: If the file does not exist
        ValueError: If the presigned URL is not a valid S3 URL
        HTTPError: If the upload fails (non-2xx response)
        URLError: If there's a network connection error
    """
    if not file_path.exists():
        raise FileNotFoundError(f"File does not exist: {file_path}")

    # Validate the presigned URL to prevent SSRF attacks
    validate_s3_url(presigned_url)

    # Read the file contents
    with open(file_path, "rb") as f:
        file_data = f.read()

    # Create PUT request (industry standard for S3) with Content-Length header
    headers = {
        "Content-Length": str(len(file_data)),
        "Content-Type": "application/zip",
    }

    request = Request(presigned_url, data=file_data, headers=headers, method="PUT")

    try:
        with urlopen(request, timeout=timeout, context=_get_ssl_context()) as response:
            # Any non-2xx response is treated as failure
            if response.status < 200 or response.status >= 300:
                raise HTTPError(
                    presigned_url,
                    response.status,
                    f"S3 upload failed with status {response.status}",
                    response.headers,
                    None,
                )
    except HTTPError as e:
        # Read error response if available
        error_body = e.read().decode("utf-8") if e.fp else "No error details"
        raise HTTPError(
            e.url,
            e.code,
            f"S3 upload failed - HTTP {e.code}: {e.reason}. Details: {error_body}",
            e.headers,
            e.fp,
        ) from e
    except URLError as e:
        raise URLError(f"Network error during S3 upload: {e.reason}") from e


def request_s3_presigned_url(
    project_id: str,
    task_uuid: str,
    filename: str,
    api_key: str,
    env: str = "prod",
    timeout: int = 30,
) -> tuple[S3PresignedUrlResponse, S3UploadMetadata]:
    """
    Request a pre-signed S3 URL for uploading a file.

    Args:
        project_id: UUID of the project
        task_uuid: UUID of the task
        filename: Name of the file to upload (typically a ZIP file)
        api_key: API key for authentication
        env: Environment to use (prod, dev, or staging). Default: prod
        timeout: Request timeout in seconds (default: 30)

    Returns:
        A tuple containing:
        - S3PresignedUrlResponse: The API response with presignedUrl, s3Key, and s3Uri
        - S3UploadMetadata: Metadata to persist for later use (s3_key, s3_uri, filename,
          uploaded_at)

    Raises:
        HTTPError: If the API request fails
        URLError: If there's a network connection error
        ValueError: If the response is missing required fields
    """
    # Get the base URL for the environment
    base_url = get_base_url(env)

    # Construct the endpoint URL
    endpoint = (
        f"{base_url}/s3-file-loader/presigned-put/{project_id}/{task_uuid}"
        f"?filename={filename}"
    )

    # Prepare headers with API key authentication
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "x-key": api_key,
    }

    # Create POST request (no body needed, filename is in query param)
    request = Request(endpoint, headers=headers, method="POST")

    try:
        with urlopen(request, timeout=timeout, context=_get_ssl_context()) as response:
            response_data = response.read().decode("utf-8")
            result: dict[str, Any] = json.loads(response_data)

            # Handle both camelCase and snake_case field names
            presigned_url = result.get("presignedUrl") or result.get(
                "presigned_put_url"
            )
            s3_key = result.get("s3Key") or result.get("s3_key")
            s3_uri = result.get("s3Uri") or result.get("s3_uri")

            # Validate response has required fields
            if not presigned_url or not s3_key or not s3_uri:
                missing = []
                if not presigned_url:
                    missing.append("presignedUrl/presigned_put_url")
                if not s3_key:
                    missing.append("s3Key/s3_key")
                if not s3_uri:
                    missing.append("s3Uri/s3_uri")
                raise ValueError(
                    f"API response missing required fields: {', '.join(missing)}. "
                    f"Response: {result}"
                )

            # Create the response object
            presigned_response: S3PresignedUrlResponse = {
                "presignedUrl": presigned_url,
                "s3Key": s3_key,
                "s3Uri": s3_uri,
            }

            # Create metadata to persist with current timestamp
            upload_metadata: S3UploadMetadata = {
                "s3_key": s3_key,
                "s3_uri": s3_uri,
                "filename": filename,
                "uploaded_at": datetime.now(timezone.utc).isoformat(),
            }

            return presigned_response, upload_metadata

    except HTTPError as e:
        # Read error response if available
        error_body = e.read().decode("utf-8") if e.fp else "No error details"
        raise HTTPError(
            e.url,
            e.code,
            f"HTTP {e.code}: {e.reason}. Details: {error_body}",
            e.headers,
            e.fp,
        ) from e
    except URLError as e:
        raise URLError(f"Network error: {e.reason}") from e
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON response: {e}") from e


def create_feedback(
    task_type_str: str,
    task_id: str,
    feedback_id: str,
    feedback_field_name: str,
    s3_key: str,
    filename: str,
    uploaded_at: str,
    s3_uri: str,
    api_key: str,
    env: str = "prod",
    timeout: int = 30,
) -> dict[str, Any]:
    """
    Create feedback for a submission via the Feedback API.

    Args:
        task_type_str: Task type string (e.g., "submission-<submission_uuid>")
        task_id: The task ID (UUID string) of the submission task
        feedback_id: Deployment name from evaluation service (e.g., "tbench-dry-run:IN_APP")
        feedback_field_name: The field name for the feedback button (from get_feedback_button_info)
        s3_key: S3 key of the uploaded file
        filename: Name of the uploaded file
        uploaded_at: ISO timestamp of when the file was uploaded
        s3_uri: S3 URI of the uploaded file
        api_key: API key for authentication
        env: Environment to use (prod, dev, or staging). Default: prod
        timeout: Request timeout in seconds (default: 30)

    Returns:
        Dictionary containing the API response

    Raises:
        HTTPError: If the API request fails
        URLError: If there's a network connection error
        ValueError: If the response is not valid JSON
    """
    # Get the base URL for the environment
    base_url = get_base_url(env)

    # Construct the endpoint URL
    endpoint = f"{base_url}/feedback/"

    # Prepare the request payload
    payload = {
        "task_type_str": task_type_str,
        "task_id": {"id": task_id},
        "task_data": {
            "evaluation_type": "IN_APP",
            "data": {
                "upload_a_zip_file": {
                    "s3Key": s3_key,
                    "filename": filename,
                    "uploadedAt": uploaded_at,
                    "s3Uri": s3_uri,
                },
                feedback_field_name: None,
            },
        },
        "feedback_id": feedback_id,
    }

    # Make the request using the shared helper
    return get_daas_resource(
        endpoint=endpoint,
        method="POST",
        api_key=api_key,
        data=payload,
        timeout=timeout,
    )


def create_submission(
    submission_manifest: dict[str, Any],
    api_key: str,
    env: str = "prod",
    timeout: int = 30,
) -> dict[str, Any]:
    """
    Create or update a submission via the Submission API.

    This function handles both creation and update operations - the API uses the same
    endpoint and method (POST) for both. The operation type is determined by whether
    the submission_id in the manifest already exists in the system.

    Args:
        submission_manifest: The submission payload containing all submission data.
            Must include submission_id, submission_payload, selected_segments, etc.
        api_key: API key for authentication
        env: Environment to use (prod, dev, or staging). Default: prod
        timeout: Request timeout in seconds (default: 30)

    Returns:
        Dictionary containing the API response

    Raises:
        HTTPError: If the API request fails
        URLError: If there's a network connection error
        ValueError: If the response is not valid JSON
    """
    # Get the base URL for the environment
    base_url = get_base_url(env)

    # Construct the endpoint URL
    # Note: The endpoint is the same for both create and update operations
    endpoint = f"{base_url}/submissions/submission"

    # Make the request using the shared helper
    return get_daas_resource(
        endpoint=endpoint,
        method="POST",
        api_key=api_key,
        data=submission_manifest,
        timeout=timeout,
    )


class SubmissionInfo(TypedDict):
    """Information about a submission"""

    submission_id: str
    assignee_id: str
    start_time: str
    end_time: str | None
    packaging_state: str
    assignment_state: str
    project_id: str


def get_current_user_info(
    api_key: str,
    env: str = "prod",
    timeout: int = 30,
) -> dict[str, str]:
    """
    Get the current user's information based on the API key.

    Args:
        api_key: API key for authentication
        env: Environment to use (prod, dev, or staging). Default: prod
        timeout: Request timeout in seconds (default: 30)

    Returns:
        Dictionary with 'user_id' and 'email' keys

    Raises:
        HTTPError: If the API request fails
        URLError: If there's a network connection error
        ValueError: If the response is not valid JSON or missing user info
    """
    # Get the base URL for the environment
    base_url = get_base_url(env)

    # Construct the endpoint URL - using /users/me or similar endpoint
    endpoint = f"{base_url}/users/me"

    # Make the request using the shared helper
    response = get_daas_resource(
        endpoint=endpoint,
        method="GET",
        api_key=api_key,
        timeout=timeout,
    )

    # Extract user ID from response
    user_id = response.get("user_id") or response.get("id")
    if user_id:
        # Handle both string and nested object formats
        if isinstance(user_id, dict):
            user_id_str = str(user_id.get("id", ""))
        else:
            user_id_str = str(user_id)
    else:
        raise ValueError(
            f"Could not extract user_id from response. Response: {response}"
        )

    # Extract email from response
    email = response.get("email", "")
    if not email:
        raise ValueError(f"Could not extract email from response. Response: {response}")

    return {
        "user_id": user_id_str,
        "email": str(email),
    }


def get_current_user_id(
    api_key: str,
    env: str = "prod",
    timeout: int = 30,
) -> str:
    """
    Get the current user's ID based on the API key.

    Args:
        api_key: API key for authentication
        env: Environment to use (prod, dev, or staging). Default: prod
        timeout: Request timeout in seconds (default: 30)

    Returns:
        The current user's ID (UUID string)

    Raises:
        HTTPError: If the API request fails
        URLError: If there's a network connection error
        ValueError: If the response is not valid JSON or missing user_id
    """
    user_info = get_current_user_info(api_key, env, timeout)
    return user_info["user_id"]


def list_submission_ids(
    project_id: str | None,
    api_key: str,
    env: str = "prod",
) -> list[SubmissionInfo]:
    """
    List submissions assigned to the current user.

    Args:
        project_id: UUID of the project (optional - if None, lists all submissions)
        api_key: API key for authentication
        env: Environment to use (prod, dev, or staging). Default: prod

    Returns:
        List of submission info dictionaries containing submission_id, assignee_id,
        start_time, end_time, packaging_state, assignment_state, and project_id

    Raises:
        HTTPError: If the API request fails
        URLError: If there's a network connection error
        ValueError: If the response is not valid JSON
    """
    # Get the base URL for the environment
    base_url = get_base_url(env)

    # Fetch assignments with different statuses using separate API calls
    # Note: API already scopes to current user based on API key

    all_assignments = []
    statuses_to_fetch = ["NEEDS_REVISION", "EVALUATION_PENDING", "COMPLETED"]

    for assignment_status in statuses_to_fetch:
        # Construct the endpoint URL with assignment_status query parameter
        endpoint = f"{base_url}/assignment?assignment_status={assignment_status}"

        # Add project_id filter if provided
        if project_id:
            endpoint += f"&project_id={project_id}"

        # Make the request using the shared helper
        response = get_daas_resource(
            endpoint=endpoint,
            method="GET",
            api_key=api_key,
            timeout=DEFAULT_TIMEOUT,
        )

        # Extract assignments from response
        # The response structure may vary, try to get assignments or tasks
        page_assignments = response.get("assignments", []) or response.get("tasks", [])

        # Tag each assignment with the status we used to fetch it
        # This ensures we always have a fallback status value
        for assignment in page_assignments:
            # Always set the fetched status as a fallback, so we know which query returned it
            assignment["_fetched_with_status"] = assignment_status

        # Extend the list with current page results
        all_assignments.extend(page_assignments)

    # Convert assignments to submission info format
    submissions = []
    for assignment in all_assignments:

        # Extract submission_id (preferred) or fall back to task_id
        submission_id_field = assignment.get("submission_id") or assignment.get(
            "task_id"
        )
        if isinstance(submission_id_field, dict):
            submission_id = submission_id_field.get("id", "")
        else:
            submission_id = submission_id_field or ""

        # Extract assignee_id
        assignee_id_field = assignment.get("assignee_id")
        if isinstance(assignee_id_field, dict):
            assignee_id = assignee_id_field.get("id", "")
        else:
            assignee_id = assignee_id_field or ""

        # Extract other fields
        start_time = assignment.get("created_at") or ""  # Use created_at as start_time
        end_time = assignment.get("submitted_at")  # Use submitted_at as end_time

        # Extract state - look for assignment_status first, then fall back to status,
        # then use the status we fetched with (since we filtered by status)
        assignment_state = (
            assignment.get("assignment_status")
            or assignment.get("status")
            or assignment.get("_fetched_with_status")
            or ""
        )

        # Packaging state might not be in assignments response, try to get it
        packaging_state = assignment.get("packaging_state") or ""

        # Extract project_id
        project_id_field = assignment.get("project_id")
        if isinstance(project_id_field, dict):
            project_id_value = project_id_field.get("id", "")
        else:
            project_id_value = project_id_field or ""

        # Apply client-side project_id filter if provided
        # (belt and suspenders approach - filter even though we passed it in the query)
        if project_id and project_id_value and project_id_value != project_id:
            continue

        submissions.append(
            {
                "submission_id": submission_id,
                "assignee_id": assignee_id,
                "start_time": start_time,
                "end_time": end_time,
                "packaging_state": packaging_state,
                "assignment_state": assignment_state,
                "project_id": project_id_value,
            }
        )

    return cast(list[SubmissionInfo], submissions)


def get_assignment_id(
    project_id: str,
    submission_id: str,
    api_key: str,
    env: str = "prod",
    timeout: int = 30,
) -> str:
    """
    Get the assignment ID for a specific submission.

    Args:
        project_id: UUID of the project
        submission_id: UUID of the submission (task_id)
        api_key: API key for authentication
        env: Environment to use (prod, dev, or staging). Default: prod
        timeout: Request timeout in seconds (default: 30)

    Returns:
        The assignment ID (UUID string)

    Raises:
        HTTPError: If the API request fails
        URLError: If there's a network connection error
        ValueError: If the submission is not found or response is invalid
    """
    # Get the base URL for the environment
    base_url = get_base_url(env)

    # Query the assignments endpoint with the specific task_id (submission_id)
    endpoint = f"{base_url}/assignments?task_id={submission_id}&project_id={project_id}"

    response = get_daas_resource(
        endpoint=endpoint,
        method="GET",
        api_key=api_key,
        timeout=timeout,
    )

    # Extract assignments from response
    assignments = response.get("assignments", [])

    if not assignments:
        raise ValueError(
            f"Submission with ID '{submission_id}' not found in project '{project_id}'"
        )

    # Get the first (and should be only) assignment
    assignment = assignments[0]

    # Extract assignment_id
    assignment_id_field = assignment.get("assignment_id")
    if isinstance(assignment_id_field, dict):
        assignment_id = assignment_id_field.get("id", "")
    else:
        assignment_id = assignment_id_field or ""

    if not assignment_id:
        raise ValueError(
            f"Could not extract assignment_id from response for submission '{submission_id}'"
        )

    return str(assignment_id)


def get_submission_state(
    project_id: str,
    submission_id: str,
    api_key: str,
    env: str = "prod",
    timeout: int = 30,
) -> str:
    """
    Get the assignment state of a specific submission.

    Args:
        project_id: UUID of the project
        submission_id: UUID of the submission to check
        api_key: API key for authentication
        env: Environment to use (prod, dev, or staging). Default: prod
        timeout: Request timeout in seconds (default: 30)

    Returns:
        The assignment state of the submission (e.g., "NEEDS_REVISION", "SUBMITTED", etc.)

    Raises:
        HTTPError: If the API request fails
        URLError: If there's a network connection error
        ValueError: If the submission is not found, ID doesn't match exactly, or response is invalid
    """
    # Get the base URL for the environment
    base_url = get_base_url(env)

    # Query different assignment statuses to find which one contains our submission
    # The /assignments endpoint often returns status: null, so we use the filtered
    # /assignment endpoint which properly filters by status
    statuses_to_check = [
        "NEEDS_REVISION",
        "EVALUATION_PENDING",
        "COMPLETED",
        "ACCEPTED",
        "OFFERED",
        "REJECTED",
        "SKIPPED",
        "READY_TO_PACKAGE",
        "READY_TO_DELIVER",
        "DELIVERED",
    ]

    for status in statuses_to_check:
        endpoint = (
            f"{base_url}/assignment?assignment_status={status}&project_id={project_id}"
        )

        try:
            response = get_daas_resource(
                endpoint=endpoint,
                method="GET",
                api_key=api_key,
                timeout=timeout,
            )

            # Extract assignments/tasks from response
            assignments = response.get("assignments", []) or response.get("tasks", [])

            # Look for our submission in this status
            for assignment in assignments:
                # Extract task_id from assignment
                task_id_field = assignment.get("task_id")
                if isinstance(task_id_field, dict):
                    task_id = task_id_field.get("id", "")
                else:
                    task_id = task_id_field or ""

                # If this is our submission, return the status we found it in
                if task_id == submission_id:
                    return status

        except HTTPError:
            # If this status filter fails, continue to the next one
            continue

    # If we didn't find the submission in any status, raise an error
    raise ValueError(
        f"Submission with ID '{submission_id}' not found in project '{project_id}' "
        "in any known assignment state"
    )


class Config:
    """
    Centralized config management using configparser.

    Global config location (via platformdirs):
    - Linux: ~/.config/stb/config.ini
    - macOS: ~/Library/Application Support/stb/config.ini
    - Windows: C:\\Users\\<user>\\AppData\\Local\\stb\\config.ini
    """

    _instance: ConfigParser | None = None

    @classmethod
    def _get_parser(cls) -> ConfigParser:
        """Get or create the config parser instance"""
        if cls._instance is None:
            cls._instance = ConfigParser()
            if CONFIG_PATH.exists():
                cls._instance.read(CONFIG_PATH)
        return cls._instance

    @classmethod
    def get(cls, section: str, key: str, fallback: str | None = None) -> str | None:
        """Get a config value"""
        return cls._get_parser().get(section, key, fallback=fallback)

    @classmethod
    def set(cls, section: str, key: str, value: str) -> None:
        """Set a config value and save to disk"""
        parser = cls._get_parser()
        if not parser.has_section(section):
            parser.add_section(section)
        parser.set(section, key, value)
        cls._save()

    @classmethod
    def _save(cls) -> None:
        """Save config to disk with secure permissions"""
        CONFIG_DIR.mkdir(parents=True, exist_ok=True)
        with open(CONFIG_PATH, "w") as f:
            cls._get_parser().write(f)
        CONFIG_PATH.chmod(0o600)

    @classmethod
    def reset(cls) -> None:
        """Reset the cached parser (useful for testing)"""
        cls._instance = None


# Folder-level config functions (.snorkel_config in task folders)


def config_file_exists(folder_path: Path) -> bool:
    """Check if .snorkel_config exists in folder"""
    return (folder_path / CONFIG_FILE_NAME).exists()


def read_config_file(folder_path: Path) -> dict[str, str]:
    """Read .snorkel_config from folder (simple key: value format)"""
    config_path = folder_path / CONFIG_FILE_NAME
    if not config_path.exists():
        raise FileNotFoundError(f"Config file not found: {config_path}")

    config = {}
    with open(config_path) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if ":" in line:
                key, value = line.split(":", 1)
                config[key.strip()] = value.strip()

    if "submission_id" not in config:
        raise ValueError("Config file missing 'submission_id' field")
    return config


def write_config_file(folder_path: Path, submission_id: str) -> None:
    """Write submission_id to .snorkel_config in folder"""
    config_path = folder_path / CONFIG_FILE_NAME
    with open(config_path, "w") as f:
        f.write(f"submission_id: {submission_id}\n")


# Global config functions (using Config class)


def get_api_key() -> str:
    """
    Get API key from environment variable or global config.

    Checks in order:
    1. SNORKEL_API_KEY environment variable
    2. Global config file

    Returns:
        API key string

    Raises:
        ValueError: If no API key is found
    """
    # Check environment variable first
    api_key = os.environ.get("SNORKEL_API_KEY")
    if api_key:
        return api_key

    # Fall back to global config
    api_key = Config.get("auth", "api_key")
    if api_key:
        return api_key

    raise ValueError("No API key found. Set SNORKEL_API_KEY or run 'stb login'")


def set_api_key(api_key: str) -> None:
    """Save API key to global config"""
    Config.set("auth", "api_key", api_key)


# ============================================================================
# DEV MODE STUB REPLACEMENT
# ============================================================================
# When STB_DEV_MODE=1, replace real API functions with stubs for local testing

def _is_dev_mode() -> bool:
    """Check if running in dev/stub mode"""
    return os.environ.get("STB_DEV_MODE", "").lower() in ("1", "true", "yes")


if _is_dev_mode():
    from snorkelai_stb.stubs import (
        stub_get_project_task_type,
        stub_get_assignment_task_id,
        stub_get_feedback_button_info,
        stub_request_s3_presigned_url,
        stub_upload_to_s3,
        stub_create_feedback,
        stub_create_submission,
        stub_get_submission_state,
        stub_get_assignment_id,
        stub_list_submission_ids,
        stub_get_api_key,
    )
    
    # Replace real functions with stubs
    get_project_task_type = stub_get_project_task_type
    get_assignment_task_id = stub_get_assignment_task_id
    get_feedback_button_info = stub_get_feedback_button_info
    request_s3_presigned_url = stub_request_s3_presigned_url
    upload_to_s3 = stub_upload_to_s3
    create_feedback = stub_create_feedback
    create_submission = stub_create_submission
    get_submission_state = stub_get_submission_state
    get_assignment_id = stub_get_assignment_id
    list_submission_ids = stub_list_submission_ids
    get_api_key = stub_get_api_key
    
    # Only show dev mode notice if verbose
    if os.environ.get("STB_VERBOSE", "").lower() in ("1", "true", "yes"):
        print("🔧 STB DEV MODE: Using stubbed API responses")
