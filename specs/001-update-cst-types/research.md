## Research Summary

### Decision: Source of truth for CST schema

- **Chosen Approach**: Use the `tree-sitter-gram` submodule at the target commit (matching `@gram-data/tree-sitter-gram` version) to enumerate syntax nodes from `grammar.js` and `tree-sitter.json`.
- **Rationale**: The bundled grammar is the canonical definition consumed by both the CLI and our parser bindings; reading it directly avoids divergence from published packages.
- **Alternatives Considered**:
  - Rely on the previously generated `cst-types.ts` as baseline — rejected because it is already stale relative to the new grammar.
  - Consume remote registry metadata — rejected due to additional tooling and latency with no fidelity gain.

### Decision: Strategy for CST → s-expression stringify

- **Chosen Approach**: Implement a dedicated `cst-stringify.ts` module that walks parsed CST nodes and emits s-expressions matching `tree-sitter parse --quiet --json` formatting, normalizing merged nodes (e.g., `-->`, `==>`, `~~>` → `right_arrow`).
- **Rationale**: A TypeScript-native walker reuses existing CST typing, keeps output deterministic, and avoids shipping the Rust CLI as a runtime dependency.
- **Alternatives Considered**:
  - Shell-out to `tree-sitter` CLI for stringify — rejected for portability and performance reasons on CI.
  - Reuse AST stringifier paths — rejected because AST normalizes structure beyond raw CST needs and drops token fidelity required for byte-accurate comparisons.

### Decision: Regression verification using corpus

- **Chosen Approach**: Build a Vitest harness that iterates every file under `tree-sitter-gram/test/corpus`, separates positive vs. `:error` blocks, and asserts CST stringify parity (positive) or failure surfaces (error).
- **Rationale**: The corpus already encodes authoritative examples; automating it guarantees coverage without inventing new fixtures and satisfies constitution testing mandates.
- **Alternatives Considered**:
  - Sample a subset of corpus files — rejected because syntax coverage would remain incomplete and risks missing regressions.
  - Create bespoke fixtures in `packages/gram` — rejected to avoid duplication and drift from the upstream grammar suite.
