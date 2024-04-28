import { GramSyntaxNode, parse, stats } from "./parser";

describe("gram parsed CST", () => {
  it("stats should count nodes", () => {
    const parseTree = parse("(hello)");
    const gramStats = stats(parseTree.rootNode as GramSyntaxNode);
    expect(gramStats["node"]).toBe(1);
  });
  it("stats should count nodes", () => {
    const parseTree = parse("(hello),(world)");
    const gramStats = stats(parseTree.rootNode as GramSyntaxNode);
    expect(gramStats["node"]).toBe(2);
  });

  it("stats should count relationships", () => {
    const parseTree = parse("(hello)-->(world)");
    const gramStats = stats(parseTree.rootNode as GramSyntaxNode);
    expect(gramStats["single_arrow_right"]).toBe(1);
    expect(gramStats["node"]).toBe(2);
  });

  it("stats should count relationships", () => {
    const parseTree = parse("(a)--(b)==(c)~~(d)-->(e)<--(f)==>(g)<==(h)~~>(i)<~~(j)");
    const gramStats = stats(parseTree.rootNode as GramSyntaxNode);
    expect(gramStats["undirected_single"]).toBe(1);
    expect(gramStats["undirected_double_arrow"]).toBe(1);
    expect(gramStats["undirected_squiggle"]).toBe(1);
    expect(gramStats["single_arrow_right"]).toBe(1);
    expect(gramStats["single_arrow_left"]).toBe(1);
    expect(gramStats["double_arrow_right"]).toBe(1);
    expect(gramStats["double_arrow_left"]).toBe(1);
    expect(gramStats["squiggle_arrow_right"]).toBe(1);
    expect(gramStats["squiggle_arrow_left"]).toBe(1);
    expect(gramStats["node"]).toBe(10);
  });
})