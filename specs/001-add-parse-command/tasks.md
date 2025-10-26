# Tasks: Gram CLI Parse Command

**Input**: Design documents from `/specs/001-add-parse-command/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Vitest coverage is required by the constitution; test tasks appear alongside their user stories.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1, US2, US3) for story phases
- Include exact file paths in descriptions
- Constitution alignment: tasks cover reusable grammar services under `packages/*`, Vitest automation, and documentation for CLI adoption.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare shared testing assets used by all stories.

- [ ] T001 Copy `MockConsole.ts` from Effect CLI into `tools/gram-cli/src/lib/testing/MockConsole.ts`
- [ ] T002 [P] Create valid grammar fixture `tools/gram-cli/src/lib/testing/__fixtures__/valid.gram`
- [ ] T003 [P] Create invalid grammar fixture `tools/gram-cli/src/lib/testing/__fixtures__/invalid.gram`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Provide reusable parsing service exported from `packages/gram` for CLI consumption.

- [ ] T004 Implement `parseGrammar` service returning `ParseOutcome` in `packages/gram/src/lib/parse-service.ts`
- [ ] T005 Export `parseGrammar` and related types from `packages/gram/src/index.ts`
- [ ] T006 [P] Add Vitest coverage for success and error branches in `packages/gram/src/lib/parse-service.spec.ts`

---

## Phase 3: User Story 1 - Inspect parsed grammar (Priority: P1) 🎯 MVP

**Goal**: Allow users to run `gram parse <path>` and receive the full s-expression via stdout.

**Independent Test**: Execute `gram parse samples/...` and confirm exit code 0 with properly formatted s-expression output.

### Tests for User Story 1

- [ ] T007 [P] [US1] Author failing Vitest for successful parse output in `tools/gram-cli/src/lib/parse.command.spec.ts`

### Implementation for User Story 1

- [ ] T008 [US1] Implement success-path handler in `tools/gram-cli/src/gram-cmds.ts` to emit s-expression with trailing newline
- [ ] T009 [US1] Register the new parse subcommand within `tools/gram-cli/src/main.ts`

**Checkpoint**: `gram parse <valid-file>` prints the expected s-expression and exits cleanly.

---

## Phase 4: User Story 2 - Understand parse failures (Priority: P2)

**Goal**: Provide actionable diagnostics and non-zero exit codes when parsing fails.

**Independent Test**: Run `gram parse` against malformed or missing files and ensure stdout stays empty, stderr reports the issue, and exit code is non-zero.

### Tests for User Story 2

- [ ] T010 [P] [US2] Add failing Vitest covering syntax-error diagnostics in `tools/gram-cli/src/lib/parse.command.spec.ts`
- [ ] T011 [P] [US2] Add failing Vitest covering unreadable file errors in `tools/gram-cli/src/lib/parse.command.spec.ts`

### Implementation for User Story 2

- [ ] T012 [US2] Enhance `tools/gram-cli/src/gram-cmds.ts` to route diagnostics to stderr and set non-zero exit codes
- [ ] T013 [US2] Extend `packages/gram/src/lib/parse-service.ts` to include line/column metadata in `ParseOutcome.diagnostics`

**Checkpoint**: Failure cases emit actionable stderr output with accurate exit statuses.

---

## Phase 5: User Story 3 - Validate ergonomics for scripting (Priority: P3)

**Goal**: Ensure CLI ergonomics support automation with clear help text and quiet stdout.

**Independent Test**: Invoke `gram parse --help` for documented usage and redirect stdout to confirm no extraneous noise.

### Tests for User Story 3

- [ ] T014 [P] [US3] Add Vitest verifying `gram parse --help` exposes description and example in `tools/gram-cli/src/lib/parse.command.spec.ts`
- [ ] T015 [P] [US3] Add Vitest ensuring successful parses leave stderr empty for piping scenarios in `tools/gram-cli/src/lib/parse.command.spec.ts`

### Implementation for User Story 3

- [ ] T016 [US3] Update subcommand metadata and examples in `tools/gram-cli/src/gram-cmds.ts` to satisfy help output requirements
- [ ] T017 [US3] Document parse usage, piping, and exit codes in `tools/gram-cli/README.md`
- [ ] T018 [US3] Add sample walkthrough for `gram parse` in `samples/README.md`

**Checkpoint**: Automation workflows rely on documented help text and clean stdout/stderr behavior.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finalize documentation and validation artifacts across the feature.

- [ ] T019 Update validation commands and examples in `specs/001-add-parse-command/quickstart.md`

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 → User Story phases → Polish.
- User stories proceed in priority order (US1 → US2 → US3) once foundational tasks finish.
- Polish tasks run after all targeted user stories reach their checkpoints.

## Parallel Execution Opportunities

- Setup fixtures T002 and T003 can occur concurrently once MockConsole (T001) is staged.
- Foundational test T006 can run in parallel with export wiring (T005) after service implementation (T004).
- Within each user story, marked `[P]` test tasks (T007, T010, T011, T014, T015) can execute simultaneously before implementation work starts.
- Separate user stories can advance in parallel by different contributors after Phase 2 completes, provided shared files aren’t modified concurrently.

## Implementation Strategy

### MVP First

1. Complete Phases 1–2 to establish shared services and fixtures.
2. Deliver User Story 1 (T007–T009) to unlock the core parse capability.
3. Validate MVP via `npx nx test tools-gram-cli` and manual CLI invocation.

### Incremental Delivery

1. Add diagnostic handling (User Story 2) without regressing MVP behavior.
2. Layer ergonomic improvements and documentation (User Story 3).
3. Finish with Polish tasks to update quickstart guidance.

### Parallel Team Strategy

- Assign fixtures/service work (Phases 1–2) to one developer while another prepares US1 tests.
- After Phase 2, split stories among team members (e.g., US1 owner, US2 owner, US3 owner) with coordination on shared files (`gram-cmds.ts`, `parse.command.spec.ts`).
- Conduct joint validation once stories merge.
