# Repository Guidelines

## Project Structure & Module Organization

This Nx workspace groups publishable libraries under `packages/*`. `packages/gram`, `packages/gram-cypher`, and `packages/data` expose TypeScript entry points via `src/index.ts`; co-locate feature modules in `src/lib/` and mirror the package name for clarity. `tools/gram-cli` hosts the CLI app backed by shared libraries. Generated bundles land in `dist/packages/<project>`. Sample grammars and fixtures live in `samples/`, while shared config (`tsconfig.base.json`, `.eslintrc*`) sits at the repo root—coordinate changes there across packages.

## Build, Test, and Development Commands

- `npm ci` installs dependencies exactly as CI does.
- `npx nx test <project>` runs Vitest suites and writes reports to `coverage/`.
- `npx nx build <project>` emits CommonJS bundles into `dist/packages/<project>`.
- `npx nx lint <project>` invokes ESLint (targets are inferred when `.eslintrc` exists).
- `npx nx format:check` verifies Prettier formatting; use `format:write` before commits.
- `npx nx graph` visualizes dependency relationships before major refactors.
- `npx nx affected -t lint test build` mirrors the CI pipeline for changed projects.

## Coding Style & Naming Conventions

Prettier enforces single quotes and 2-space indents; avoid manual tweaks. Prefer named exports, reserving default exports for package entrypoints. Keep files and directories kebab-case (`parser-state.ts`), while types and classes use PascalCase. ESLint’s module-boundary rule is strict—update project tags when introducing new cross-package dependencies.

## Testing Guidelines

Vitest drives unit coverage through the Nx Vite executor. Place specs alongside code as `src/**/*.spec.ts` or `src/**/*.test.ts`. Reach for `fast-check` when validating parser transforms or matcher invariants. Coverage artifacts live under `coverage/packages/<project>`; expand suites whenever you touch parsing logic or CLI flows. Before submission, run `npx nx run-many -t test -p <touched-projects>` to confirm every affected library stays green.

## Commit & Pull Request Guidelines

Write commits like the current history: short, imperative summaries (`reorganize samples into subdirs`) with optional detail in the body. Keep unrelated formatting out of feature commits. Pull requests should capture motivation, outline functional changes, and link issues when available. Attach screenshots or console output for CLI surfaces. Close with the exact Nx commands you executed (lint, test, build) so reviewers can replay your validation.

## Active Technologies

- TypeScript 5.9.3 (Nx-managed) + tree-sitter 0.25, @gram-data/tree-sitter-gram 0.2.x, Nx 22 toolchain (001-update-cst-types)
- N/A — in-memory CST processing only (001-update-cst-types)

## Recent Changes

- 001-update-cst-types: Added TypeScript 5.9.3 (Nx-managed) + tree-sitter 0.25, @gram-data/tree-sitter-gram 0.2.x, Nx 22 toolchain
