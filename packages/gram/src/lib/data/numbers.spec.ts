import * as Pattern from "./pattern"

describe("Patterns of numbers", () => {
  it("should start with a single number", () => {
    const a = Pattern.of(1);
    expect(Pattern.value(a)).toEqual(1);
  })
  it("should combine two numbers", () => {
    const a = Pattern.of(1)  // a=(1)
    const b = Pattern.of(2)  // b=(2)
    const ab = Pattern.combine([a,b]); // ab=[(1),(2)]

    expect(Pattern.value(ab)).toBeNull() // <V> is <number | null>
    expect(Pattern.members(ab).length).toBe(2)
    
    const [one, two] = Pattern.members(ab);
    expect(Pattern.value(one)).toEqual(1);
    expect(Pattern.value(two)).toEqual(2);
  })

  it("should reduce a pattern of numbers", () => {
    const p = Pattern.make(1, [Pattern.of(2),Pattern.of(3)]); // p=[1 (2),(3)]
    const sum = Pattern.reduce(p, 0, (acc, a) => acc + a) 
    expect(sum).toEqual(6)
  })

  it("should map a pattern of numbers", () => {
    const p = Pattern.make(1, [Pattern.of(2),Pattern.of(3)]); // p=[1 (2),(3)]
    const pn = Pattern.map(p, (a) => a + 1)
    expect(Pattern.value(pn)).toEqual(2)
    const sum = Pattern.reduce(pn, 0, (acc, a) => acc + a) 
    expect(sum).toEqual(9)
  })
})