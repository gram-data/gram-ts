import Parser from 'tree-sitter';
import GramLang from '@gram-data/tree-sitter-gram';

import { pipe, Option } from "effect"

const parser = new Parser();
parser.setLanguage(GramLang);

export const parse = (code:string) => parser.parse(code);

export const reduce = <T>(cst:GramSyntaxNode, f:(cst:GramSyntaxNode, acc:T) => T, acc:T):T => {
  const result = (cst.children !== null && cst.children.length > 0) ?
  cst.children.reduce((acc, child) => reduce(child, f, acc), acc) : acc; 
  return f(cst, result);
}

export type SyntaxNodeFunction<T> = (cst:Parser.SyntaxNode) => T;


export type GramCstRelationshipTypeTag = 
  "undirected_single" |
  "undirected_double_arrow" |
  "undirected_squiggle" |
  "single_arrow_right" |
  "single_arrow_left" |
  "double_arrow_right" |
  "double_arrow_left" |
  "squiggle_arrow_right" |
  "squiggle_arrow_left";


export type GramSemanticElementTypeTag = "node" | GramCstRelationshipTypeTag;

export type GramSyntaxElementTypeTag = GramSemanticElementTypeTag;

export interface GramSyntaxNode extends Parser.SyntaxNode {
  type: GramSyntaxElementTypeTag;
  children: GramSyntaxNode[];
}


export type GramSemanticStats = Record<GramSemanticElementTypeTag, number>;

export const emptyStats:GramSemanticStats = {
  node: 0,
  single_arrow_right: 0,
  single_arrow_left: 0,
  undirected_single: 0,
  undirected_double_arrow: 0,
  undirected_squiggle: 0,
  double_arrow_right: 0,
  double_arrow_left: 0,
  squiggle_arrow_right: 0,
  squiggle_arrow_left: 0
}

export const isGramSemanticElement = (cst:Parser.SyntaxNode):cst is GramSyntaxNode => {
  switch (cst.type) {
    case "node":
    case "undirected_single":
    case "undirected_double_arrow":
    case "undirected_squiggle":
    case "single_arrow_right":
    case "single_arrow_left":
    case "double_arrow_right":
    case "double_arrow_left":
    case "squiggle_arrow_right":
    case "squiggle_arrow_left":
      return true;
    default:
      return false;
  }
}


export const stats = (cst:GramSyntaxNode) => reduce(cst, (cst, acc) => {
  return pipe(
    isGramSemanticElement(cst) ? Option.some(cst) : Option.none(),
    Option.map((cst) => ({
      ...acc,
      [cst.type]: acc[cst.type] + 1,
    })),
    Option.getOrElse(() => acc)
  )
  }, 
  emptyStats);
