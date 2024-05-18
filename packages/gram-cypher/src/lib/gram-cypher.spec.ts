import { cypherSyntax } from './gram-cypher';
import * as Gram from '@gram-data/sanity';

describe('cypherSyntax', () => {
  it('cypherSyntax of () is ()', () => {
    const cst = Gram.parse('()');
    const cypher = cypherSyntax(cst.rootNode);
    console.log(cypher);
    expect(cypher.cypher).toBe('()');
  });
});
