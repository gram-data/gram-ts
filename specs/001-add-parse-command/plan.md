# Implementation Plan: Gram CLI Parse Command

**Branch**: `[001-add-parse-command]` | **Date**: 2025-10-26 | **Spec**: [specs/001-add-parse-command/spec.md](specs/001-add-parse-command/spec.md)  
**Input**: Feature specification from `/specs/001-add-parse-command/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Deliver a `gram parse` subcommand that consumes a Gram source file and prints the parser’s s-expression to stdout while routing diagnostics to stderr. Implementation will extend the existing `tools/gram-cli` @effect/cli application, reuse tree-sitter powered parsing utilities from workspace libraries, and layer documentation plus testing that verifies successful output and failure ergonomics.

## Technical Context

**Language/Version**: TypeScript 5.9 (Nx toolchain)  
**Primary Dependencies**: @effect/cli, @effect/io runtime, @gram-data/tree-sitter-gram parser bindings, shared logic from `packages/gram` and `packages/data`  
**Storage**: N/A (CLI operates on in-memory grammar artifacts)  
**Testing**: Vitest suites executed through `npx nx test tools-gram-cli`, leveraging `MockConsole` borrowed from Effect CLI for console simulation  
**Target Platform**: Node.js CLI (workspace default; packaged via Nx)  
**Project Type**: Nx-managed CLI application under `tools/gram-cli`  
**Performance Goals**: Meet spec objective: 95% of parses for reference grammars (<100KB) complete under 3 seconds on a standard laptop  
**Constraints**: Successful command emits only the s-expression to stdout, routes diagnostics to stderr, and remains compliant with Nx lint/test workflows  
**Scale/Scope**: Single CLI surface aimed at grammar authors and automation scripts within the Gram ecosystem

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Design for Composable Grammar** — Parse command will consume existing parsing APIs from `packages/gram` without introducing cross-package leaks; any new exports will be documented through package entry points.
- [x] **Code Quality: Typed and Traceable Modules** — Impacted modules (`tools/gram-cli/src/gram-cmds.ts`, potential helpers under `packages/gram`) stay strictly typed with named exports and documented usage.
- [x] **Testing Standards: Contract-Driven Verification** — Plan includes Vitest specs using `MockConsole`, parser contract checks, and CI commands (`npx nx test tools-gram-cli`, `npx nx run-many -t test -p packages-gram` if touched) prior to implementation.
- [x] **Developer Experience: Empower Gram Producers** — CLI help output, `tools/gram-cli/README.md`, and relevant `samples/` entries will document usage, exit codes, and troubleshooting guidance.

## Project Structure

### Documentation (this feature)

```text
specs/001-add-parse-command/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
tools/
└── gram-cli/
    ├── src/
    │   ├── gram-cmds.ts
    │   ├── gram-stat.ts
    │   ├── lib/
    │   │   └── sanity.spec.ts
    │   └── main.ts
    ├── README.md
    └── tsconfig*.json

packages/
├── gram/
│   └── src/
│       ├── index.ts
│       └── lib/
├── gram-cypher/
│   └── src/
└── data/
    └── src/

samples/
└── *.gram  # reference grammars for CLI workflows
```

**Structure Decision**: Implementation centers on the existing `tools/gram-cli` Nx project, reusing parsing capabilities from libraries under `packages/*` and referencing sample grammars under `samples/` for documentation and testing fixtures.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
