---

description: "Task list for updating Gram CST types and corpus regression coverage"
---

# Tasks: Update Gram CST Type Definitions

**Input**: Design documents from `/specs/001-update-cst-types/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions
- **Constitution Alignment**: Task sets MUST cover grammar design decisions (`packages/*` ownership), lint/type refactors, test automation (Vitest + fast-check where applicable), and developer documentation or CLI updates for the story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare local grammar assets and workspace dependencies needed by every story.

- [x] T001 Install workspace dependencies via `npm ci` recorded in package.json.
- [x] T002 Rebuild tree-sitter grammar artifacts by running `npm run build` inside `tree-sitter-gram/package.json`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared helpers and configuration that all user stories require.

- [x] T003 Create `packages/gram/src/lib/parser/grammar-metadata.ts` to expose typed access to `tree-sitter-gram/tree-sitter.json`.
- [x] T004 Update `packages/gram/project.json` test target to register the upcoming corpus regression suites.

**Checkpoint**: Grammar metadata helper and Nx test wiring ready—user stories can now proceed.

---

## Phase 3: User Story 1 - Grammar Alignment Audit (Priority: P1) 🎯 MVP

**Goal**: Ensure CST type definitions mirror the latest tree-sitter-gram grammar and provide a deterministic s-expression stringify utility.

**Independent Test**: Generate the CST schema snapshot and run focused stringify specs to confirm no missing nodes and correct arrow normalization.

### Implementation for User Story 1

- [x] T005 [US1] Update `packages/gram/src/lib/parser/cst-types.ts` to align node definitions and metadata with the latest grammar.
- [x] T006 [US1] Expand `packages/gram/src/lib/parser/cst-types.spec.ts` to assert coverage for every grammar node and verify removed definitions are pruned.
- [x] T007 [US1] Implement `packages/gram/src/lib/parser/cst-stringify.ts` to output s-expressions matching tree-sitter CLI conventions, including merged arrow nodes.
- [x] T008 [US1] Add `packages/gram/src/lib/parser/cst-stringify.spec.ts` validating stringify output for representative patterns and optional children.
- [x] T009 [US1] Export the new stringify API through `packages/gram/src/index.ts` and update `packages/gram/src/lib/stringify/index.ts`.

**Checkpoint**: CST definitions and stringifier deliverable, with focused specs verifying alignment.

---

## Phase 4: User Story 2 - Corpus-Based Regression Protection (Priority: P2)

**Goal**: Replay the full tree-sitter-gram corpus to guard against regressions in CST typing and stringifier output.

**Independent Test**: Execute the corpus regression suite ensuring positive samples stringify identically to tree-sitter expectations and `:error` cases surface meaningful failures.

### Tests for User Story 2 ⚠️

- [x] T010 [P] [US2] Create `packages/gram/src/lib/parser/corpus-loader.ts` to iterate corpus files and emit positive vs. error scenarios.
- [x] T011 [P] [US2] Add `packages/gram/src/lib/parser/corpus-positive.spec.ts` asserting stringify parity against the tree-sitter parse output for all positive samples.
- [x] T012 [P] [US2] Add `packages/gram/src/lib/parser/corpus-errors.spec.ts` ensuring `:error` samples trigger descriptive parser failures.

### Implementation for User Story 2

- [x] T013 [US2] Integrate corpus fixtures into tests via updates to `packages/gram/project.json` resources so Nx test runs include the corpus directory.
- [x] T014 [US2] Add new example files under `samples/corpus/` showcasing a passing and `:error` case with expected s-expressions.

**Checkpoint**: Full regression suite covering positive and error corpus paths with documentation examples refreshed.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Final documentation and quality gates ahead of release.

- [ ] T015 Update `packages/gram/README.md` with stringify usage guidance and upgrade notes.
- [ ] T016 Run `npx nx format:write packages-gram && npx nx lint packages-gram && npx nx test packages-gram` and capture results in the PR description.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Must complete before Foundational work.
- **Foundational (Phase 2)**: Supplies grammar metadata and Nx wiring required by both user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational helpers; unlocks the stringify capability needed for regression tests.
- **User Story 2 (Phase 4)**: Depends on the stringifier and updated CST definitions from User Story 1.
- **Polish (Phase N)**: Runs after targeted user stories to finalize documentation and quality gates.

### User Story Dependencies

- **User Story 1 (P1)**: No upstream story dependencies; provides MVP value once complete.
- **User Story 2 (P2)**: Requires User Story 1 deliverables (updated types + stringify) to validate against corpus output.

### Parallel Opportunities

- Setup tasks (T001–T002) can be executed concurrently once the repository is cloned.
- Within User Story 2, tasks T010–T012 operate on distinct specs/utilities and may proceed in parallel after the corpus loader scaffold is drafted.
- Polish tasks T015–T016 can begin once both user stories have landed but run independently of one another (documentation vs. command execution).

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phases 1–2 to ensure tooling and metadata exist.
2. Deliver User Story 1 tasks (T005–T009) to ship updated CST types and stringifier.
3. Pause for review; merge if immediate regression automation is not yet required.

### Incremental Delivery

1. Finish Setup + Foundational work.
2. Ship User Story 1 to provide corrected typings and stringify.
3. Layer User Story 2 regression coverage and sample updates.
4. Execute Polish tasks to wrap documentation and CI validation.

### Parallel Team Strategy

1. One contributor handles Foundational work and User Story 1 updates.
2. A second contributor starts User Story 2 (T010–T012) once stringifier stubs exist.
3. A third contributor prepares documentation and sample updates in Phase 4/Phase N.
