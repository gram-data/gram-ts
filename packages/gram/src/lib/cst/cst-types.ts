/* eslint-disable @typescript-eslint/no-empty-interface */
import * as S from "@effect/schema/Schema"

import { SyntaxNode } from "tree-sitter"

export interface CstSyntax {
  readonly id: number
  readonly typeId: number
  readonly grammarId: number
  readonly type: string
  readonly grammarType: string
  readonly text: string
  readonly fields: ReadonlyArray<string>
  readonly children: ReadonlyArray<CstSyntax>
}

export const CstSyntax = S.Struct({
  id: S.Number,
  typeId: S.Number,
  grammarId: S.Number,
  type: S.String,
  grammarType: S.String,
  text: S.String,
  fields: S.Array(S.String),
})

const CstIdentifier = S.Struct({
  ...CstSyntax.fields,
  types: S.Array(S.Struct({
    type: S.Literal("backticked_string", "decimal", "double_quoted_string", "hexadecimal", "integer", "measurement", "octal", "single_quoted_string", "symbol", "tagged_string"),
    named: S.Boolean
  }))
})
export interface CstIdentifier extends S.Schema.Type<typeof CstIdentifier> {}

const CstLabels = S.Struct({
  ...CstSyntax.fields,
  namedChildren: S.Array(CstIdentifier)
})
export interface CstLabels extends S.Schema.Type<typeof CstLabels> {}

// Utility schema for attribute fields
export const CstAttributes = S.Struct({
  ...CstSyntax.fields,
  identifierNode: S.optional(CstSyntax),
  labelsNode: S.optional(CstLabels),
})

export const CstProperty = S.Struct({
  ...CstSyntax.fields,
  type: S.Literal("value_pair"),
  keyNode: CstIdentifier,
  valueNode: CstAttributes
})
export interface CstProperty extends S.Schema.Type<typeof CstProperty> {}

const CstRecord = S.Struct({
  ...CstSyntax.fields,
  namedChildren: S.Array(CstProperty)
})
export interface CstRecord extends S.Schema.Type<typeof CstRecord> {}


export const CstNode = S.Struct({
  ...CstAttributes.fields,
})
export type CstNode = S.Schema.Type<typeof CstNode>


// CstSingleRelationship(s)
export const CstSingleRelationship = S.Struct({
  named: S.Boolean,
  fields: S.Struct({
    identifier: CstIdentifier,
    labels: CstLabels,
    record: CstRecord
  })
})

// CstDoubleRelationship(s)
export const CstDoubleRelationship = S.Struct({
  named: S.Boolean,
  fields: S.Struct({
    identifier: CstIdentifier,
    labels: CstLabels,
    record: CstRecord
  })
})

// CstSquiggleRelationship(s)
export const CstSquiggleRelationship = S.Struct({
  named: S.Boolean,
  fields: S.Struct({
    identifier: CstIdentifier,
    labels: CstLabels,
    record: CstRecord
  })
})

export const CstRelationshipValueUnion = S.Union(
  CstSingleRelationship.pipe(S.attachPropertySignature("type", "single_undirected")),
  CstDoubleRelationship.pipe(S.attachPropertySignature("type", "double_undirected")),
  CstSquiggleRelationship.pipe(S.attachPropertySignature("type", "squiggle_undirected")),
)

export const CstRelationshipValue = S.Struct({
  ...CstAttributes.fields,
})

export const CstRelationship = S.Struct({
  ...CstSyntax.fields,
  leftNode: CstNode,
  rightNode: S.Union(CstNode),
  valueNode: CstRelationshipValue
})
export type CstRelationship = S.Schema.Type<typeof CstRelationship>
