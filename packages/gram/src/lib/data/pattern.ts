import { pipe } from 'effect';
import { some, none} from 'effect/Option'
import type { Option } from 'effect/Option'

import { dual } from 'effect/Function';

export interface Pattern<V> {
  value: V;
  members: Pattern<V>[];
}

export const value = <V>(p: Pattern<V>): V => p.value;

export const left = <V>(p: Pattern<V>): Option<Pattern<V>> => (p.members.length > 0) ? some(p.members[0]) : none()
export const right = <V>(p: Pattern<V>): Option<Pattern<V>> => (p.members.length > 1) ? some(p.members[1]) : none()

export const members = <V>(p: Pattern<V>): Pattern<V>[] => p.members;

////////////////////////////////////////
// Pattern construction

export const make = <V>(value: V, members: Pattern<V>[]): Pattern<V> => ({
  value,
  members,
});

/**
 * Construct a pattern from a value, with no members patterns.
 */
export const of = <V>(value: V): Pattern<V> => make(value, []);

/**
 * Combine patterns together into members of an anonymous pattern.
 */
export const combine = <V>(members: Pattern<V>[]) => make(undefined, members);

/**
 * The smallest pattern is empty, with no value and no member patterns. 
 * 
 * This is a great choice for initializing the accumulator for reduce(). 
 */
export const empty = () => make(undefined, []);

/**
 * Nodes have value but no member patterns.
 * 
 * (alias for `of()`)
 */
export const node = of;

/**
 * Annotations have a single member pattern. 
 * 
 * Think of them as providing extra information about another pattern.
 * You could use this to provide position and styling of a base graph
 * when visualizing. Or, attach annotations to empty nodes to create
 * an Entity-Component-System.
 */
export const annotation = <V>(value: V, member: Pattern<V>) =>
  make(value, [member]);

/**
 * An ordered pair of two member paths, without any information about the pairing.
 * 
 * A classic graph is formed from a set of node patterns with a set of pairs.
 */
export const pair = <V>(left:Pattern<V>, right:Pattern<V>) => make(null, [left,right])

/**
 * A relationship is a pair of member paths that includes information about the pairing.
 * When the members are both nodes, a relationship creates a connected graph.
 * 
 * The relationship can enrich a classic graph with new features:
 * - directionality: from a node, to another node
 * - weight: a value on the from/to pair
 * - labeling: to distinguish sets of relationship "types" or "roles"
 * - information: rich key/value properties attached that describe the relationship
 */
export const relationship = <V>(value: V, left: Pattern<V>, right: Pattern<V>) =>
  make(value, [left, right]);

export const pattern = make;

export const append = <V>(p: Pattern<V>, member: Pattern<V>) =>
  make(value(p), [...members(p), member]);

////////////////////////////////////////
// Pattern functions

const _reduce = <A, B>(fa: Pattern<A>, acc: B, f: (acc: B, a: A) => B): B => {
  let r: B = f(acc, fa.value);
  const len = fa.members.length;
  for (let i = 0; i < len; i++) {
    r = _reduce(fa.members[i], r, f);
  }
  return r;
};

export const reduce: {
  <A, B>(b: B, f: (b: B, a: A) => B): (self: Pattern<A>) => B;
  <A, B>(self: Pattern<A>, b: B, f: (b: B, a: A) => B): B;
} = dual(3, _reduce);

const _map = <A, B>(fa: Pattern<A>, f: (a: A) => B): Pattern<B> => {
  return make(
    f(fa.value),
    fa.members.map((m) => _map(m, f))
  );
};

export const map: {
  <A, B>(f: (a: A) => B): (self: Pattern<A>) => Pattern<B>;
  <A, B>(self: Pattern<A>, f: (a: A) => B): Pattern<B>;
} = dual(2, _map);


////////////////////////////////////////
// Pattern construction utilites

export const fromPair = <V>(left:V, right:V) => pair(of(left), of(right))

export const fromArray = <V>(xs:V[]) => combine(xs.map(of))

/**
 * Constructs an annotation with members derived from an array of values.
 */
export const annotateArray = <V>(ann:V, xs:V[]) => make(ann, xs.map(of))


/**
 * Constructs an annotation with a single member pattern.
 */
export const annotateValue = <V>(ann:V, o:V) => make(ann, [of(o)])

/**
 * Construct a relationship from a pair of values and a relation value.
 * 
 */
export const relatePair = <V>(relation:V, left:V, right:V) => relationship(relation, of(left), of(right))