import type { SyntaxNode } from 'tree-sitter';
import { loadErrorCases, type CorpusCase } from './corpus-loader';
import { parse } from './parser';

const cases = loadErrorCases();
const describeWithCorpus =
  cases.length > 0 ? describe : describe.skip;

describeWithCorpus('tree-sitter corpus (error cases)', () => {
  it('loads error corpus fixtures', () => {
    expect(cases.length).toBeGreaterThan(0);
  });

  for (const testCase of cases) {
    it(`${testCase.file} :: ${testCase.title}`, () => {
      const tree = parse(testCase.source);
      expect(tree.rootNode.hasError).toBe(true);

      const errorNodes = collectErrorNodes(
        tree.rootNode as unknown as SyntaxNode,
      );
      expect(errorNodes.length).toBeGreaterThan(0);

      for (const errorNode of errorNodes) {
        const diagnostic = formatErrorDiagnostic(errorNode, testCase);
        expect(diagnostic.summary).toMatch(/line \d+, column \d+/u);
        expect(diagnostic.summary).toContain(testCase.file);
        expect(diagnostic.pointerLine.trim()).toBe('^');
        const sourceLines = testCase.source.split(/\r?\n/u);
        expect(diagnostic.sourceLine).toBe(
          sourceLines[diagnostic.line - 1] ?? '',
        );
      }
    });
  }
});

const collectErrorNodes = (root: SyntaxNode): SyntaxNode[] => {
  const pending: SyntaxNode[] = [root];
  const errors: SyntaxNode[] = [];

  while (pending.length > 0) {
    const node = pending.pop();
    if (!node) {
      continue;
    }
    const isMissing = Boolean((node as { isMissing?: boolean }).isMissing);
    if (node.type === 'ERROR' || isMissing) {
      errors.push(node);
    }
    for (let i = 0; i < node.childCount; i += 1) {
      const child = node.child(i);
      if (child) {
        pending.push(child);
      }
    }
  }

  return errors;
};

interface ErrorDiagnostic {
  summary: string;
  sourceLine: string;
  line: number;
  pointerLine: string;
}

const formatErrorDiagnostic = (
  errorNode: SyntaxNode,
  testCase: CorpusCase,
): ErrorDiagnostic => {
  const { row, column } = errorNode.startPosition;
  const sourceLines = testCase.source.split(/\r?\n/u);
  const lineText = sourceLines[row] ?? '';
  const pointerLine = `${' '.repeat(column)}^`;

  const isMissing = Boolean((errorNode as { isMissing?: boolean }).isMissing);
  const snippet = sanitizeSnippet(errorNode.text);
  const descriptor = isMissing
    ? `expected ${errorNode.type}`
    : snippet.length > 0
      ? `unexpected "${snippet}"`
      : 'unexpected end of input';

  return {
    summary: `${testCase.file} :: ${testCase.title} (case #${
      testCase.index + 1
    }) - line ${row + 1}, column ${column + 1}: ${descriptor}`,
    sourceLine: lineText,
    line: row + 1,
    pointerLine,
  };
};

const sanitizeSnippet = (value: string): string => {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return '';
  }
  return trimmed.replace(/\s+/gu, ' ').slice(0, 40);
};
