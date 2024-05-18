import { Brand } from "effect"

import { GramRecord } from "./ast-record"

export type GramSymbol = string & Brand.Brand<"GramSymbol">
export const GramSymbol = Brand.nominal<GramSymbol>()

export type GramIdentifier = string & Brand.Brand<"GramIdentifier">
export const GramIdentifier = Brand.nominal<GramIdentifier>()

export type GramRelation = 
  | "--" & Brand.Brand<"GramRelation">
  | "-->" & Brand.Brand<"GramRelation">
  | "<--" & Brand.Brand<"GramRelation">
  | "<-->" & Brand.Brand<"GramRelation">
  | "==" & Brand.Brand<"GramRelation">
  | "==>" & Brand.Brand<"GramRelation">
  | "<==" & Brand.Brand<"GramRelation">
  | "<==>" & Brand.Brand<"GramRelation">
  | "~~" & Brand.Brand<"GramRelation">
  | "~~>" & Brand.Brand<"GramRelation">
  | "<~~" & Brand.Brand<"GramRelation">
  | "<~~>" & Brand.Brand<"GramRelation">

export const GramRelation = Brand.nominal<GramRelation>()

export interface GramPattern {
  readonly identifier?: GramIdentifier | undefined
  readonly labels: ReadonlyArray<GramSymbol>
  readonly record?: GramRecord | undefined
  readonly relation?: GramRelation | undefined
  readonly members: ReadonlyArray<GramPattern>
}

/**
 * A node is a special pattern with no members.
 */
export interface GramNode extends GramPattern {
  readonly members: never[]
}

export const isGramNode = (pattern: GramPattern): pattern is GramNode => (pattern.members.length === 0)

/**
 * An annotation is a special pattern with exactly one member,
 * which may be any other pattern.
 */
export interface GramAnnotation extends GramPattern {
  readonly members: [GramPattern]
}

/**
 * A pair is a special pattern with exactly two members,
 * which may be any other pattern.
 */
export interface GramPair extends GramPattern {
  readonly members: [GramPattern, GramPattern]
}

/**
 * A relationship is a special pattern with exactly two members
 * that are both nodes.
 */
export interface GramRelationship extends GramPair {
  readonly members: [GramNode, GramNode]
}

export const isGramRelationship = (pattern: GramPattern): pattern is GramRelationship => (pattern.members.length === 2) && pattern.members.every(isGramNode)