import { Parser } from 'gram';

type CstSyntax = Parameters<typeof Parser.map>[0];

export const cypherText = (cst: CstSyntax): string => cst.text ?? '';

export const cypherSyntax = (cst: CstSyntax) =>
  Parser.map(cst, (node) => ({
    ...node,
    cypher: cypherText(node),
  }));

export type CypherSyntaxNode = ReturnType<typeof cypherSyntax>;

export const toCypherMerge = (cst: CstSyntax): string[] =>
  Parser.reduce<string[]>(cst, (node, acc) => {
    if (node.type === 'pattern') {
      acc.push(`MERGE ${cypherText(node)}`);
    }
    return acc;
  }, []);
