import * as Pattern from "./pattern"

describe("Patterns of numbers", () => {
  it("should start with a single number", () => {
    const a = Pattern.of(1);
    expect(Pattern.value(a)).toEqual(1);
  })
  it("should combine two numbers", () => {
    const a = Pattern.of(1)  // a=(1)
    const b = Pattern.of(2)  // b=(2)
    const ab = Pattern.combine([a,b]); // helloWorld=[(1),(2)]

    expect(Pattern.value(ab)).toBeNull() // <V> is <number | null>
    expect(Pattern.members(ab).length).toBe(2)
    
    const [one, two] = Pattern.members(ab);
    expect(Pattern.value(one)).toEqual(1);
    expect(Pattern.value(two)).toEqual(2);

    const sum = Pattern.reduce(ab, 0, (acc, a) => acc + (a ?? 0) ) // nullish coallesce to avoid NaN
    expect(sum).toEqual(3)
  })
  
})