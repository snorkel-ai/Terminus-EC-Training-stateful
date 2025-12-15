# Title Review Report

**Generated:** 2025-12-15 13:37

## Summary

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ OK | 36 | 90.0% |
| ⚠️ Needs Work | 4 | 10.0% |
| 🚩 Fail | 0 | 0.0% |
| **Total** | **40** | **100%** |

## ⚠️ Should Improve

These titles work but could be better.

### `Benchmark CMake-based C++ Ninja Builds: ld.bfd vs lld, LTO, Clang -ftime-trace JSON Report`

**Category:** Build & Dependency Management

**Issues:**
- Ambiguous phrasing suggests the JSON report comes from Clang -ftime-trace, whereas the task requires a separate JSON summarizing build/rebuild metrics.
- Title omits the core requirement to compare full vs incremental rebuild times, which is central to the task's output.

**Explanation:** The revised title keeps the action verb and key technologies while clarifying that Clang -ftime-trace is used during benchmarking and that the JSON report compares full and incremental rebuild times, aligning closely with the task description.

**Recommended:** `Benchmark CMake/Ninja C++ Builds: ld.bfd vs lld, with/without LTO, use Clang -ftime-trace, JSON report of full vs incremental rebuilds`

---

### `Repair CMake-based libvector.so.3: Enforce Export Set, Correct SONAME, Remove RPATH and RUNPATH, Resolve Undefined Symbols`

**Category:** Build & Dependency Management

**Issues:**
- Ambiguous phrasing: "Export Set" could be confused with CMake export sets; it should specify exported symbols
- Modifier placement: "CMake-based libvector.so.3" implies the library is CMake-based rather than the build; clarify it's the CMake build being repaired

**Explanation:** The recommendation clarifies that the task is about fixing the CMake build (not that the library is "CMake-based") and explicitly states "exported symbol set" to avoid confusion with CMake's export sets. All core requirements (SONAME, RPATH/RUNPATH, undefined symbols) are preserved.

**Recommended:** `Repair CMake build to produce libvector.so.3: Enforce exported symbol set, set correct SONAME, remove RPATH/RUNPATH, resolve undefined symbols`

---

### `Implement a Go CI Release Pipeline for linux/amd64 and linux/arm64 Cross-Compilation, Deterministic Tarballs, SBOM, Signing, Local Publish, and Install and Signature Verification`

**Category:** Build & Dependency Management

**Issues:**
- Possible ambiguity: 'Go CI Release Pipeline' can be read as a pipeline written in Go rather than a CI pipeline for a Go project
- Missing 'checksums', which the task explicitly requires generating
- Scope detail missing: does not indicate the target is a Go CLI
- “Local Publish” is vague; the task specifies publishing to a local release store

**Explanation:** The revision clarifies that the pipeline is for a Go CLI (not written in Go), adds the required checksums, and specifies publishing to a local release store. It remains action-driven, captures all core outputs, and avoids ambiguity.

**Recommended:** `Implement a CI Release Pipeline for a Go CLI: cross-compile linux/amd64, linux/arm64; deterministic tarballs; SBOM, checksums; sign; publish to local release store; verify signatures`

---

### `Configure Multi-Module Gradle Kotlin DSL for Offline Local Maven Builds, Dependency Locking and Verification, and Reproducible JDK 17 Shaded JAR`

**Category:** Build & Dependency Management

**Issues:**
- The phrase 'Offline Local Maven Builds' is misleading—this task uses Gradle, not Maven as the build tool. It should specify offline builds against a pre-seeded local Maven repository.

**Explanation:** The current title could be read as configuring Maven builds, while the task is about Gradle building offline using a local Maven repository. The recommendation clarifies the offline build context and preserves the key scope: Gradle (Kotlin DSL), dependency locking/verification, and a reproducible JDK 17 shaded fat JAR.

**Recommended:** `Configure Multi-Module Gradle Kotlin DSL for Offline Builds Against a Pre-Seeded Local Maven Repository, Dependency Locking/Verification, and a Reproducible JDK 17 Shaded Fat JAR`

---

## Quick Reference

| Status | Current Title | Recommended |
|--------|---------------|-------------|
| ⚠️ | Benchmark CMake-based C++ Ninja Builds: ld.bfd vs ... | Benchmark CMake/Ninja C++ Builds: ld.bfd vs lld, w... |
| ⚠️ | Repair CMake-based libvector.so.3: Enforce Export ... | Repair CMake build to produce libvector.so.3: Enfo... |
| ⚠️ | Implement a Go CI Release Pipeline for linux/amd64... | Implement a CI Release Pipeline for a Go CLI: cros... |
| ⚠️ | Configure Multi-Module Gradle Kotlin DSL for Offli... | Configure Multi-Module Gradle Kotlin DSL for Offli... |
