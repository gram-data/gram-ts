/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'node:path';

export interface GrammarTypeRef {
  type: string;
  named: boolean;
}

export interface GrammarAggregateSpec {
  multiple: boolean;
  required: boolean;
  types: GrammarTypeRef[];
}

export interface GrammarNodeSpec {
  type: string;
  named: boolean;
  fields: Record<string, GrammarAggregateSpec>;
  children?: GrammarAggregateSpec;
  aliases?: GrammarTypeRef[];
  subtypes?: GrammarTypeRef[];
}

export interface GrammarMetadata {
  nodes: GrammarNodeSpec[];
  nodeByType: Map<string, GrammarNodeSpec>;
  mergedArrowSymbols: Set<string>;
  sourceDir: string;
}

const NODE_TYPES_PATH = '@gram-data/tree-sitter-gram/src/node-types.json';

const rawNodes: GrammarNodeSpec[] = require(NODE_TYPES_PATH);

const nodeByType = new Map<string, GrammarNodeSpec>();
for (const node of rawNodes) {
  nodeByType.set(node.type, normaliseAggregateFlags(node));
}

const mergedArrowSymbols = new Set(['-->', '==>', '~~>']);

function normaliseAggregateFlags(node: GrammarNodeSpec): GrammarNodeSpec {
  const fields: Record<string, GrammarAggregateSpec> = {};

  for (const [fieldName, spec] of Object.entries(node.fields ?? {})) {
    fields[fieldName] = {
      multiple: Boolean(spec.multiple),
      required: Boolean(spec.required),
      types: spec.types ?? [],
    };
  }

  const children: GrammarAggregateSpec | undefined = node.children
    ? {
        multiple: Boolean(node.children.multiple),
        required: Boolean(node.children.required),
        types: node.children.types ?? [],
      }
    : undefined;

  return {
    ...node,
    fields,
    ...(children ? { children } : {}),
    aliases: node.aliases ?? [],
    subtypes: node.subtypes ?? [],
  };
}

export const grammarMetadata: GrammarMetadata = {
  nodes: [...nodeByType.values()],
  nodeByType,
  mergedArrowSymbols,
  sourceDir: path.dirname(require.resolve(NODE_TYPES_PATH)),
};

export function resolveNode(type: string): GrammarNodeSpec | undefined {
  return grammarMetadata.nodeByType.get(type);
}

export function getNodeTypes(): string[] {
  return grammarMetadata.nodes.map((node) => node.type);
}

export function isMergedArrowSymbol(symbol: string): boolean {
  return grammarMetadata.mergedArrowSymbols.has(symbol);
}
