## Data Model

### Entity: CST Node Definition

- **Purpose**: Represents a grammar node emitted by tree-sitter-gram with its named status, child fields, and aliases.
- **Key Fields**:
  - `type` (string) — canonical node name (`right_arrow`, `subject`, etc.).
  - `fields` (Map<string, FieldSpec>) — ordered child slots with multiplicity metadata.
  - `children` (Array<ChildSpec>) — unnamed child descriptions with quantifiers.
  - `aliases` (Array<string>) — alternate spellings merged into this node.
  - `isNamed` (boolean) — indicates whether the node is addressed by name.
- **Relationships**:
  - References `SExpression Fragment` during stringify to decide label formatting.
  - Linked to `Corpus Case` expectations for coverage.
- **Validation Rules**:
  - Node names must align with those enumerated in `tree-sitter.json`.
  - Field multiplicity (`one`, `zero_or_one`, `one_or_more`) MUST match grammar definitions.

### Entity: SExpression Fragment

- **Purpose**: Captures the serialized form of a CST node or token for parity with tree-sitter CLI output.
- **Key Fields**:
  - `symbol` (string) — node or token label used in the s-expression.
  - `attributes` (Record<string, string>) — optional metadata (e.g., range positions) preserved for debugging.
  - `children` (Array<SExpression Fragment>) — nested fragments representing child nodes.
  - `text` (string | null) — literal text for leaf tokens; null for non-terminals.
- **Relationships**:
  - Generated from `CST Node Definition` plus parsed tree instance.
  - Consumed by documentation examples and regression tests.
- **Validation Rules**:
  - Fragment ordering must follow the CST traversal order.
  - Symbols must be normalized using grammar-defined merges (`-->`, `==>`, `~~>` → `right_arrow`).

### Entity: Corpus Case

- **Purpose**: Encapsulates one example (positive or `:error`) from the tree-sitter corpus for regression verification.
- **Key Fields**:
  - `name` (string) — derived from file and block label.
  - `source` (string) — raw Gram text under test.
  - `expectedOutcome` (enum: `success` | `error`) — derived from corpus annotation.
  - `notes` (string[]) — optional commentary embedded in corpus files.
- **Relationships**:
  - Drives instantiation of `CST Node Definition` assertions and `SExpression Fragment` comparisons.
- **Validation Rules**:
  - All corpus files must be parsed; missing cases fail the regression suite.
  - `expectedOutcome` must match the presence of `:error` tags.
