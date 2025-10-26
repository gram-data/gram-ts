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

export type CstValueNode = CstScalarValueNode | CstArray | CstMap;

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

export type CstGram = BaseNode<'gram'>;

export interface CstPattern extends BaseNode<'pattern'> {
  readonly annotationsNode: CstAnnotations | null;
}

export type CstSubject = AttributedElement<'subject'>;

export type CstNode = AttributedElement<'node'>;

export interface CstRelationship extends BaseNode<'relationship'> {
  readonly kindNode: CstRelationshipArrow;
  readonly leftNode: CstNode;
  readonly rightNode: CstNode | CstRelationship;
}

export type CstRightArrow = AttributedElement<'right_arrow'>;
export type CstLeftArrow = AttributedElement<'left_arrow'>;
export type CstBidirectionalArrow = AttributedElement<'bidirectional_arrow'>;
export type CstUndirectedArrow = AttributedElement<'undirected_arrow'>;

export type CstAnnotations = BaseNode<'annotations'>;

export interface CstAnnotation extends BaseNode<'annotation'> {
  readonly keyNode: CstSymbol;
  readonly valueNode: CstValueNode;
}

export type CstLabels = BaseNode<'labels'>;

export interface CstProperty extends BaseNode<'property'> {
  readonly keyNode: CstIdentifierNode;
  readonly valueNode: CstValueNode;
}

export type CstRecord = BaseNode<'record'>;

export type CstArray = BaseNode<'array'>;

export type CstMap = BaseNode<'map'>;

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

export type CstSubPattern = BaseNode<'sub_pattern'>;

export type CstBooleanLiteral = BaseNode<'boolean_literal'>;
export type CstDecimal = BaseNode<'decimal'>;
export type CstHexadecimal = BaseNode<'hexadecimal'>;
export type CstInteger = BaseNode<'integer'>;
export type CstMeasurement = BaseNode<'measurement'>;
export type CstOctal = BaseNode<'octal'>;
export type CstStringContent = BaseNode<'string_content'>;
export interface CstStringLiteral extends BaseNode<'string_literal'> {
  readonly contentNode: CstStringContent | null;
}
export interface CstTaggedString extends BaseNode<'tagged_string'> {
  readonly tagNode: CstSymbol | null;
  readonly contentNode: CstStringContent | null;
}
export type CstSymbol = BaseNode<'symbol'>;
