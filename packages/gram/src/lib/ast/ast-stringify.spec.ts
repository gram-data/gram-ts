import * as Build from './ast-builder';
import { GramRelation } from './ast-elements';
import * as Stringify from './ast-stringify';

describe('Stringify AST: GramNode', () => {
  it('can be empty', () => {
    const n = Build.node();
    const s = Stringify.stringify(n);
    // console.log(s);
    expect(s).toBe('()');
  });
  it('can be identified', () => {
    const n = Build.node('a');
    const s = Stringify.stringify(n);
    // console.log(s);
    expect(s).toBe('(a)');
  });
  it('can be labled', () => {
    const n = Build.node(undefined, ['A']);
    const s = Stringify.stringify(n);
    // console.log(s);
    expect(s).toBe('(:A)');
  });
  it('can have a record', () => {
    const n = Build.node(undefined, undefined, Build.object({ k: 'v' }));
    const s = Stringify.stringify(n);
    // console.log(s);
    expect(s).toBe('({k:"v"})');
  });
  it('can have an identifier, labels, and a record', () => {
    const n = Build.node('a', ['A'], Build.object({ k: 'v' }));
    const s = Stringify.stringify(n);
    // console.log(s);
    expect(s).toBe('(a:A {k:"v"})');
  });
});

describe('Stringify AST: anonymous pattern', () => {

  it('can have a single member', () => {
    const p = Build.pattern([Build.node('a')])
    const s = Stringify.stringify(p)
    // console.log(s);
    expect(s).toBe('[(a)]')
  })
  it('can be a pair, that is _not_ a relationship', () => {
    const p = Build.pattern([Build.node('a'), Build.node('b')])
    const s = Stringify.stringify(p)
    // console.log(s);
    expect(s).toBe('[(a),(b)]')
  })
  it('can be a list of 3 nodes', () => {
    const p = Build.pattern([Build.node('a'), Build.node('b'), Build.node('c')])
    const s = Stringify.stringify(p)
    // console.log(s);
    expect(s).toBe('[(a),(b),(c)]')
  })
  it('can be a list of a node followed by a relationship', () => {
    const p = Build.pattern([Build.node('a'), Build.relationship([Build.node('b'), Build.node('c')], GramRelation('--'))])
    const s = Stringify.stringify(p)
    // console.log(s);
    expect(s).toBe('[(a),(b)--(c)]')
  })
})

describe('Stringify AST: GramRelationship', () => {
  it('can be empty', () => {
    const r = Build.relationship(
      [Build.node(), Build.node()],
      GramRelation('-->'),
    );
    const s = Stringify.stringify(r);
    // console.log(s);
    expect(s).toBe('()-->()');
  });
  it('can have an identifier', () => {
    const r = Build.relationship(
      [Build.node(), Build.node()],
      GramRelation('-->'),
      'r'
    );
    const s = Stringify.stringify(r);
    // console.log(s);
    expect(s).toBe('()-[r]->()');
  });
  it('can have an identifier, using double-shaft', () => {
    const r = Build.relationship(
      [Build.node(), Build.node()],
      GramRelation('==>'),
      'r'
    );
    const s = Stringify.stringify(r);
    // console.log(s);
    expect(s).toBe('()=[r]=>()');
  });
  it('can have an identifier, using squiggle-shaft', () => {
    const r = Build.relationship(
      [Build.node(), Build.node()],
      GramRelation('~~>'),
      'r'
    );
    const s = Stringify.stringify(r);
    // console.log(s);
    expect(s).toBe('()~[r]~>()');
  });
  it('can have an identifier, labels, and a record', () => {
    const r = Build.relationship(
      [Build.node(), Build.node()],
      GramRelation('-->'),
      'r',
      ['R'],
      Build.object({ k: 'v' })
    );
    const s = Stringify.stringify(r);
    // console.log(s);
    expect(s).toBe('()-[r:R {k:"v"}]->()');
  });
});
