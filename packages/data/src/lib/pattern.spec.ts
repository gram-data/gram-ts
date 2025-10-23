
import * as Pattern from './pattern';
import * as N from 'fp-ts/number';

describe('Patterns', () => {
  it('Eq', () => {
    const x = Pattern.of(1);
    const y = Pattern.of(1);
    const E = Pattern.getEqual(N.Eq)
    expect(E.equals(x,y)).toBeTruthy();
  });

  it('Semigroup add with associativity', () => {
    // concat(x, concat(y, z)) === concat(concat(x, y), z)
    const input = [1,2,3];
    const concat = Pattern.semigroupPatterns.concat;
    const left = concat(input[0], concat(input[1], input[2]))
    const right = concat(concat(input[0], input[1]), input[2])
    expect (left).toEqual(right);
  })
  it('Monoid add with emptiness', () => {
    // concat(x, empty) === concat(empty, x)
    const x = 2;
    const M = Pattern.monoidPatterns;
    const left = M.concat(x, M.empty)
    const right = M.concat(M.empty, x);
    expect (left).toEqual(right);
  })
})
