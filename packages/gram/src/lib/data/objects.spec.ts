import {of, make, value} from ".";

describe("Patterns of objects", () => {
  it("should start with a single object", () => {
    const o = { k: "v" }
    const g = of(o);
    expect(g.value.k).toEqual("v")
    expect(value(g).k).toEqual("v")
    expect(g.members).toBeDefined()
    expect(g.members.length).toBe(0)
  })
  it("should compose two objects together", () => {
    const o1 = of({k:"v1"})
    const o2 = of({k:"v2"})
    const o1o2 = make({k:"e1"}, [o1,o2])
    expect(o1o2.members[0].value.k).toEqual("v1")
    expect(o1o2.members[1].value.k).toEqual("v2")
  })
})