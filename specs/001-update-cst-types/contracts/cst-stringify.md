# CST Stringify Contract

## Overview

Library consumers import the CST stringify utility from `packages/gram` to transform parsed CST trees into s-expressions that match the tree-sitter CLI output. The contract below defines the callable surface and expected behaviors.

## Function Signature

```ts
import type { CstNode } from '@gram-data/gram';

interface StringifyOptions {
  /** When true, include byte-range metadata for each node (defaults to false). */
  includeRanges?: boolean;
}

declare function stringifyCst(
  root: CstNode,
  options?: StringifyOptions
): string;
```

## Behavioral Guarantees

- The returned string MUST be byte-for-byte identical to `tree-sitter parse --quiet` output for the equivalent input, including whitespace and node labels.
- Optional `includeRanges` mirrors the CLI `--with-ranges` flag; when omitted the output excludes position metadata.
- The function MUST throw a descriptive error if the CST includes an unknown node type or otherwise violates the generated type definitions.

## Error Contract

```ts
declare class UnknownCstNodeError extends Error {
  constructor(nodeType: string, context: { path: string[] });
}
```

- `UnknownCstNodeError` is raised when encountering a node absent from the generated catalog.
- Additional parsing failures SHOULD surface as the original parser errors without wrapping.
