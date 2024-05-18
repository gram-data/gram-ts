import type { GramSyntaxNode } from '@gram-data/sanity';
import * as Gram from '@gram-data/sanity';
import { isCstNode } from '@gram-data/sanity';

export interface CypherSyntaxNode extends GramSyntaxNode {
  cypher: string;
  children: CypherSyntaxNode[];
}

export const cypherText = (cst: GramSyntaxNode): string => {
  switch (cst.type) {
    case 'node':
      if (isCstNode(cst)) {
        const identifier = cst.identifierNode ? cypherText(cst.identifierNode);
      }
      return '';
    default:
      return '';
  }
}

export const cypherSyntax = (cst: GramSyntaxNode) => Gram.map(cst, (cst) => {
    return { ...cst, cypher: `cypher<${cst.text}>` };
  })

export const toCypherMerge = (cst: GramSyntaxNode): string[] => Gram.reduce(
    cst,
    (cst, acc) => {
      switch (cst.type) {
        case 'pattern':
          acc.push(`MERGE ${cst.text}`);
          break;
      }
      return acc;
    },
    [] as string[]
  );
