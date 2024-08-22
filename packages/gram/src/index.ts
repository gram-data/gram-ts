export * as AST from './lib/ast';
export * as Parser from './lib/parser/parser';

import { parse, stats } from './lib/parser/parser';

export default {
  parse,
  stats
}