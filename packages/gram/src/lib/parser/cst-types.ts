/* eslint-disable @typescript-eslint/no-empty-interface */

import { SyntaxNode } from "tree-sitter";


export interface CstSyntax extends SyntaxNode {
  readonly type: CstSyntaxTypeTag;
  readonly text: string;
  children: CstSyntax[];
}

export interface CstGram extends CstSyntax {
  type: 'gram';
}
export interface CstPattern extends CstSyntax {
  type: 'pattern';
}

export interface CstIdentifier extends CstSyntax {
  type: 'identifier';
}

export interface CstLabels extends CstSyntax {
  type: 'labels';
}

export interface CstProperty extends CstSyntax {
  type: 'property';
  keyNode: CstIdentifier;
  valueNode: CstAttributes;
}

export interface CstRecord extends CstSyntax {
  namedChildren: CstProperty[];
}

export interface CstAttributes extends CstSyntax {
  identifierNode?: CstIdentifier;
  labelsNode?: CstLabels;
  recordNode?: CstRecord;
}

export interface CstNode extends CstAttributes {
  type: 'node';
}

export type CstRelationshipValueTypeTag =
  | 'single_undirected'
  | 'single_bidirectional'
  | 'single_right'
  | 'single_left'
  | 'double_undirected'
  | 'double_bidirectional'
  | 'double_right'
  | 'double_left'
  | 'squiggle_undirected'
  | 'squiggle_bidirectional'
  | 'squiggle_right'
  | 'squiggle_left';

export type CstSyntaxTypeTag =
  | 'gram'
  | 'pattern'
  | 'node'
  | 'relationship'
  | 'record'
  | 'property'
  | 'identifier'
  | 'labels'
  | CstRelationshipValueTypeTag;

export interface CstRelationshipValue extends CstAttributes {
  type: CstRelationshipValueTypeTag;
}

export interface CstRelationship extends CstSyntax {
  readonly leftNode: CstNode;
  readonly rightNode: CstNode | CstRelationship;
  readonly valueNode: CstRelationshipValue;
}
