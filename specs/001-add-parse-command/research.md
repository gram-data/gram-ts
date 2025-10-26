# Research: Gram CLI Parse Command

## Decision 1: Define `gram parse` with @effect/cli Command API

- **Decision**: Implement the parse feature as a new subcommand in `tools/gram-cli/src/gram-cmds.ts` using `Command.make` from `@effect/cli`, mirroring the structure used by the existing `gram stat` command.
- **Rationale**: Staying within the current command composition keeps CLI ergonomics consistent, enables help/usage generation automatically, and leverages the existing Effect runtime wiring already configured in `main.ts`.
- **Alternatives considered**:
  - *Separate executable*: Would duplicate bootstrap logic and fragment CLI discoverability.
  - *Add logic directly to `gram` root command*: Reduces clarity for users who expect discrete verbs; also complicates option parsing.

## Decision 2: Produce s-expression output via `Gram.parse(...).rootNode.toString()`

- **Decision**: Reuse the `Gram.parse` API from the `gram` package and call `rootNode.toString()` on the resulting CST to emit the tree-sitter formatted s-expression string.
- **Rationale**: The `gram-stat` command already demonstrates this approach for verbose output, ensuring consistency with current tooling and satisfying the requirement for balanced parentheses plus trailing newline.
- **Alternatives considered**:
  - *Custom serializer over AST nodes*: Requires additional traversal logic and risks drift from canonical tree-sitter formatting.
  - *Using `Gram.stats` output*: Provides aggregated statistics rather than the raw parse tree, failing to meet feature goals.

## Decision 3: Simulate console IO in tests with Effect's `MockConsole`

- **Decision**: Vendor `MockConsole.ts` from the Effect CLI repository into the test suite (with attribution) so Vitest can capture stdout/stderr without executing real IO.
- **Rationale**: MockConsole integrates with the Effect runtime layers expected by `@effect/cli`, enabling deterministic assertions on command output and exit codes while avoiding ad-hoc spies.
- **Alternatives considered**:
  - *Hand-rolled spies around `Console.log`*: Would bypass Effect layers and break when commands use additional Console APIs.
  - *Running commands via child processes*: Slower and brittle; complicates fixture management and error assertions.
