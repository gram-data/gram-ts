
import * as Instances from './number';

describe('Number instances', () => {
  it('Magma adding', () => {
    const x = 1;
    const y = 2;

    const concat = Instances.addNumbers.concat
    const result = concat(x,y);
    expect(result).toEqual(3)
    expect(Instances.equalNumbers.equals(result, 3)).toBeTruthy();
  });
  it('Semigroup add with associativity', () => {
    // concat(x, concat(y, z)) === concat(concat(x, y), z)
    const input = [1,2,3];
    const concat = Instances.semigroupAddNumber.concat;
    const left = concat(input[0], concat(input[1], input[2]))
    const right = concat(concat(input[0], input[1]), input[2])
    expect (left).toEqual(right);
  })
  it('Monoid add with emptiness', () => {
    // concat(x, empty) === concat(empty, x)
    const x = 2;
    const M = Instances.monoidAddNumbers;
    const left = M.concat(x, M.empty)
    const right = M.concat(M.empty, x);
    expect (left).toEqual(right);
  })
})
