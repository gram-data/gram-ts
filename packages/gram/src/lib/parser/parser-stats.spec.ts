import * as Gram from './parser';
import type { GramStats } from './parser';

describe('Stats from CST', () => {
  it('should count nodes', () => {
    const parseTree = Gram.parse('(hello)');
    const gramStats = Gram.stats(parseTree.rootNode);
    expect(gramStats['node']).toBe(1);
  });
  it('should count nodes', () => {
    const parseTree = Gram.parse('(hello),(world)');
    const gramStats = Gram.stats(parseTree.rootNode);
    expect(gramStats['node']).toBe(2);
  });

  it('should count relationships', () => {
    const parseTree = Gram.parse('(hello)-->(world)');
    const gramStats = Gram.stats(parseTree.rootNode);
    expect(gramStats['single_right']).toBe(1);
    expect(gramStats['node']).toBe(2);
  });

  it('should count relationships', () => {
    const parseTree = Gram.parse(
      '(a)--(b)==(c)~~(d)-->(e)<--(f)==>(g)<==(h)~~>(i)<~~(j)'
    );
    const gramStats = Gram.stats(parseTree.rootNode);
    expect(gramStats).toEqual({
      node: 10,
      pattern: 1,
      relationship: 9,
      single_undirected: 1,
      single_right: 1,
      single_left: 1,
      double_undirected: 1,
      double_right: 1,
      double_left: 1,
      squiggle_undirected: 1,
      squiggle_right: 1,
      squiggle_left: 1,
    } as GramStats);
  });
});
