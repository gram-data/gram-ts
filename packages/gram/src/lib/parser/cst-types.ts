import type { SyntaxNode } from 'tree-sitter';

/**
 * All named CST node type tags emitted by the current tree-sitter-gram grammar.
 */
export type CstSyntaxTypeTag =
  | 'annotation'
  | 'annotations'
  | 'array'
  | 'bidirectional_arrow'
  | 'boolean_literal'
  | 'decimal'
  | 'gram'
  | 'hexadecimal'
  | 'integer'
  | 'labels'
  | 'left_arrow'
  | 'map'
  | 'mapping'
  | 'measurement'
  | 'node'
  | 'octal'
  | 'pattern'
  | 'property'
  | 'range'
  | 'record'
  | 'reference'
  | 'relationship'
  | 'right_arrow'
  | 'string_content'
  | 'string_literal'
  | 'sub_pattern'
  | 'subject'
  | 'symbol'
  | 'tagged_string'
  | 'undirected_arrow';

type BaseNode<TType extends CstSyntaxTypeTag> = SyntaxNode & {
  readonly type: TType;
};

export type CstSyntax =
  | CstAnnotation
  | CstAnnotations
  | CstArray
  | CstBidirectionalArrow
  | CstBooleanLiteral
  | CstDecimal
  | CstGram
  | CstHexadecimal
  | CstInteger
  | CstLabels
  | CstLeftArrow
  | CstMap
  | CstMapping
  | CstMeasurement
  | CstNode
  | CstOctal
  | CstPattern
  | CstProperty
  | CstRange
  | CstRecord
  | CstReference
  | CstRelationship
  | CstRightArrow
  | CstStringContent
  | CstStringLiteral
  | CstSubject
  | CstSubPattern
  | CstSymbol
  | CstTaggedString
  | CstUndirectedArrow;

export type CstIdentifierNode = CstSymbol | CstStringLiteral | CstInteger;

export type CstScalarValueNode =
  | CstBooleanLiteral
  | CstDecimal
  | CstHexadecimal
  | CstInteger
  | CstMeasurement
  | CstOctal
  | CstRange
  | CstStringLiteral
  | CstSymbol
  | CstTaggedString;

export type CstValueNode =
  | CstScalarValueNode
  | CstArray
  | CstMap;

export type CstAttributeNode =
  | CstIdentifierNode
  | CstLabels
  | CstRecord
  | CstStringLiteral;

export type CstRelationshipArrow =
  | CstRightArrow
  | CstLeftArrow
  | CstBidirectionalArrow
  | CstUndirectedArrow;

interface AttributedElement<TType extends CstSyntaxTypeTag>
  extends BaseNode<TType> {
  readonly annotationsNode: CstAnnotations | null;
  readonly attributesNodes: CstAttributeNode[];
  readonly identifierNode: CstIdentifierNode | null;
  readonly labelsNode: CstLabels | null;
  readonly recordNode: CstRecord | null;
}

export interface CstGram extends BaseNode<'gram'> {}

export interface CstPattern extends BaseNode<'pattern'> {
  readonly annotationsNode: CstAnnotations | null;
}

export interface CstSubject extends AttributedElement<'subject'> {}

export interface CstNode extends AttributedElement<'node'> {}

export interface CstRelationship extends BaseNode<'relationship'> {
  readonly kindNode: CstRelationshipArrow;
  readonly leftNode: CstNode;
  readonly rightNode: CstNode | CstRelationship;
}

export interface CstRightArrow extends AttributedElement<'right_arrow'> {}
export interface CstLeftArrow extends AttributedElement<'left_arrow'> {}
export interface CstBidirectionalArrow
  extends AttributedElement<'bidirectional_arrow'> {}
export interface CstUndirectedArrow
  extends AttributedElement<'undirected_arrow'> {}

export interface CstAnnotations extends BaseNode<'annotations'> {}

export interface CstAnnotation extends BaseNode<'annotation'> {
  readonly keyNode: CstSymbol;
  readonly valueNode: CstValueNode;
}

export interface CstLabels extends BaseNode<'labels'> {}

export interface CstProperty extends BaseNode<'property'> {
  readonly keyNode: CstIdentifierNode;
  readonly valueNode: CstValueNode;
}

export interface CstRecord extends BaseNode<'record'> {}

export interface CstArray extends BaseNode<'array'> {}

export interface CstMap extends BaseNode<'map'> {}

export interface CstMapping extends BaseNode<'mapping'> {
  readonly keyNode: CstIdentifierNode;
  readonly valueNode: CstScalarValueNode;
}

export interface CstRange extends BaseNode<'range'> {
  readonly lowerNode: CstScalarValueNode | null;
  readonly upperNode: CstScalarValueNode | null;
}

export interface CstReference extends BaseNode<'reference'> {
  readonly identifierNode: CstIdentifierNode;
}

export interface CstSubPattern extends BaseNode<'sub_pattern'> {}

export interface CstBooleanLiteral extends BaseNode<'boolean_literal'> {}
export interface CstDecimal extends BaseNode<'decimal'> {}
export interface CstHexadecimal extends BaseNode<'hexadecimal'> {}
export interface CstInteger extends BaseNode<'integer'> {}
export interface CstMeasurement extends BaseNode<'measurement'> {}
export interface CstOctal extends BaseNode<'octal'> {}
export interface CstStringContent extends BaseNode<'string_content'> {}
export interface CstStringLiteral extends BaseNode<'string_literal'> {
  readonly contentNode: CstStringContent | null;
}
export interface CstTaggedString extends BaseNode<'tagged_string'> {
  readonly tagNode: CstSymbol | null;
  readonly contentNode: CstStringContent | null;
}
export interface CstSymbol extends BaseNode<'symbol'> {}
