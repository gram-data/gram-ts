<!--
Sync Impact Report
Version change: (none) → 1.0.0
Modified principles: n/a (initial adoption)
Added sections: Core Principles, Technical Standards, Workflow & Quality Gates, Governance
Removed sections: none
Templates requiring updates:
- ✅ .specify/templates/plan-template.md
- ✅ .specify/templates/spec-template.md
- ✅ .specify/templates/tasks-template.md
Follow-up TODOs: none
-->

# gram-ts Constitution

## Core Principles

### Library-First Delivery

- All new capabilities MUST ship as typed libraries under `packages/<feature>/src/lib` with exports aggregated through `src/index.ts`.
- CLI commands and other executables MUST only orchestrate published library APIs; shared logic may not live solely under `tools/`.
- Library surfaces MUST stay minimal and documented, with breaking changes gated by integration specs that validate builds produced in `dist/packages/<project>`.
**Rationale**: Keeps functionality reusable, testable, and aligned with Nx publish targets.

### CLI-Parity Interfaces

- Every behavior exposed in libraries MUST be invocable via `tools/gram-cli` commands using stdin/CLI arguments for input, stdout for standard output, and stderr for errors.
- CLI commands MUST provide a `--json` mode for automation and a human-readable default result, updating help text whenever flags change.
- CLI entry points MUST reuse shared parsing and formatting modules instead of duplicating logic.
**Rationale**: Guarantees automation parity and consistent operator experience across library and CLI surfaces.

### Test-Driven Grammar Safety

- Write failing Vitest suites (unit plus property-based with `fast-check`) before implementing grammar or CLI changes; merge only once the new tests pass.
- Maintain deterministic CLI integration tests for critical flows under `tools/gram-cli/src/**/*.spec.ts`, covering both positive and error scenarios.
- Run `npx nx run-many -t test -p <touched-projects>` locally; statement coverage for touched projects MUST remain at or above 85% unless an exception is approved in writing.
**Rationale**: Preserves grammar correctness and prevents nondeterministic regressions.

### Grammar Compatibility Contracts

- Updates to parsing or AST layers MUST remain compatible with `@gram-data/tree-sitter-gram`; incompatible changes require an approved migration plan and semantic version bump.
- New grammar constructs MUST include fixtures in `samples/` and AST expectations in package tests to lock behavior.
- Exported APIs that map to Neo4j or other downstream systems MUST document contract changes in package README files.
**Rationale**: Ensures external consumers rely on stable grammar semantics and tooling output.

### Traceable Delivery Pipeline

- Feature work MUST start with `/speckit.plan`, `/speckit.spec`, and `/speckit.tasks` artifacts, each referencing principle compliance in the Constitution Check.
- Pull requests MUST document the exact Nx commands executed (lint, test, build) and attach CLI output when user-visible behavior changes.
- Observability hooks (structured logs and `--json` output) MUST be updated alongside feature behavior so operational diagnostics stay actionable.
**Rationale**: Creates an auditable trail from design through delivery and keeps operational tooling trustworthy.

## Technical Standards

- Language baseline: TypeScript 5.9.3 with ECMAScript modules; Nx 22 executor configuration is the single source of truth for builds.
- Adhere to Prettier defaults (single quotes, 2-space indentation) and ESLint rules defined at the repo root; do not introduce local overrides without an approved RFC.
- Prefer functional composition with `effect` and `fp-ts` for asynchronous flows; reserve ad-hoc Promise chains for interoperability boundaries only.
- Distribution assets MUST be produced via `npx nx build <project>`; do not commit generated artifacts outside `dist/packages/<project>`.

## Workflow & Quality Gates

- Initiate every feature with `/speckit.plan`; reviewers block work missing a Constitution Check pass.
- For structural refactors, run `npx nx graph` and document dependency impacts in the plan.
- No pull request may merge until `npx nx lint`, `npx nx test`, and `npx nx build` succeed for all affected projects and results are recorded in the PR summary.
- Update `samples/` and package READMEs whenever behavior changes the user workflow or CLI surface.

## Governance

- This constitution supersedes conflicting guidance in other docs; exceptions require explicit approval recorded in the relevant spec.
- **Amendments**:
  - Submit an RFC describing affected principles, required version change, and migration considerations.
  - Secure approval from maintainers responsible for each impacted package and the CLI.
  - Update this document, the Sync Impact Report, and aligned templates in `.specify/templates/` within the same change set.
- **Versioning**: Apply semantic versioning—MAJOR for principle removals or redefinitions, MINOR for new principles/sections or materially expanded guidance, PATCH for clarifications and typo fixes. Record rationale in commit messages and the Sync Impact Report.
- **Compliance Review**: PR reviewers validate Constitution Check sections, confirm Nx command logs, and conduct an annual audit each April verifying sample coverage and CLI help accuracy.

**Version**: 1.0.0 | **Ratified**: 2025-10-23 | **Last Amended**: 2025-10-23
