import * as BuildGram from './ast-builder';

describe('Builder: GramNode', () => {
  it('can be empty', () => {
    const n = BuildGram.node();
    expect(n.identifier).toBeUndefined();
    expect(n.labels).toEqual([]);
    expect(n.relation).toBeUndefined();
    expect(n.members).toEqual([]);
  });
  it('can be identified', () => {
    const n = BuildGram.node('a');
    expect(n.identifier).toBe('a');
    expect(n.labels).toEqual([]);
    expect(n.relation).toBeUndefined();
    expect(n.members).toEqual([]);
  });
  it('can be labled', () => {
    const n = BuildGram.node(undefined, ['A']);
    expect(n.identifier).toBeUndefined();
    expect(n.labels).toEqual(['A']);
    expect(n.relation).toBeUndefined();
    expect(n.members).toEqual([]);
  });
  it('can have a record', () => {
    const n = BuildGram.node(
      undefined,
      undefined,
      BuildGram.object({ k: 'v' })
    );
    console.log(n);
    expect(n.identifier).toBeUndefined();
    expect(n.labels).toEqual([]);
    expect(n.relation).toBeUndefined();
    // console.log(n.record)
    expect(n.record?.value['k']).toEqual({
      relation: ':',
      value: { type: 'string', value: 'v' },
    });
    expect(n.members).toEqual([]);
  });
});
