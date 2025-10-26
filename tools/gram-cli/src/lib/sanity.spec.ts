import { Parser } from 'gram';

describe('gram-cli', () => {
  it('should merge () as MERGE ()', () => {
    const cst = Parser.parse('()');
    expect(cst.rootNode.type).toBe('gram');
  });
});
