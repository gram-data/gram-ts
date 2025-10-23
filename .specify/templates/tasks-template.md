---
description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Vitest suites (unit, property-based, CLI integration) are REQUIRED for every story that changes grammar or CLI behavior; note coverage expectations (≥85% statements per touched project) in the task descriptions.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Library code**: `packages/<library>/src/lib/`
- **Library exports**: `packages/<library>/src/index.ts`
- **CLI surface**: `tools/gram-cli/src/`
- **Samples & fixtures**: `samples/<feature>/`
- **Generated artifacts**: `dist/packages/<project>` (do not edit manually)
- Document any deviations from this structure in plan.md before adding tasks.

<!-- 
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.
  
  The /speckit.tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities and AST contracts from data-model.md
  - CLI surfaces and endpoints from contracts/
  
  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment
  
  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm foundation and tooling before story work begins.

- [ ] T001 Confirm target library folder under `packages/[feature]` (or chosen package) and ensure exports flow through `src/index.ts`.
- [ ] T002 Configure Nx project metadata (`project.json`, `tsconfig.json`) and update tags to satisfy module-boundary rules.
- [ ] T003 [P] Verify linting and formatting inherit repo standards (Prettier, ESLint) and add required npm scripts or Nx targets.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

Examples of foundational tasks (adjust based on your project):

- [ ] T004 Establish shared types or AST builders in `packages/[feature]/src/lib/[module].ts`.
- [ ] T005 [P] Scaffold CLI command/flag skeleton in `tools/gram-cli/src/commands/[command].ts` wired to placeholder library calls.
- [ ] T006 [P] Add Vitest + `fast-check` harness covering new grammar invariants in `packages/[feature]/src/lib/__tests__/[feature].spec.ts`.
- [ ] T007 Seed representative `.gram` fixtures in `samples/[feature]/` and document expected outputs.
- [ ] T008 Configure structured logging or `--json` output adapters to keep observability consistent.
- [ ] T009 Record planned Nx validation commands (`npx nx lint`, `npx nx test`, `npx nx build`) in plan.md and ensure automation scripts are updated.

**Checkpoint**: Foundation ready—user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 1 (REQUIRED FOR CODE CHANGES)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T010 [P] [US1] Add Vitest contract/property test in `packages/[feature]/src/lib/__tests__/[scenario].spec.ts`.
- [ ] T011 [P] [US1] Add CLI integration test in `tools/gram-cli/src/lib/[scenario].spec.ts` covering human + `--json` modes.

### Implementation for User Story 1

- [ ] T012 [P] [US1] Implement typed API in `packages/[feature]/src/lib/[feature].ts`.
- [ ] T013 [US1] Export new entry points via `packages/[feature]/src/index.ts`.
- [ ] T014 [US1] Wire CLI command or flag in `tools/gram-cli/src/commands/[command].ts` and update help text.
- [ ] T015 [US1] Update samples/README documentation showing the new behavior.
- [ ] T016 [US1] Update structured logging/telemetry to reflect new outputs.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 2 (REQUIRED FOR CODE CHANGES)

- [ ] T018 [P] [US2] Add Vitest contract/property test in `packages/[feature]/src/lib/__tests__/[scenario].spec.ts`.
- [ ] T019 [P] [US2] Add CLI integration test in `tools/gram-cli/src/lib/[scenario].spec.ts`.

### Implementation for User Story 2

- [ ] T020 [P] [US2] Extend library behavior in `packages/[feature]/src/lib/[module].ts`.
- [ ] T021 [US2] Update exports in `packages/[feature]/src/index.ts`.
- [ ] T022 [US2] Extend CLI surface in `tools/gram-cli/src/commands/[command].ts` (new subcommand or flag).
- [ ] T023 [US2] Revise samples/fixtures and documentation for the new scenarios.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 3 (REQUIRED FOR CODE CHANGES)

- [ ] T024 [P] [US3] Add Vitest contract/property test in `packages/[feature]/src/lib/__tests__/[scenario].spec.ts`.
- [ ] T025 [P] [US3] Add CLI integration test in `tools/gram-cli/src/lib/[scenario].spec.ts`.

