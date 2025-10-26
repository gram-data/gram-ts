
import * as N from 'fp-ts/number';
import * as Pattern from './pattern';

describe('Patterns', () => {
  it('Eq', () => {
    const x = Pattern.of(1);
    const y = Pattern.of(1);
    const E = Pattern.getEqual(N.Eq);
    expect(E.equals(x, y)).toBeTruthy();
  });

  it('Semigroup add with associativity', () => {
    const semigroup = Pattern.semigroupPatterns(N.SemigroupSum);
    const a = Pattern.of(1);
    const b = Pattern.of(2);
    const c = Pattern.of(3);

    const left = semigroup.concat(a, semigroup.concat(b, c));
    const right = semigroup.concat(semigroup.concat(a, b), c);

    expect(left.value).toEqual(right.value);
    expect(left.members).toHaveLength(2);
  });

  it('Monoid add with emptiness', () => {
    const monoid = Pattern.monoidPatterns(N.MonoidSum);
    const pattern = Pattern.of(2);

    const left = monoid.concat(pattern, monoid.empty);
    const right = monoid.concat(monoid.empty, pattern);

    const equals = Pattern.getEqual(N.Eq);
    expect(equals.equals(left, right)).toBe(true);
  });
});
