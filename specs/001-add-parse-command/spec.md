# Feature Specification: Gram CLI Parse Command

**Feature Branch**: `[001-add-parse-command]`  
**Created**: 2025-10-26  
**Status**: Draft  
**Input**: User description: "Add a parse command to gram-cli which parses a gram source file and outputs the s-expression representation of the parsed grammar"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Inspect parsed grammar (Priority: P1)

As a CLI user modeling a grammar, I want to run a parse command against a Gram source file so I can review the parser's s-expression output without opening an interactive debugger.

**Why this priority**: This delivers the core capability of exposing the parsed structure through the CLI, unlocking immediate insight into grammar validity.

**Independent Test**: Execute `gram parse <path>` on a valid sample and verify the command returns exit code 0 with the expected s-expression in stdout.

**Acceptance Scenarios**:

1. Given a valid Gram source file path, When the user runs `gram parse <path>`, Then the CLI prints the full s-expression representation to stdout and exits with status 0.
2. Given a valid Gram source file path, When the user pipes the command output to another tool, Then the printed s-expression remains well-formed (balanced parentheses with a trailing newline).

---

### User Story 2 - Understand parse failures (Priority: P2)

As a CLI user diagnosing grammar issues, I want clear feedback when parsing fails so I can quickly locate and fix syntax problems.

**Why this priority**: Actionable error feedback prevents stalled adoption by making troubleshooting fast.

**Independent Test**: Run `gram parse` on a file with a known syntax error and confirm the CLI emits a descriptive error message and non-zero exit code without partial output.

**Acceptance Scenarios**:

1. Given a Gram source file containing a syntax error, When the user runs `gram parse <path>`, Then the CLI suppresses s-expression output, prints an error message describing the failure and its location, and exits with a non-zero status.
2. Given a missing or unreadable file path, When the user runs `gram parse <path>`, Then the CLI reports the access issue and exits with a non-zero status.

---

### User Story 3 - Validate ergonomics for scripting (Priority: P3)

As a developer automating grammar verification, I want predictable CLI arguments and quiet output so I can integrate the parse command into scripts and pipelines.

**Why this priority**: Consistent CLI ergonomics reduce onboarding time and support automated workflows.

**Independent Test**: Invoke `gram parse` with the help flag and under redirection, ensuring the command supports piping, redirection, and scripted use without manual cleanup.

**Acceptance Scenarios**:

1. Given the user runs `gram parse --help`, When the CLI renders usage, Then the parse command appears with argument descriptions and examples.
2. Given the user redirects command output to a file (e.g., `gram parse <path> > parsed.txt`), When the command completes successfully, Then the s-expression is written to the file and no additional stdout chatter breaks the redirected output.

---

### Edge Cases

- How does the CLI respond when the input file exceeds the supported size limit for parsing?
- What happens when the user omits the required file path argument?
- How does the CLI behave when stdout is not writable (e.g., broken pipe while streaming output)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The CLI MUST expose a `parse` subcommand discoverable via `gram --help` and `gram parse --help`.
- **FR-002**: The parse command MUST accept a required path to a Gram source file and validate readability before parsing.
- **FR-003**: On successful parsing, the command MUST emit the complete s-expression representation of the grammar to stdout, using a stable, machine-readable format.
- **FR-004**: The command MUST exit with status 0 on success and a non-zero status when parsing fails or input is invalid.
- **FR-005**: When parsing fails, the CLI MUST print an actionable error including the reason and, when available, the location in the source file that caused the failure.
- **FR-006**: The parse command MUST confine informational and error messages to stderr so that stdout contains only the s-expression payload on success.
- **FR-007**: The CLI MUST ensure that help text and usage examples reflect the parse command options, required arguments, and typical workflows.

### Key Entities

- **Grammar Source File**: Author-provided text file containing Gram grammar definitions that serves as the parse input.
- **Parsed Grammar S-Expression**: Structured string output representing the grammar parse tree, expected to be consumed by humans or downstream tools.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of successful parse operations on reference grammars under 100KB complete in under 3 seconds on a standard developer laptop.
- **SC-002**: 100% of parse failures in QA testing include an error message referencing the failing rule or file location.
- **SC-003**: At least 90% of surveyed internal developers report that the parse command makes grammar debugging faster compared to prior workflows.
- **SC-004**: Zero open support tickets are filed during beta that cite unclear usage or missing documentation for the parse command.

## Assumptions

- Initial scope supports parsing from local file paths; standard input or remote sources are out of scope.
- CLI output on success is limited to the s-expression payload plus trailing newline, while diagnostics route to stderr.
- Output formatting follows the existing s-expression conventions used elsewhere in Gram tooling.

## Developer Experience Commitments *(mandatory)*

- **DX-001**: CLI documentation MUST be updated in `tools/gram-cli/README.md` to describe the parse command, arguments, exit codes, and sample usage.
- **DX-002**: A sample grammar in `samples/` MUST include guidance or a script demonstrating how to run `gram parse` on the sample file; state justification if no update is needed.
- **DX-003**: Error messages for the parse command MUST guide developers toward likely fixes (e.g., citing the line/column and directing to documentation for grammar syntax).
