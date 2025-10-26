import type { SyntaxNode } from 'tree-sitter';

import type { CstSyntax, CstSyntaxTypeTag } from './cst-types';

export interface StringifyOptions {
  /**
   * When true (default), include byte-range metadata for each node in the
   * output just like the tree-sitter CLI.
   */
  includeRanges?: boolean;
  /**
   * When true (default), include field names (`left:`, `value:`) in the output.
   */
  includeFields?: boolean;
}

export class UnknownCstNodeError extends Error {
  constructor(
    nodeType: string,
    context: { path: string[] }
  ) {
    const path = context.path.length > 0 ? context.path.join(' > ') : '(root)';
    super(`Unknown CST node type "${nodeType}" encountered at ${path}`);
    this.name = 'UnknownCstNodeError';
  }
}

const KNOWN_TYPE_LIST: readonly CstSyntaxTypeTag[] = [
  'annotation',
  'annotations',
  'array',
  'bidirectional_arrow',
  'boolean_literal',
  'decimal',
  'gram',
  'hexadecimal',
  'integer',
  'labels',
  'left_arrow',
  'map',
  'mapping',
  'measurement',
  'node',
  'octal',
  'pattern',
  'property',
  'range',
  'record',
  'reference',
  'relationship',
  'right_arrow',
  'string_content',
  'string_literal',
  'sub_pattern',
  'subject',
  'symbol',
  'tagged_string',
  'undirected_arrow',
];

const KNOWN_TYPES = new Set<CstSyntaxTypeTag>(KNOWN_TYPE_LIST);

interface InternalOptions {
  includeRanges: boolean;
  includeFields: boolean;
}

export const stringifyCst = (
  root: CstSyntax,
  options: StringifyOptions = {}
): string => {
  const internal: InternalOptions = {
    includeRanges: options.includeRanges ?? true,
    includeFields: options.includeFields ?? true,
  };
  const normalisedRoot = ensureKnownType(root, [root.type]);
  const lines = formatNode(normalisedRoot, internal, 0, [normalisedRoot.type]);
  return lines.join('\n');
};

function formatNode(
  node: SyntaxNode,
  options: InternalOptions,
  indent: number,
  path: string[]
): string[] {
  const indentStr = '  '.repeat(indent);
  const rangeSegment = options.includeRanges
    ? ` [${node.startPosition.row}, ${node.startPosition.column}] - [${node.endPosition.row}, ${node.endPosition.column}]`
    : '';
  const lines = [`${indentStr}(${node.type}${rangeSegment}`];

  const children = namedChildEntries(node);
  if (children.length === 0) {
    lines[0] += ')';
    return lines;
  }

  for (const { child, fieldName } of children) {
    const nextPathBase = fieldName
      ? [...path, `${node.type}.${fieldName}`]
      : [...path, node.type];
    const typedChild = ensureKnownType(child, nextPathBase);
    const childLines = formatNode(
      typedChild,
      options,
      indent + 1,
      [...nextPathBase, typedChild.type]
    );
    const expectedIndent = '  '.repeat(indent + 1);
    const prefix = `${expectedIndent}${
      fieldName && options.includeFields ? `${fieldName}: ` : ''
    }`;
    if (childLines.length > 0) {
      childLines[0] = childLines[0].startsWith(expectedIndent)
        ? prefix + childLines[0].slice(expectedIndent.length)
        : prefix + childLines[0];
    }
    lines.push(...childLines);
  }

  lines[lines.length - 1] += ')';
  return lines;
}

function namedChildEntries(node: SyntaxNode): Array<{
  child: SyntaxNode;
  fieldName: string | null;
}> {
  const entries: Array<{ child: SyntaxNode; fieldName: string | null }> = [];
  for (let i = 0; i < node.childCount; i += 1) {
    const child = node.child(i);
    if (!child) {
      continue;
    }
    const childIsNamed = !!(child as { isNamed?: boolean }).isNamed;
    if (!childIsNamed) {
      continue;
    }
    entries.push({
      child,
      fieldName: node.fieldNameForChild(i),
    });
  }
  return entries;
}

function ensureKnownType(
  node: SyntaxNode,
  path: string[]
): SyntaxNode {
  const type = node.type as CstSyntaxTypeTag;
  if (KNOWN_TYPES.has(type)) {
    return node;
  }
  throw new UnknownCstNodeError(node.type, { path: [...path, node.type] });
}
