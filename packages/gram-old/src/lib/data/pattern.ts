import { pipe } from 'effect';
import { dual } from 'effect/Function';

export interface Pattern<V> {
  value: V;
  members: Pattern<V>[];
}

export const value = <V>(p: Pattern<V>): V => p.value;

export const members = <V>(p: Pattern<V>): Pattern<V>[] => p.members;

////////////////////////////////////////
// Pattern construction

export const make = <V>(value: V, members: Pattern<V>[]): Pattern<V> => ({
  value,
  members,
});

export const of = <V>(value: V): Pattern<V> => make(value, []);

export const combine = <V>(members: Pattern<V>[]) => make(null, members);

export const empty = () => make(null, []);

export const node = of;

export const annotation = <V>(value: V, member: Pattern<V>) =>
  make(value, [member]);

export const relationship = <V>(value: V, members: [Pattern<V>, Pattern<V>]) =>
  make(value, members);

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