### Implementation for User Story 3

- [ ] T026 [P] [US3] Implement remaining library logic in `packages/[feature]/src/lib/[module].ts`.
- [ ] T027 [US3] Adjust exports and typing guards in `packages/[feature]/src/index.ts`.
- [ ] T028 [US3] Update CLI flows and help text in `tools/gram-cli/src/commands/[command].ts`.

**Checkpoint**: All user stories should now be independently functional.

---

[Add more user story phases as needed, following the same pattern.]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories.

- [ ] TXXX [P] Update repository documentation or `tools/gram-cli/README.md`.
- [ ] TXXX Harden error handling and structured logs across affected modules.
- [ ] TXXX Perform performance profiling or footprint analysis if required.
- [ ] TXXX [P] Expand unit/property tests for edge cases in `packages/<feature>/src/lib/__tests__/`.
- [ ] TXXX Validate quickstart or sample walkthroughs and refresh `samples/`.
- [ ] TXXX Capture executed Nx commands (`lint`, `test`, `build`) in PR notes.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies—can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion—BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
  - User stories can proceed in parallel (if staffed) once foundational work is done.
  - Or sequentially in priority order (P1 → P2 → P3).
- **Polish (Final Phase)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)—No dependencies on other stories.
- **User Story 2 (P2)**: Can start after Foundational (Phase 2)—May integrate with US1 but must remain independently testable.
- **User Story 3 (P3)**: Can start after Foundational (Phase 2)—May integrate with US1/US2 while keeping independent verification.

### Within Each User Story

- Tests MUST be written first and observed failing before implementation.
- Library modules come before exports, exports before CLI wiring, CLI before documentation.
- CLI help and samples MUST be updated before calling the story complete.
- Story completion requires Vitest suites, CLI integrations, and Nx commands to pass.

### Parallel Opportunities

- Setup tasks marked [P] can run in parallel.
- Foundational tasks marked [P] can run in parallel (within Phase 2).
- Once Foundational phase completes, user stories can start in parallel (team capacity permitting).
- Tests and library modules for a single story marked [P] can be tackled in parallel.
- Different user stories can be assigned to different team members while respecting consolidation checkpoints.

---

## Parallel Example: User Story 1

```bash
# Execute contract and property tests together
npx nx test [library-project] --testFile packages/[feature]/src/lib/__tests__/[scenario].spec.ts
npx nx test gram-cli --testFile tools/gram-cli/src/lib/[scenario].spec.ts

# Validate builds and linting for the affected projects
npx nx lint [library-project]
npx nx build [library-project]
npx nx lint gram-cli
npx nx build gram-cli --configuration=production
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational (CRITICAL—blocks all stories).
3. Complete Phase 3: User Story 1.
4. **STOP and VALIDATE**: Run required Nx commands and CLI demos to confirm User Story 1 independently.
5. Deploy/demo if ready.

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready.
2. Add User Story 1 → Test independently → Record Nx commands → Deploy/Demo (MVP!).
3. Add User Story 2 → Test independently → Record Nx commands → Deploy/Demo.
4. Add User Story 3 → Test independently → Record Nx commands → Deploy/Demo.
5. Each story adds value without breaking previous stories.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together.
2. Once Foundational is done:
   - Developer A: User Story 1 (library + CLI).
   - Developer B: User Story 2 (library + CLI).
   - Developer C: User Story 3 (library + CLI).
3. Stories complete and integrate independently while maintaining shared samples and observability.

---

## Notes

- [P] tasks = different files, no dependencies.
- Each user story must map to both a library module and CLI entry point (unless explicitly documented as library-only in the spec).
- Verify tests fail before implementing.
- Commit after each task or logical group.
- Stop at any checkpoint to validate story independently.
- Avoid vague tasks, same-file conflicts, or cross-story dependencies that break independence.
- Capture coverage deltas and CLI output artifacts when stories complete.
