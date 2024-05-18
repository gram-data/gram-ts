import * as Pattern from "./pattern";

describe("Patterns of objects", () => {
  it("should start with a single object", () => {
    const o = { k: "v" }
    const g = Pattern.of(o);
    expect(g.value.k).toEqual("v")
    expect(Pattern.value(g).k).toEqual("v")
    expect(Pattern.members(g)).toBeDefined()
    expect(Pattern.members(g).length).toBe(0)
  })
  it("should compose two objects together", () => {
    const o1 = Pattern.of({k:"v1"})
    const o2 = Pattern.of({k:"v2"})
    const o1o2 = Pattern.combine([o1,o2])
    const members = Pattern.members(o1o2)
    expect(Pattern.value(members[0])?.k).toEqual("v1")
    expect(Pattern.value(members[1])?.k).toEqual("v2")
  })
})