import Parser from 'tree-sitter';
import type { SyntaxNode } from 'tree-sitter';
import GramLang from '@gram-data/tree-sitter-gram';

import type { CstNode, CstProperty, CstRelationship, CstLabels, CstRecord, CstSyntaxTypeTag, CstSyntax, CstGram } from './cst-types';

import { pipe, Option } from 'effect';

const parser = new Parser();
parser.setLanguage(GramLang);

export interface GramParseTree extends Parser.Tree {
  rootNode: CstGram;
}

export const parse = (code: string) => parser.parse(code) as GramParseTree;

export const reduce = <T>(
  cst: CstSyntax,
  f: (cst: CstSyntax, acc: T) => T,
  acc: T
): T => {
  const result =
    cst.children?.length > 0
      ? cst.children.reduce((acc, child) => reduce(child, f, acc), acc)
      : acc;
  return f(cst, result);
};

export type Treelike<T> = {
  [Property in keyof T]: unknown;
} & { children: Treelike<T>[] };

export const map = <T extends Record<string, unknown>>(
  cst: CstSyntax,
  f: (cst: CstSyntax) => T
): Treelike<T> => ({
  ...f(cst),
  children: cst.children.map((child) => map(child, f)),
});

export type SyntaxNodeFunction<T> = (cst: SyntaxNode) => T;

export type GramStats = Partial<Record<CstSyntaxTypeTag, number>>;

export const emptyStats: GramStats = {
  // pattern: 0,
  // relationship: 0,
  // record: 0,
  // node: 0,
  // identifier: 0,
  // single_undirected: 0,
  // single_bidirectional: 0,
  // single_right: 0,
  // single_left: 0,
  // double_undirected: 0,
  // double_bidirectional: 0,
  // double_right: 0,
  // double_left: 0,
  // squiggle_undirected: 0,
  // squiggle_bidirectional: 0,
  // squiggle_right: 0,
  // squiggle_left: 0
};

export const isCstSyntax = (o: unknown): o is CstSyntax =>
  typeof o === 'object' && o !== null && 'type' in o;

export const isCstNode = (o: unknown): o is CstNode =>
  isCstSyntax(o) && o.type === 'node';

export const isCstRelationship = (o: unknown): o is CstRelationship =>
  isCstSyntax(o) && o.type === 'relationship';

export const isCstLabels = (o: unknown): o is CstLabels =>
  isCstSyntax(o) && o.type === 'labels';

export const isCstRecord = (o: unknown): o is CstRecord =>
  isCstSyntax(o) && o.type === 'record';

export const isCstSemanticElement = (o: unknown): o is CstSyntax => {
  if (typeof o !== 'object' || o === null || !('type' in o)) {
    return false;
  }
  switch (o.type) {
    case 'pattern':
    case 'node':
    case 'relationship':
    case 'record':
    case 'property':
    case 'single_undirected':
    case 'single_bidirectional':
    case 'single_right':
    case 'single_left':
    case 'double_undirected':
    case 'double_bidirectional':
    case 'double_right':
    case 'double_left':
    case 'squiggle_undirected':
    case 'squiggle_bidirectional':
    case 'squiggle_right':
    case 'squiggle_left':
    case 'labels':
    case 'identifier':
      return true;
    default:
      return false;
  }
};

export const stats = (cst: CstSyntax) =>
  reduce(
    cst,
    (cst, acc) => {
      return pipe(
        isCstSemanticElement(cst) ? Option.some(cst) : Option.none(),
        Option.map((cst) => ({
          ...acc,
          [cst.type]:
            (acc[cst.type] ?? 0) +
            (cst.type === 'labels' ? cst.namedChildCount : 1),
        })),
        Option.getOrElse(() => acc)
      );
    },
    emptyStats
  );

export const nodes = (cst: CstSyntax): CstNode[] =>
  reduce(
    cst,
    (cst, acc) => {
      return isCstNode(cst) ? [...acc, cst] : acc;
    },
    [] as CstNode[]
  );

export const leftNode = (cst: CstRelationship): CstNode => cst.leftNode;

export const rightNode = (cst: CstRelationship): CstNode =>
  isCstNode(cst.rightNode) ? cst.rightNode : leftNode(cst.rightNode);

export const relationships = (cst: CstSyntax): CstRelationship[] =>
  reduce(
    cst,
    (cst, acc) => {
      return isCstRelationship(cst) ? [cst, ...acc] : acc;
    },
    [] as CstRelationship[]
  );

export const labels = (cst: CstSyntax): Set<string> =>
  reduce(
    cst,
    (cst, acc) => {
      if (isCstLabels(cst))
        cst.namedChildren.forEach((child) => acc.add(child.text));
      return acc;
    },
    new Set<string>()
  );

export const properties = (cst: CstSyntax): CstProperty[] =>
  reduce(
    cst,
    (cst, acc) => {
      // if (isCstRecord(cst)) { cst.namedChildren.forEach((property:CstProperty)=> console.log(`${property.keyNode.text}:${property.valueNode.text}`)) }
      return isCstRecord(cst) ? [...acc, ...cst.namedChildren] : acc;
    },
    [] as CstProperty[]
  );

export const propertyKey = (cst: CstProperty): string => cst.keyNode.text;
export const propertyValue = (cst: CstProperty): string => cst.valueNode.text;
