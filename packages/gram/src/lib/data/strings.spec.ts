import { make, of } from "."

describe("Patterns of strings", () => {
  it("should start with a single string", () => {
  const a = of("a")

  })
  it("should compose two strings", () => {
    const a = of("hello")  
    const b = of("world")
    const helloWorld = make("message", [a,b])

  })
  
})