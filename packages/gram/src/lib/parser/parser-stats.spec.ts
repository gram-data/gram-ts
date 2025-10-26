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
    expect(gramStats['right_arrow']).toBe(1);
    expect(gramStats['node']).toBe(2);
    expect(gramStats['symbol']).toBe(2);
  });

  it('should count relationships', () => {
    const parseTree = Gram.parse(
      '(a)--(b)==(c)~~(d)-->(e)<--(f)==>(g)<==(h)~~>(i)<~~(j)',
    );
    const gramStats = Gram.stats(parseTree.rootNode);
    expect(gramStats).toEqual({
      node: 10,
      pattern: 1,
      relationship: 9,
      undirected_arrow: 3,
      right_arrow: 3,
      left_arrow: 3,
      symbol: 10,
    } as GramStats);
  });
});
