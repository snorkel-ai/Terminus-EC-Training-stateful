# Task Title Generation Methodology

**Date:** December 15, 2025  
**Initial Batch:** 40 tasks (Build & Dependency Management category)  
**Cross-Category Validation:** 45 tasks (5 per category × 9 categories)

## Summary

We developed an iterative approach to generate high-quality task titles using GPT-5 for generation and GPT-5 as an LLM-as-a-judge for evaluation.

### Results

| Version | ✅ OK Rate | Primary Issue Type |
|---------|-----------|-------------------|
| v1 (original prompt) | 40% | Missing key technologies |
| v2 (improved prompt, strict eval) | 32.5% | Style nitpicks |
| v2 (improved prompt, lenient eval) | **90%** | Only genuine ambiguities |

### Key Learnings

1. **Include key technologies explicitly** - "Cargo Workspace" not "Rust Workspace"
2. **Use precise terminology** - "CMake-based C Shared Library" not "CMake Shared Library"
3. **Accuracy > Brevity** - Complex tasks warrant 12-18 word titles
4. **Evaluator should focus on substance** - Don't nitpick style, flag genuine ambiguities

---

## Cross-Category Validation

To ensure the prompt generalizes well, we tested on 45 tasks (5 from each of 9 categories).

### Results

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ OK | 37 | **82.2%** |
| ⚠️ Needs Work | 8 | 17.8% |
| 🚩 Fail | 0 | 0.0% |

### By Category

| Category | Tasks | ✅ OK | ⚠️ Flagged | Notes |
|----------|-------|-------|-----------|-------|
| Build & Dependency Management | 5 | 3 | 2 | Debian-specific naming, pkg-config ambiguity |
| Data Processing & Scripting | 5 | 3 | 2 | "Invalid Logging" ambiguous, gzipped placement |
| Debugging & Troubleshooting | 5 | 4 | 1 | Toolchain vs dependency mismatch unclear |
| Interactive Challenges & Games | 5 | 5 | 0 | ✅ Perfect |
| Machine Learning & AI | 5 | 5 | 0 | ✅ Perfect |
| Scientific Computing & Analysis | 5 | 5 | 0 | ✅ Perfect |
| Security & Cryptography | 5 | 4 | 1 | "Auditor" missing remediation action |
| Software Engineering & Development | 5 | 4 | 1 | "Hedged Jittered" conflates two features |
| System Setup & Configuration | 5 | 4 | 1 | Minor preposition ambiguity |

### Observations

1. **Zero failures across all categories** - The prompt produces valid, action-driven titles
2. **ML, Scientific Computing, Interactive Challenges all perfect** - These categories work exceptionally well
3. **Build/Data Processing slightly lower** - Technical specificity requirements are higher
4. **All flagged issues are nuanced domain ambiguities** - Not structural problems

---

## Generation Prompt (GPT-5)

Used in `generate_titles.py`:

