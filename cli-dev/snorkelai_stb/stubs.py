"""
Stubbed API responses for local development/testing.

Enable stubbing by setting environment variable:
    export STB_DEV_MODE=1
"""
from __future__ import annotations

import os
import time
import uuid
from datetime import datetime, timezone


def is_dev_mode() -> bool:
    """Check if running in dev/stub mode"""
    return os.environ.get("STB_DEV_MODE", "").lower() in ("1", "true", "yes")


# Simulated delays (in seconds) to mimic real API behavior
DELAYS = {
    "api_call": 0.3,
    "upload": 1.5,
    "feedback": 3.0,  # Simulate the long feedback check
}


def stub_delay(operation: str, multiplier: float = 1.0) -> None:
    """Add realistic delay for an operation"""
    delay = DELAYS.get(operation, 0.2) * multiplier
    time.sleep(delay)


# ============================================================================
# STUBBED DATA
# ============================================================================

STUB_PROJECT_ID = "proj-12345678-abcd-1234-efgh-567890abcdef"
STUB_TASK_TYPE = "submission-90223b76-06f9-4006-8f00-3705c1921c29"
STUB_USER_ID = "user-aaaabbbb-cccc-dddd-eeee-ffffgggghhh"
STUB_FEEDBACK_FIELD = "feedbackButton-5fbf3"
STUB_FEEDBACK_ID = "tbench-dry-run-11-07-2025:IN_APP"


def generate_submission_id() -> str:
    """Generate a random submission ID"""
    return str(uuid.uuid4())


def generate_assignment_id() -> str:
    """Generate a random assignment ID"""
    return str(uuid.uuid4())


def stub_get_project_task_type(project_id: str, api_key: str, env: str) -> str:
    """Stub for get_project_task_type"""
    stub_delay("api_call")
    return STUB_TASK_TYPE


def stub_get_assignment_task_id(
    project_id: str, task_type: str, api_key: str, env: str
) -> tuple[str, str]:
    """Stub for get_assignment_task_id - returns (task_id, assignment_id)"""
    stub_delay("api_call")
    return generate_submission_id(), generate_assignment_id()


def stub_get_feedback_button_info(
    project_id: str, api_key: str, env: str
) -> tuple[str, str]:
    """Stub for get_feedback_button_info - returns (field_name, feedback_id)"""
    stub_delay("api_call")
    return STUB_FEEDBACK_FIELD, STUB_FEEDBACK_ID


def stub_request_s3_presigned_url(
    project_id: str,
    task_uuid: str,
    filename: str,
    api_key: str,
    env: str,
) -> tuple[dict, dict]:
    """Stub for request_s3_presigned_url"""
    stub_delay("api_call")
    
    s3_key = f"submissions/{project_id}/{task_uuid}/{filename}"
    s3_uri = f"s3://stub-bucket/{s3_key}"
    
    presigned_response = {
        "presignedUrl": f"https://stub-bucket.s3.amazonaws.com/{s3_key}?signature=stub",
        "s3Key": s3_key,
        "s3Uri": s3_uri,
    }
    
    upload_metadata = {
        "s3_key": s3_key,
        "s3_uri": s3_uri,
        "filename": filename,
        "uploaded_at": datetime.now(timezone.utc).isoformat(),
    }
    
    return presigned_response, upload_metadata


def stub_upload_to_s3(presigned_url: str, file_path) -> None:
    """Stub for upload_to_s3"""
    stub_delay("upload")


def stub_create_feedback(
    task_type_str: str,
    task_id: str,
    feedback_id: str,
    feedback_field_name: str,
    s3_key: str,
    filename: str,
    uploaded_at: str,
    s3_uri: str,
    api_key: str,
    env: str,
    timeout: int,
) -> dict:
    """
    Stub for create_feedback.
    
    Set STB_STUB_FEEDBACK_OUTCOME to control the outcome:
    - "PASS" (default): Feedback passes
    - "FAIL": Feedback fails with sample error
    """
    stub_delay("feedback")
    
    outcome = os.environ.get("STB_STUB_FEEDBACK_OUTCOME", "PASS").upper()
    
    if outcome == "PASS":
        return {
            "feedback_outcome": "PASS",
            "metadata": {
                "static_checks": [
                    {"name": "File Structure", "status": "PASS", "full_logs": "All required files present."},
                    {"name": "Code Linting", "status": "PASS", "full_logs": "No linting errors found."},
                    {"name": "Test Coverage", "status": "PASS", "full_logs": "Coverage: 87%"},
                ]
            }
        }
    else:
        return {
            "feedback_outcome": "FAIL",
            "metadata": {
                "static_checks": [
                    {"name": "File Structure", "status": "PASS", "full_logs": "All required files present."},
                    {"name": "Code Linting", "status": "FAIL", "full_logs": "Error: line 42 - undefined variable 'foo'\nError: line 87 - missing semicolon"},
                    {"name": "Test Coverage", "status": "SKIP", "full_logs": "Skipped due to linting errors."},
                ]
            }
        }


def stub_create_submission(submission_manifest: dict, api_key: str, env: str) -> dict:
    """Stub for create_submission"""
    stub_delay("api_call")
    return {"status": "created", "submission_id": submission_manifest.get("submission_id", {})}


def stub_get_submission_state(
    project_id: str, submission_id: str, api_key: str, env: str
) -> str:
    """
    Stub for get_submission_state.
    
    Set STB_STUB_SUBMISSION_STATE to control the returned state.
    Default: "NEEDS_REVISION"
    """
    stub_delay("api_call")
    return os.environ.get("STB_STUB_SUBMISSION_STATE", "NEEDS_REVISION")


def stub_get_assignment_id(
    project_id: str, submission_id: str, api_key: str, env: str
) -> str:
    """Stub for get_assignment_id"""
    stub_delay("api_call")
    return generate_assignment_id()


def stub_list_submission_ids(project_id: str | None, api_key: str, env: str) -> list:
    """Stub for list_submission_ids"""
    stub_delay("api_call")
    
    return [
        {
            "submission_id": "sub-11111111-aaaa-bbbb-cccc-dddddddddddd",
            "assignee_id": STUB_USER_ID,
            "start_time": "2025-01-10T10:00:00Z",
            "end_time": None,
            "packaging_state": "",
            "assignment_state": "NEEDS_REVISION",
            "project_id": project_id or STUB_PROJECT_ID,
        },
        {
            "submission_id": "sub-22222222-eeee-ffff-gggg-hhhhhhhhhhhh",
            "assignee_id": STUB_USER_ID,
            "start_time": "2025-01-08T14:30:00Z",
            "end_time": "2025-01-09T09:15:00Z",
            "packaging_state": "",
            "assignment_state": "COMPLETED",
            "project_id": project_id or STUB_PROJECT_ID,
        },
        {
            "submission_id": "sub-33333333-iiii-jjjj-kkkk-llllllllllll",
            "assignee_id": STUB_USER_ID,
            "start_time": "2025-01-12T16:45:00Z",
            "end_time": None,
            "packaging_state": "",
            "assignment_state": "EVALUATION_PENDING",
            "project_id": project_id or STUB_PROJECT_ID,
        },
    ]


def stub_get_api_key() -> str:
    """
    Stub for get_api_key.
    
    Set STB_STUB_LOGGED_OUT=1 to simulate not being logged in.
    """
    if os.environ.get("STB_STUB_LOGGED_OUT", "").lower() in ("1", "true", "yes"):
        raise ValueError("No API key found. Set SNORKEL_API_KEY or run 'stb login'")
    return "stub-api-key-for-development"
