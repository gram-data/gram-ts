import { GramSyntaxNode, parse, stats, GramStats } from "./parser";

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
    expect(gramStats["single_right"]).toBe(1);
    expect(gramStats["node"]).toBe(2);
  });

  it("stats should count relationships", () => {
    const parseTree = parse("(a)--(b)==(c)~~(d)-->(e)<--(f)==>(g)<==(h)~~>(i)<~~(j)");
    const gramStats = stats(parseTree.rootNode as GramSyntaxNode);
    expect(gramStats).toEqual({
      node: 10,
      single_undirected: 1,
      single_right: 1,
      single_left: 1,
      double_undirected: 1,
      double_right: 1,
      double_left: 1,
      squiggle_undirected: 1,
      squiggle_right: 1,
      squiggle_left: 1
    } as GramStats);
  });
})