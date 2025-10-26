## Quickstart: Updating Gram CST Types & Stringifier

1. **Install dependencies**

   ```bash
   npm ci
   ```

2. **Sync grammar sources**

   ```bash
   pushd tree-sitter-gram
   npm install
   npm run build
   popd
   ```

3. **Regenerate CST definitions**

   ```bash
   npx nx test packages-gram --test-name-pattern="CST schema snapshot"
   ```

   - Update `packages/gram/src/lib/parser/cst-types.ts` with any missing nodes reported by the test snapshot.

4. **Implement s-expression stringify**

   ```ts
   import { parseToCst, stringifyCst } from '@gram-data/gram';

   const cst = parseToCst('(a)-[:KNOWS]->(b)');
   console.log(stringifyCst(cst));
   // => (graph (relationship right_arrow ...))
   ```

5. **Run corpus regression suite**

   ```bash
   npx nx test packages-gram --test-name-pattern="tree-sitter corpus"
   ```

   - Confirms positive samples match tree-sitter CLI output and `:error` samples fail as expected.

6. **Publish guidance**
   ```bash
   npx nx format:write packages-gram
   npx nx lint packages-gram
   ```

   - Update `packages/gram/README.md` with new stringify usage and upgrade notes before opening a PR.
