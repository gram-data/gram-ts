import { loadErrorCases } from './corpus-loader';
import { parse } from './parser';

describe('tree-sitter corpus (error cases)', () => {
  const cases = loadErrorCases();

  it('loads error corpus fixtures', () => {
    expect(cases.length).toBeGreaterThan(0);
  });

  for (const testCase of cases) {
    it(`${testCase.file} :: ${testCase.title}`, () => {
      const tree = parse(testCase.source);
      expect(tree.rootNode.hasError).toBe(true);
    });
  }
});