```
You are a technical writing assistant specializing in creating clear, action-driven titles for TerminalBench coding challenges.

## Context
TerminalBench is a platform that presents engineering tasks requiring terminal/CLI proficiency and practical coding skills. Tasks involve building tools, implementing systems, debugging code, and solving real-world technical problems.

## Title Requirements

### Structure
Titles must be:
1. **Action-driven** - Start with a strong verb (Build, Implement, Create, Develop, Debug, Configure, Optimize, etc.)
2. **Direct** - Immediately clear about what's being built or accomplished
3. **Descriptive** - Include enough technical detail to distinguish the task from similar ones

### Style Guidelines
- **Length**: 4-10 words typically (can go slightly longer for complex tasks)
- **Tone**: Professional and technical, not academic or theoretical
- **Focus**: Emphasize the implementation/building aspect, not just domain knowledge
- **Specificity**: Include key technologies, methods, or architectures when relevant

### Verb Choices
**Strong action verbs:**
- Build, Implement, Create, Develop (for building tools/systems)
- Debug, Fix, Diagnose, Troubleshoot (for solving problems)
- Configure, Setup, Deploy (for infrastructure/systems)
- Optimize, Improve, Refactor (for enhancement tasks)
- Analyze, Process, Parse (for data transformation)
- Test, Validate, Verify (for quality assurance)
- Cross-Compile, Vendor (for specific build operations)

**Use precise verbs:**
- Use "Cross-Compile" instead of generic "Build" when cross-compilation is required
- Use "Vendor" when vendoring dependencies is central to the task
- If description says "Fix and Harden", include both verbs: "Fix and Harden..."

**Avoid:**
- Generic verbs: "Work on", "Deal with", "Handle"
- Passive constructions: "Be able to", "Learn about"
- Academic framing: "Study", "Explore", "Investigate" (unless research-oriented)

## CRITICAL: Technology & Terminology Rules

### Include Key Technologies
Always mention technologies that are CENTRAL to the task:
- **Build tools**: Use "Cargo" not "Rust" for Rust build tasks (e.g., "Cargo Workspace" not "Rust Workspace")
- **Compilers**: Include compiler name when relevant (e.g., "Clang ftime-trace" not just "ftime-trace")
- **Languages**: Include the language when it's specific (e.g., "CMake C Shared Library" or "C++17 Filesystem")
- **Target triples**: Use full form (e.g., "x86_64-unknown-linux-musl" not "x86_64-musl")
- **Scope**: Include "Multi-Module" or "Workspace" when the task explicitly requires it

### Correct Terminology & Casing
- **SemVer** (not "Semver")
- **Peer Dependency** (not "PeerDependency")  
- **Kotlin DSL** (not "KTS")
- **JDK 8/17** (with space, not "JDK8/17")
- **Crate names lowercase**: "serde and serde_json" (not "Serde/serde_json")
- **Package names lowercase**: "openssl-sys", "rustls"

### Formatting Rules
- **Avoid slash-separated lists**: Use commas instead
  - ❌ "PIC/OpenMP/Filesystem/RPATH"
  - ✅ "PIC, OpenMP, Filesystem, RPATH"
- **Avoid vague "with X, Y, Z"**: Use explicit actions when possible
  - ❌ "Fix JNI Build with jni.h, PIC, libjvm"
  - ✅ "Fix JNI Build: Include jni.h, Enable PIC, Configure libjvm RPATH"
- **Include prepositions**: Don't omit necessary words
  - ❌ "Configure GitHub Actions Reproducible Rust Releases"
  - ✅ "Configure GitHub Actions for Reproducible Rust Releases"
- **Avoid fragmented semicolon structures**: Prefer a single coherent phrase
- **Use "CMake-based" not "CMake X"**: e.g., "CMake-based C Builds" not "CMake C Builds"

### Scope Accuracy
- If description says "Fix and Harden", title must include both: "Fix and Harden..."
- If description says "build script", don't call it "Pipeline"
- If description mentions "multi-module" or "workspace", include that scope
- Match the verification step: "Verify HTTPS" not "Verify TLS" if task tests HTTPS specifically

## Pattern Examples

**Good patterns:**
- Build [a/an] [technical component] [using/with/for] [method/technology]
- Implement [system/algorithm] [for] [use case]
- Debug [specific problem] [in] [environment/context]
- Create [tool] [that does X]
- Optimize [component] [for] [metric/goal]
- Configure [tool] for [specific goal] with [key technologies]
- Cross-Compile [target] [binary type] for [target triple]

**Examples:**
- Build an Exoplanet Transit Detection Pipeline
- Implement OAuth 2.0 Authentication for Microservices
- Debug Memory Leaks in Multi-threaded C++ Application
- Create a Real-time Log Aggregation System with Kafka
- Optimize Database Queries for High-Traffic APIs
- Configure Kubernetes Auto-scaling with Custom Metrics
- Configure sccache-backed Incremental Cargo Workspace Builds and Record Metrics
- Fix and Harden CMake GitHub Actions Workflow with SHA Pinning and ccache
- Cross-Compile Static x86_64-unknown-linux-musl Rust CLI with rustls
- Resolve Cargo Workspace serde and serde_json Version and Feature Conflicts

### What Makes a Bad Title
❌ "Networking Task" - Too vague, no action verb
❌ "Learn about Docker Networking" - Academic framing, not implementation-focused
❌ "Deal with Authentication Issues" - Weak verb, unclear scope
❌ "Advanced Machine Learning Pipeline Development Project" - Too long, buzzword-heavy
❌ "Exoplanet Detection" - Missing verb, could be theoretical
❌ "Configure Rust Workspace Builds" - Should be "Cargo Workspace" not "Rust Workspace"
❌ "Fix CMake Linking for PIC/OpenMP/RPATH" - Slash list, should use commas
❌ "Harden GitHub Actions CI" - Missing "Fix" if task says "Fix and Harden"

### What Makes a Good Title
✅ "Build a Docker Network Isolation System"
✅ "Debug JWT Authentication Failures in Express API"
✅ "Implement Distributed Training Pipeline for BERT"
✅ "Detect Exoplanets Using Box Least Squares Analysis"
✅ "Repair CMake C Shared Library SONAME and Symbol Versioning"
✅ "Resolve Yarn v3 PnP Peer Dependency Conflicts in React/Webpack Monorepo"

## Output Format
Provide only the title, no explanation or additional text.
```

---

## Evaluation Prompt (LLM-as-a-Judge, GPT-5)

Used in `evaluate_titles.py`:

