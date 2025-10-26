import fs from 'node:fs';
import path from 'node:path';

export interface CorpusCase {
  readonly file: string;
  readonly title: string;
  readonly index: number;
  readonly source: string;
  readonly expected?: string;
  readonly isError: boolean;
}

export interface LoadCorpusOptions {
  /**
   * Root directory containing tree-sitter corpus `.txt` fixtures.
   * Defaults to `GRAM_CORPUS_ROOT` env value or the repository's
   * `tree-sitter-gram/test/corpus` folder.
   */
  root?: string;
}

const HEADER_DELIMITER = '==================';
const BLOCK_PATTERN =
  /==================\n([^=\n]+)\n(?:(:error)\n)?==================\n\n([\s\S]*?)\n---\n\n([\s\S]*?)(?=\n==================|\s*$)/g;

export const loadCorpusCases = (
  options: LoadCorpusOptions = {}
): CorpusCase[] => {
  const root = resolveCorpusRoot(options.root);
  const files = fs
    .readdirSync(root)
    .filter((file) => file.endsWith('.txt'))
    .sort();

  const cases: CorpusCase[] = [];

  for (const file of files) {
    const absolutePath = path.join(root, file);
    const content = fs.readFileSync(absolutePath, 'utf8');
    let match: RegExpExecArray | null;
    let index = 0;

    while ((match = BLOCK_PATTERN.exec(content)) !== null) {
      const [, title, errorFlag, sourceRaw, expectedRaw] = match;
      const source = trimTrailingNewlines(sourceRaw);
      const expected = trimTrailingNewlines(expectedRaw);
      cases.push({
        file,
        title: title.trim(),
        index,
        source,
        expected: expected.length > 0 ? expected : undefined,
        isError: Boolean(errorFlag),
      });
      index += 1;
    }
  }

  return cases;
};

export const loadPositiveCases = (options?: LoadCorpusOptions): CorpusCase[] =>
  loadCorpusCases(options).filter((c) => !c.isError);

export const loadErrorCases = (options?: LoadCorpusOptions): CorpusCase[] =>
  loadCorpusCases(options).filter((c) => c.isError);

const trimTrailingNewlines = (value: string): string =>
  value.replace(/\s+$/u, '').replace(/\r\n/g, '\n');

const resolveCorpusRoot = (override?: string): string => {
  if (override) {
    return override;
  }
  if (process.env.GRAM_CORPUS_ROOT) {
    return process.env.GRAM_CORPUS_ROOT;
  }
  return path.resolve(
    __dirname,
    '../../../../../tree-sitter-gram/test/corpus'
  );
};
