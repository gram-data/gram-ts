import { parse } from './parser';
import { stringifyCst } from './cst-stringify';

describe('cst stringify', () => {
  it('matches tree-sitter CLI output for a basic relationship', () => {
    const tree = parse('()-->()');
    const output = stringifyCst(tree.rootNode);
    const expected = [
      '(gram [0, 0] - [0, 7]',
      '  (pattern [0, 0] - [0, 7]',
      '    elements: (relationship [0, 0] - [0, 7]',
      '      left: (node [0, 0] - [0, 2])',
      '      kind: (right_arrow [0, 2] - [0, 5])',
      '      right: (node [0, 5] - [0, 7]))))',
    ].join('\n');
    expect(output).toBe(expected);
  });

  it('normalises arrow variants into a single right_arrow node', () => {
    const tree = parse('()~~>()');
    const output = stringifyCst(tree.rootNode);
    const expected = [
      '(gram [0, 0] - [0, 7]',
      '  (pattern [0, 0] - [0, 7]',
      '    elements: (relationship [0, 0] - [0, 7]',
      '      left: (node [0, 0] - [0, 2])',
      '      kind: (right_arrow [0, 2] - [0, 5])',
      '      right: (node [0, 5] - [0, 7]))))',
    ].join('\n');
    expect(output).toBe(expected);
  });

  it('can omit range metadata when requested', () => {
    const tree = parse('()-->()');
    const output = stringifyCst(tree.rootNode, { includeRanges: false });
    const expected = [
      '(gram',
      '  (pattern',
      '    elements: (relationship',
      '      left: (node)',
      '      kind: (right_arrow)',
      '      right: (node))))',
    ].join('\n');
    expect(output).toBe(expected);
  });

  it('can suppress field names for corpus comparisons', () => {
    const tree = parse('{ count: [1,2,3] }');
    const output = stringifyCst(tree.rootNode, {
      includeRanges: false,
      includeFields: false,
    });
    expect(output.replace(/\s+/g, ' ').trim()).toBe(
      '(gram (record (property (symbol) (array (integer) (integer) (integer)))))',
    );
  });
});
