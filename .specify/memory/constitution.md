<!--
Sync Impact Report
Version: Unversioned → 1.0.0
Modified Principles:
- Introduced I. Design for Composable Grammar
- Introduced II. Code Quality: Typed and Traceable Modules
- Introduced III. Testing Standards: Contract-Driven Verification
- Introduced IV. Developer Experience: Empower Gram Producers
Added Sections:
- Engineering Guardrails
- Delivery Workflow
Removed Sections:
- Placeholder Principle V block
Templates requiring updates:
- .specify/templates/plan-template.md ✅ updated
- .specify/templates/spec-template.md ✅ updated
- .specify/templates/tasks-template.md ✅ updated
- .specify/templates/checklist-template.md ✅ updated
Follow-up TODOs:
- None
-->
# gram-ts Constitution

## Core Principles

### I. Design for Composable Grammar
- Every new capability MUST state the target grammar pattern(s) and constraints in the spec before implementation begins.
- Libraries under `packages/*` MUST remain composable and expose entry points via `src/index.ts`; internal state stays private to its package unless a deliberate API contract is documented.
- Cross-package dependencies MUST be declared through Nx tags and reviewed for domain fit; ad-hoc imports are forbidden.
**Rationale**: Gram delivers value when grammar pieces compose predictably; disciplined design keeps the domain model coherent.

### II. Code Quality: Typed and Traceable Modules
- TypeScript strictness MUST stay enabled across all projects; suppressing compiler or ESLint rules requires a documented justification in the PR.
- Modules MUST publish minimal, named exports with docstrings for public APIs; avoid default exports except at package entrypoints.
- Shared utilities MUST include lightweight examples or inline usage notes so maintainers can trace data flow quickly.
**Rationale**: Strong typing and traceable APIs prevent regressions across the Nx workspace and accelerate maintainer reviews.

### III. Testing Standards: Contract-Driven Verification
- Feature work MUST add or update Vitest suites that fail before implementation and cover both parser contracts and CLI flows.
- Property-based tests with `fast-check` MUST guard new or modified grammar transformations; integration gaps require an explicit risk noted in the plan.
- Before merge, contributors MUST run `npx nx run-many -t test -p <touched-projects>` and attach the command output or summary in the PR.
**Rationale**: Contract-first testing preserves correctness of the grammar toolchain and exposes regressions before release.

### IV. Developer Experience: Empower Gram Producers
- Any change affecting CLI usage, API signatures, or file formats MUST update `README.md`, relevant package docs, or embedded `--help` output before completion.
- Samples under `samples/` and quickstart guides MUST either reflect new behavior or state why no change is needed; omissions require issue tracking.
- Error messages and logs MUST describe actionable remediation steps and reference supporting documentation when possible.
**Rationale**: Gram succeeds when downstream developers adopt updates confidently; clear guidance keeps the ecosystem usable.

## Engineering Guardrails

- House all shipped code in publishable Nx targets under `packages/*`; link shared logic via libraries instead of relative imports across packages.
- Maintain alignment with repository standards: Prettier formatting (`npx nx format:check`), ESLint module boundaries, and consistent configuration in `tsconfig.base.json`.
- Build artifacts MUST live under `dist/packages/<project>`; scripts or tooling that need other locations require an explicit exemption.
- Capture changes to parser grammar schemas or CLI commands in versioned docs within `docs/` or package-level READMEs alongside changelog entries.

## Delivery Workflow

1. Start with `/specs/<feature>/spec.md`, documenting grammar patterns, affected developers, and success metrics that map to the core principles.
2. Generate `/specs/<feature>/plan.md` via `/speckit.plan` and complete the Constitution Check by providing evidence for each principle before Phase 0 completes.
3. Break work into `/speckit.tasks` outputs that include testing, docs, and grammar validation tasks; keep stories independently shippable.
4. Prior to merge, run lint, format, build, and test targets for all touched projects (`npx nx lint`, `npx nx format:check`, `npx nx build`, `npx nx run-many -t test`) and record results in the PR summary.

## Governance

- This constitution supersedes prior informal practices; reviewers MUST block PRs that violate the principles until resolved.
- Amendments require a proposal summarizing motivation, expected impact, and updated Sync Impact Report entries; at least two maintainers must approve.
- Versioning follows semantic rules: MAJOR for redefining or removing principles, MINOR for adding new principles or sections, PATCH for wording clarifications.
- Upon adoption, update `LAST_AMENDED_DATE` and ensure dependent templates reflect the new guidance before closing the PR.
- Compliance reviews happen at the start of each milestone and before tagged releases; unresolved breaches are logged as backlog items with owners.

**Version**: 1.0.0 | **Ratified**: 2025-10-26 | **Last Amended**: 2025-10-26
