import { loadPositiveCases } from './corpus-loader';
import { parse } from './parser';
import { stringifyCst } from './cst-stringify';

describe('tree-sitter corpus (success cases)', () => {
  const cases = loadPositiveCases();

  it('loads corpus fixtures', () => {
    expect(cases.length).toBeGreaterThan(0);
  });

  for (const testCase of cases) {
    it(`${testCase.file} :: ${testCase.title}`, () => {
      const tree = parse(testCase.source);
      expect(tree.rootNode.hasError).toBe(false);
      expect(testCase.expected).toBeDefined();
      const expected = testCase.expected ?? '';
      const actual = stringifyCst(tree.rootNode, {
        includeRanges: false,
        includeFields: false,
      });
      expect(tokenize(actual)).toEqual(tokenize(expected));
    });
  }
});

const tokenize = (value: string): string[] =>
  (value.match(/\(|\)|[^\s()]+/g) ?? []).filter(
    (token) => !token.endsWith(':'),
  );
