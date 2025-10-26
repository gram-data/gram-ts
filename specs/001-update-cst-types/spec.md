# Feature Specification: Update Gram CST Type Definitions

**Feature Branch**: `001-update-cst-types`  
**Created**: 2025-10-26  
**Status**: Draft  
**Input**: User description: "Update the gram CST type definitions to match the latest tree-sitter-gram grammar. Syntax nodes may have been added, removed or changed. Testing should borrow from the tree-sitter-gram corpus for positive and negative examples (marked with :error)"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Grammar Alignment Audit (Priority: P1)

As a Gram parser maintainer, I need the CST type definitions to mirror every syntax node in the latest tree-sitter-gram grammar so that generated structures remain accurate and builds continue to pass without manual patching.

**Why this priority**: Mismatched node definitions immediately break downstream consumers and block adoption of grammar changes.

**Independent Test**: Run type generation validation against the grammar catalog and confirm no missing or stale node definitions remain.

**Acceptance Scenarios**:

1. **Given** the updated tree-sitter-gram grammar, **When** the CST type definitions are audited, **Then** every declared grammar node has a corresponding type entry with correct shape and metadata.
2. **Given** previously removed grammar nodes, **When** the CST types are regenerated, **Then** obsolete definitions are deleted without leaving dangling references in public exports.

---

### User Story 2 - Corpus-Based Regression Protection (Priority: P2)

As a tooling engineer integrating Gram, I need automated tests that replay the tree-sitter-gram corpus (including `:error` cases) so that changes to CST types warn me about regressions before release.

**Why this priority**: The corpus captures real usage and failure conditions; without exercising it, regressions slip into published packages.

**Independent Test**: Execute the new regression suite and confirm all positive corpus examples parse successfully while `:error` cases surface appropriate failures.

**Acceptance Scenarios**:

1. **Given** positive samples from the tree-sitter-gram corpus, **When** the regression suite runs, **Then** each sample produces a CST conforming to the updated type definitions.
2. **Given** `:error`-marked corpus samples, **When** the regression suite runs, **Then** each sample fails with an explicit parsing failure linked to the relevant test assertion.

### Edge Cases

- Grammar introduces a new node with optional children; verify the CST type captures optionality without forcing undefined access.
- Grammar removes or renames a legacy node; ensure public exports and documentation stop referencing the obsolete structure.
- Corpus includes UTF-8 or escaped-character samples; confirm tests cover these without truncation or incorrect encoding handling.
- `:error` samples overlap with newly valid syntax; tests must distinguish updated grammar rules from true errors.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The CST type definition catalog MUST represent every syntax node currently emitted by tree-sitter-gram, including new or renamed nodes introduced by the latest grammar update.
- **FR-002**: Any CST types associated with nodes removed from the grammar MUST be deleted or deprecated so they are no longer exported in `packages/gram` entry points.
- **FR-003**: Generated or hand-curated metadata that documents node children and attributes MUST stay in sync with the grammar’s field definitions, including optional vs. required children.
- **FR-004**: A regression test suite MUST execute the tree-sitter-gram corpus positive samples and assert that produced CST instances validate against the updated type definitions.
- **FR-005**: The regression suite MUST run tree-sitter-gram `:error` samples and assert that each produces a failure mode highlighting the offending syntax element.
- **FR-006**: Documentation for CST node usage in `packages/gram/README.md` (or successor doc) MUST outline changes and guidance for downstream developers upgrading from the prior release.

### Key Entities *(include if feature involves data)*

- **CST Node Definition**: Describes the shape, fields, and relationships of a syntax node emitted by the parser; used to generate TypeScript typings and downstream tooling expectations.
- **Corpus Sample**: A positive or negative grammar example drawn from tree-sitter-gram, paired with metadata about expected parsing outcomes for regression validation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Grammar alignment review documents zero missing or obsolete CST node definitions when compared against the published tree-sitter-gram node list.
- **SC-002**: Automated regression run reports 100% pass rate for positive corpus samples and 100% expected failures for `:error` samples on CI.
- **SC-003**: Upgrade guide published with the release receives sign-off from at least one downstream consumer confirming the instructions were sufficient to adopt the changes within one sprint.
- **SC-004**: All existing lint, build, and regression quality gates for impacted Gram packages complete without new failures on the release candidate branch.

## Developer Experience Commitments *(mandatory)*

- **DX-001**: CLI or API documentation MUST be updated in `packages/gram/README.md` and the tree-sitter integration notes so developers can map grammar nodes to CST types during upgrades.
- **DX-002**: Samples in `samples/` MUST include at least one new positive and one `:error` example tied to the grammar update, or explicitly justify why existing samples remain sufficient.
- **DX-003**: Parser error messaging MUST be reviewed to ensure references to CST node names match the updated terminology and point developers to the revised documentation.

## Assumptions

- The latest tree-sitter-gram grammar and corpus are available locally within `tree-sitter-gram/` at the commit targeted for this release.
- Downstream TypeScript projects consume CST types via published packages rather than internal relative imports, so updating exports covers adopters.
- CI environments running Nx commands have access to the corpus fixtures needed for the new regression suite.

## Dependencies

- Coordination with the tree-sitter-gram maintainers to confirm the target grammar revision and receive notification of late-breaking node changes.
- Access to the existing CST generation tooling or scripts that populate the current type definitions.
- Availability of CI resources to execute the expanded regression suite within acceptable build times.
