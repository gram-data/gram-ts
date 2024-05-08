import * as Pattern from "./pattern";
import * as Subject from "./subject";

describe("Patterns of Subjects", () => {
  it("should start with a single subject", () => {
    const personA = Subject.of({ identifier: "a", labels: ["Person"], record: {}})
    const g = Pattern.of(personA);
    expect(Pattern.value(g).identifier).toEqual("a")
    expect(Pattern.value(g).labels).toEqual(["Person"])
    expect(Pattern.members(g)).toBeDefined()
    expect(Pattern.members(g).length).toBe(0)
  })
  it("should compare two subjects by value equality", () => {
    const personA1 = Subject.of({ identifier: "a", labels: ["Person"], record: {} })
    const personA2 = Subject.of({ identifier: "a", labels: ["Person"], record: {} })
    expect(Subject.equals(personA1, personA2)).toBe(true)
  })
  it("should construct a subject from an object", () => {
    const o = { name: "ABK", height: 185 };
    const s = Subject.fromObject(o);
    expect(s.record.name).toEqual("ABK")
    expect(s.record.height).toEqual(185)
    expect(s.identifier).toBeNull()
    expect(s.labels.length).toBe(0)
  })
})