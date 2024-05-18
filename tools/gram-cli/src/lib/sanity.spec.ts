
import * as Gram from '@gram-data/sanity';

describe('gram-cli', () => {
  it('should merge () as MERGE ()', () => {
    const cst = Gram.parse('()');
    expect(cst.rootNode.type).toBe('gram');
  });
});
