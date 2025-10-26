# gram

Type-safe helpers for parsing Gram syntax with Tree-sitter. The library bundles the latest [`@gram-data/tree-sitter-gram`](https://www.npmjs.com/package/@gram-data/tree-sitter-gram) grammar and exposes parse utilities, CST traversal helpers, and a deterministic s-expression stringifier.

## Usage

```ts
import { Parser } from '@gram-data/gram';

const { rootNode } = Parser.parse('(Person {name: "Mara"})-[:KNOWS]->(Person)');
```

### Stringify CST output

```ts
import { Parser, stringifyCst } from '@gram-data/gram';

const tree = Parser.parse('(A)-[:KNOWS]->(B)');
const sexp = stringifyCst(tree.rootNode, {
  includeRanges: false,
  includeFields: true,
});

console.log(sexp);
// (gram
//   (pattern
//     elements: (relationship
//       left: (node)
//       kind: (right_arrow)
//       right: (node))))
```

The stringifier mirrors the Tree-sitter CLI output and raises an `UnknownCstNodeError` if it encounters a node type not covered by the generated CST typings. Provide a `GRAM_CORPUS_ROOT` environment variable to point corpus-based tests at alternative fixture roots.

## Upgrade notes (001-update-cst-types)

- `cst-types.ts` aligns with the Tree-sitter grammar as of ree-sitter `0.25`.
- New `stringifyCst` options let you hide byte ranges (`includeRanges: false`) or omit field labels (`includeFields: false`) for concise diffs.
- Corpus-driven regression tests now run with `nx test gram`, ensuring positive fixtures stringify exactly like the CLI and `:error` samples surface meaningful diagnostics. See `samples/corpus/` for examples of successful and failing patterns.

## Development

- `nx build gram` produces the CommonJS bundle under `dist/packages/gram`.
- `nx test gram` runs the full Vitest suite, including corpus regression coverage.
- `nx format:write packages-gram` ensures the package matches the repo formatting profile.
