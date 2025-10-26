import { Parser } from 'gram';
import { cypherSyntax } from './gram-cypher';

describe('cypherSyntax', () => {
  it('cypherSyntax of () is ()', () => {
    const cst = Parser.parse('()');
    const cypher = cypherSyntax(cst.rootNode);
    expect(cypher.cypher).toBe('()');
  });
});
