# Implementation Plan: Update Gram CST Type Definitions

**Branch**: `001-update-cst-types` | **Date**: 2025-10-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-update-cst-types/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Refresh the `packages/gram` CST type catalog to mirror the latest tree-sitter-gram grammar and deliver a deterministic s-expression stringifier that matches the tree-sitter CLI output. Validate the alignment by replaying the official corpus (including `:error` samples) so positive examples round-trip cleanly and error cases fail with actionable diagnostics.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.9.3 (Nx-managed)  
**Primary Dependencies**: tree-sitter 0.25, @gram-data/tree-sitter-gram 0.2.x, Nx 22 toolchain  
**Storage**: N/A — in-memory CST processing only  
**Testing**: Vitest via `npx nx test packages-gram`, fast-check property tests, corpus-driven regression harness  
**Target Platform**: Node.js LTS (>=18) libraries/CLI distributed through Nx packages  
**Project Type**: Nx monorepo of TypeScript libraries (`packages/*`) plus CLI (`tools/gram-cli`)  
**Performance Goals**: Process full tree-sitter corpus within existing CI budget (target < 2 minutes) and keep stringify overhead within 5% of current parsing time  
**Constraints**: Stringifier output MUST be byte-for-byte identical to tree-sitter CLI s-expressions; updates must respect Nx module boundary tags and keep generated artifacts under `dist/packages/gram`  
**Scale/Scope**: Impacts `packages/gram` parser/stringify layers and shared fixtures in `tree-sitter-gram/test/corpus`; no new deployable projects

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- [x] **Design for Composable Grammar** — All CST updates stay within `packages/gram/src/lib/parser/`; exports remain via `src/index.ts`, and Nx tags prevent leaking internal helpers to other packages.
- [x] **Code Quality: Typed and Traceable Modules** — Maintain strict TypeScript coverage in `cst-types.ts`, introduce well-documented stringifier modules, and expand specs to protect named exports from regression.
- [x] **Testing Standards: Contract-Driven Verification** — Extend Vitest suites (`cst-types.spec.ts`, new stringify specs) plus a corpus replay harness invoked via `npx nx test packages-gram`; run `npx nx run-many -t test -p packages-gram`.
- [x] **Developer Experience: Empower Gram Producers** — Update `packages/gram/README.md` and samples to describe the new s-expression output, and cross-link error guidance to tree-sitter corpus references.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
packages/
├── gram/
│   ├── src/
│   │   ├── index.ts
│   │   └── lib/
│   │       ├── parser/
│   │       │   ├── parser.ts
│   │       │   ├── cst-types.ts
│   │       │   └── cst-stringify.ts      # NEW stringifier for CST → s-expression
│   │       ├── stringify/
│   │       │   └── index.ts
│   │       └── ast/
│   └── **/*.spec.ts                      # Co-located Vitest suites
tree-sitter-gram/
└── test/
    └── corpus/                           # Source of positive and :error samples
```

**Structure Decision**: Work centers on `packages/gram/src/lib/parser/` for CST typing/stringify plus regression fixtures sourced from `tree-sitter-gram/test/corpus`. No new Nx projects required; existing library layout suffices.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because                 |
| --------- | ---------- | ---------------------------------------------------- |
| None      | N/A        | Existing architecture satisfies constitutional gates |
