# Quickstart: Gram CLI Parse Command

## Prerequisites

- Node.js and npm aligned with repository tooling (`npm ci` recommended).
- Workspace bootstrapped: `npm ci && npx nx graph` (optional sanity check).
- Sample grammar file available (e.g., `samples/basic.gram`).

## Run the Parse Command

```bash
npx nx run tools-gram-cli:build
node dist/packages/tools/gram-cli/main.js parse samples/basic.gram
```

- Expects stdout to contain the s-expression representation of the grammar.
- Diagnostics (if any) will print to stderr; exit status communicates success/failure.

## Testing

```bash
npx nx test tools-gram-cli
```

- Vitest suite leverages Effect’s `MockConsole` to validate stdout/stderr separation and exit codes.
- Add fixtures under `samples/` or a dedicated test fixture directory for malformed grammars.

## Documentation Checklist

- Update `tools/gram-cli/README.md` with usage examples and troubleshooting tips.
- Ensure `gram parse --help` reflects the new subcommand description and argument details.
- If samples change, document the command usage near the updated sample files.
