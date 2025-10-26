export * as AST from './lib/ast';
export * as Parser from './lib/parser/parser';
export { stringifyCst } from './lib/parser/cst-stringify';

import { parse, stats } from './lib/parser/parser';
import { stringifyCst } from './lib/parser/cst-stringify';

export default {
  parse,
  stats,
  stringifyCst,
};
