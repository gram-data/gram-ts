# Data Model: Gram CLI Parse Command

## Entities

### GrammarSourceFile
- **Description**: User-supplied Gram grammar file that serves as input to the parse command.
- **Fields**:
  - `path`: string — relative or absolute path provided on the CLI; must resolve within the user’s filesystem.
  - `encoding`: string — expected to be UTF-8; mismatched encodings surface as IO errors.
  - `sizeBytes`: number — used to guard oversized inputs (success criteria reference <100KB baseline).
- **Validation Rules**:
  - Path must reference a readable file; missing or permission-denied paths trigger error handling.
  - File contents must be valid UTF-8; decoding failures produce descriptive diagnostics.
- **Relationships**: Acts as the source for generating a `ParseRequest`.

### ParseRequest
- **Description**: Internal representation of a parse invocation created from CLI arguments.
- **Fields**:
  - `source`: `GrammarSourceFile` — encapsulates the file metadata and contents.
  - `options`: object — currently placeholder for future flags (e.g., verbosity); ensures extensibility.
- **Validation Rules**:
  - Requires exactly one source file path for this feature scope.
  - Options object defaults to safe values; unsupported flags must short-circuit with usage guidance.
- **Relationships**: Fed into parsing utilities to produce a `ParseOutcome`.

### ParseOutcome
- **Description**: Result of applying the Gram parser to a request.
- **Fields**:
  - `sExpression`: string — canonical tree-sitter string representing the parsed grammar.
  - `diagnostics`: `ParseDiagnostic[]` — populated when errors occur.
  - `status`: enum (`"success" | "error"`) — determines exit code and output channel.
- **Validation Rules**:
  - Success state requires non-empty `sExpression` with balanced parentheses.
  - Error state must include at least one diagnostic entry.
- **Relationships**: Drives CLI output routing (stdout for success, stderr for diagnostics).

### ParseDiagnostic
- **Description**: Actionable error surfaced to the CLI user.
- **Fields**:
  - `message`: string — user-facing explanation of the failure.
  - `location`: optional `{ line: number; column: number }` — pinpoint of syntax issue when available.
  - `hint`: optional string — remediation guidance referencing docs or usage.
- **Validation Rules**:
  - Message is required and concise; location provided when parser exposes coordinates.
- **Relationships**: Aggregated within `ParseOutcome.diagnostics`.

## State Transitions

1. **Argument Parsing**: CLI arguments → `ParseRequest` (validate file path, construct options).
2. **Parsing Execution**: `ParseRequest` → `ParseOutcome` (run `Gram.parse`, derive success/error).
3. **Presentation**: `ParseOutcome` → CLI output (stdout for `sExpression`, stderr for diagnostics, exit status determined by `status`).
