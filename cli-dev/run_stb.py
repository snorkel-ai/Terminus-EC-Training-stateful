#!/usr/bin/env python3
"""
Development runner for the STB CLI.

Usage:
    # Run in dev mode (with stubs):
    python run_stb.py submissions create test-task --project-id test-123
    
    # Or set the env var and use like normal:
    export STB_DEV_MODE=1
    python -m snorkelai_stb submissions create test-task --project-id test-123

Control stub behavior with environment variables:
    STB_DEV_MODE=1              Enable stubbed API responses
    STB_STUB_FEEDBACK_OUTCOME   Set to "PASS" or "FAIL" (default: PASS)
    STB_STUB_SUBMISSION_STATE   Set submission state for updates (default: NEEDS_REVISION)
"""

import os
import sys

# Always enable dev mode when running this script
os.environ["STB_DEV_MODE"] = "1"

# Add the current directory to Python path so we can import the local package
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from snorkelai_stb import cli

if __name__ == "__main__":
    cli()
