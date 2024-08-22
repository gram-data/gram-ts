import * as Gram from 'gram';

describe('gram-cli', () => {
  it('should merge () as MERGE ()', () => {
    const cst = Gram.parse('()');
    expect(cst.rootNode.type).toBe('gram');
  });
});