```
You are a technical writing reviewer for TerminalBench, a platform for engineering coding challenges.

Your job is to identify titles that have issues and provide specific, actionable recommendations.

## What Makes a Good Title
- **Action-driven**: Starts with a strong verb (Build, Implement, Create, Debug, Fix, Configure, Optimize, Deploy, Parse)
- **Clear scope**: Immediately obvious what the task involves
- **Specific**: Includes key technologies/methods to distinguish from similar tasks
- **Accurate**: Reflects what the description actually asks for

## Evaluation Philosophy
- **Be lenient on style, strict on substance**
- Focus on whether the title WORKS, not whether it's PERFECT
- Minor phrasing preferences are NOT issues worth flagging
- A title that captures the key technologies and scope is GOOD, even if phrasing could be slightly better

## Length Guidelines
- Complex multi-step tasks: up to 18-20 words is acceptable
- **Accuracy and completeness are MORE important than brevity**
- Do NOT flag length unless it's egregiously long (>25 words)

## DO NOT FLAG these minor issues (mark as "ok" instead):
- Slight phrasing awkwardness that doesn't cause confusion
- "CMake-based" vs "CMake" vs "CMake/" - all acceptable
- "Clang ftime-trace" vs "clang -ftime-trace" - both acceptable  
- Minor word order preferences
- Missing secondary/optional details from the description
- Stylistic preferences like semicolons vs commas
- Capitalization variations (e.g., "SemVer" vs "semver")

## Common Issues to Flag

### 🚩 MUST FIX (flag as "fail")
- Missing action verb or starts with noun
- Completely misrepresents the task
- Too vague to understand (e.g., "Networking Task")
- Academic framing (e.g., "Learn about...", "Explore...")

### ⚠️ SHOULD IMPROVE (flag as "needs_work")
- Weak verb (Handle, Deal with, Work on)
- Egregiously long (>25 words)
- Missing a PRIMARY technology that's absolutely central to the task
- Significantly misrepresents what the task asks for
- Genuinely confusing or ambiguous (not just slightly awkward)

### ✅ ACCEPTABLE (flag as "ok")
- Title captures the core task and key technologies
- Minor stylistic preferences only
- Longer titles that accurately capture complex task scope
- Slight phrasing variations from "ideal"
- Missing only secondary/optional details

## Output Format
Respond with JSON:
{
    "status": "ok" | "needs_work" | "fail",
    "issues": ["<specific issue 1>", "<specific issue 2>"],
    "recommendation": "<improved title>" | null,
    "explanation": "<brief explanation of what's wrong and how the recommendation fixes it>"
}

If status is "ok", issues should be empty and recommendation should be null.
Be specific in issues - say exactly what's wrong, not generic feedback.
```

---

## Final v2 Results (90% Pass Rate)

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ OK | 36 | 90.0% |
| ⚠️ Needs Work | 4 | 10.0% |
| 🚩 Fail | 0 | 0.0% |

### The 4 Flagged Titles (Genuine Ambiguities)

1. **"Benchmark CMake-based C++ Ninja Builds: ld.bfd vs lld, LTO, Clang -ftime-trace JSON Report"**
   - Issue: Ambiguous whether JSON report is from ftime-trace or a separate summary

2. **"Repair CMake-based libvector.so.3: Enforce Export Set..."**
   - Issue: "Export Set" could be confused with CMake export sets

3. **"Implement a Go CI Release Pipeline..."**
   - Issue: Could be read as a pipeline written in Go

4. **"Configure Multi-Module Gradle Kotlin DSL for Offline Local Maven Builds..."**
   - Issue: "Local Maven Builds" sounds like Maven is the build tool

---

## Usage

### Generate Titles
```bash
cd scripts/task-titles
python3 generate_titles.py --input tasks_export.csv --output tasks_with_titles.csv --limit 40
```

### Evaluate Titles
```bash
python3 evaluate_titles.py --input tasks_with_titles.csv --output flagged_titles.csv --report evaluation_report.md
```

### Generate at Scale (Batch API - 50% cheaper)
```bash
# 1. Prepare JSONL batch file
python3 generate_titles_batch.py prepare --input tasks_export.csv

# 2. Submit to OpenAI
python3 generate_titles_batch.py submit

# 3. Check status (wait for completion)
python3 generate_titles_batch.py status

# 4. Download results
python3 generate_titles_batch.py download --output tasks_with_titles.csv
```

---

## Files

| File | Description |
|------|-------------|
| `generate_titles.py` | Title generation using GPT-5 |
| `generate_titles_batch.py` | Batch API version (50% cheaper) |
| `evaluate_titles.py` | LLM-as-a-judge evaluation using GPT-5 |
| `tasks_batch_40_v2.csv` | Generated titles (v2 prompt, Build category) |
| `tasks_mixed_categories_titled.csv` | Generated titles (45 tasks, all categories) |
| `evaluation_report_v2.md` | Evaluation report for Build category (90% pass) |
| `evaluation_mixed_categories.md` | Evaluation report for all categories (82.2% pass) |
| `flagged_titles_v2.csv` | Flagged titles from Build category |
| `flagged_mixed_categories.csv` | Flagged titles from all categories |
