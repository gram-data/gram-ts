import * as Pattern from './pattern';

describe('Pattern construction', () => {
  it('should create a pattern from an array', () => {
    const p = Pattern.fromArray([1,2,3]);
    expect(Pattern.value(p)).toBeUndefined();
    expect(Pattern.value(p.members[0])).toBe(1);
    expect(Pattern.value(p.members[1])).toBe(2);
    expect(Pattern.value(p.members[2])).toBe(3);
  });

  it('should create a pattern annotation from an array', () => {
    const p = Pattern.annotateArray(0, [1,2,3]);
    expect(Pattern.value(p)).toBe(0);
    expect(Pattern.value(p.members[0])).toBe(1);
  })

  it('should create an annotation from a value,target pair', () => {
    const p = Pattern.annotateValue(0, 1);
    expect(Pattern.value(p)).toBe(0);
    expect(Pattern.value(p.members[0])).toBe(1);
  })
});
