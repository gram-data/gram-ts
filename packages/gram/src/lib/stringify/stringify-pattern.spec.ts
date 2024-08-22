import * as Pattern from '../data/pattern';
import * as AST from '../ast';
import * as Stringify from '.';

describe('Stringify Pattern: anonymous lists', () => {
  it('should treat an empty pattern as an anonymous node', () => {
    // const pat = Pattern.of(undefined);
    const pat = Pattern.empty();
    const ast = AST.node(Stringify.stringify(Pattern.value(pat)))
    const str = AST.stringify(ast)
    console.log(str);
    expect(str).toEqual("()");
  });
  it('should treat pairs as 2-tuples', () => {
    const pat = Pattern.pair(Pattern.of(1), Pattern.of(2))
    const from = AST.node(Stringify.stringify(Pattern.value(pat.members[0])))
    const to = AST.node(Stringify.stringify(Pattern.value(pat.members[1])))
    const ast = AST.pattern([from, to]) 
    const str = AST.stringify(ast)
    console.log(str);
    expect(str).toEqual("[(1),(2)]");
  });
  
});
