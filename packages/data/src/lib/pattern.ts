import { Eq } from 'fp-ts/Eq';
import { Magma } from 'fp-ts/Magma';
import { Monoid } from 'fp-ts/Monoid';
import { Semigroup } from 'fp-ts/Semigroup';

export interface Pattern<V> {
  value: V;
  members: Pattern<V>[];
}

export const make = <A>(value: A, members: Pattern<A>[]): Pattern<A> => ({
  value,
  members,
});

export const extract = <A>(wa: Pattern<A>) => wa.value;

export const of = <A>(a: A) => make(a, []);


export const getEqual = <A>(E: Eq<A>): Eq<Pattern<A>> => ({
  equals: (x: Pattern<A>, y: Pattern<A>) => E.equals(x.value, y.value),
});

export const nullish = <A>() =>
  ({
    concat: (x: A | null, y: A | null) => {
      void x;
      void y;
      return null;
    }, // Magma & Semigroup
    empty: null, // Monoid
  }) as Magma<A | null> & Semigroup<A | null> & Monoid<A | null>;

/////////////////////////////////////////////
// TBD...

export const magmaPatterns = <A>(MA: Magma<A>): Magma<Pattern<A>> => ({
  concat: (x, y) => make(MA.concat(extract(x), extract(y)), [x, y]),
});

export const semigroupPatterns = <A>(
  SG: Semigroup<A>,
): Semigroup<Pattern<A>> => ({
  ...magmaPatterns(SG),
});

export const monoidPatterns = <A>(M: Monoid<A>): Monoid<Pattern<A>> => ({
  ...semigroupPatterns(M),
  empty: of(M.empty),
});

export const magmaFlatPatterns = <A>() => magmaPatterns(nullish<A>());

export const semigroupFlatPatterns = <A>() => ({
  ...magmaFlatPatterns(),
}) as Semigroup<Pattern<A | null>>;

// export const monoidPatterns = <A>(M:Monoid<A>) => ({
//   ...semigroupFlatPatterns(M),
//   empty: M.empty
// }) as Monoid<Pattern<A>>
