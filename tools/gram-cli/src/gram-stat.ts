import { Args, Command, Options } from '@effect/cli';
import { FileSystem } from '@effect/platform';
import {
  NodeFileSystem,
  NodeContext,
  NodeRuntime,
  NodeTerminal,
} from '@effect/platform-node';
import {
  Array,
  Config,
  ConfigProvider,
  Console,
  Effect,
  Option,
  pipe,
} from 'effect';
import { Terminal } from '@effect/platform';

import Gram from 'gram';
import { AST } from 'gram';

const gramStats = (filename: string, verbose: boolean) =>
  FileSystem.FileSystem.pipe(
    Effect.flatMap((fs) => fs.readFileString(filename, 'utf8')),
    Effect.tap((content) =>
      verbose
        ? Effect.all([
            Console.log('\n# ' + filename + '... '),
            Console.log(content),
          ])
        : Effect.void
    ),
    Effect.map((content) => Gram.parse(content)),
    Effect.tap((cst) =>
      verbose
        ? Effect.all([
            Console.log('cst:'),
            Console.log(cst.rootNode.toString()),
            Console.log(''),
          ])
        : Effect.void
    ),
    Effect.map((cst) => Gram.stats(cst.rootNode)),
    Effect.map((stats) => ({ source: filename, ...stats })),
    // Effect.flatMap((stats) => Console.log('(:Stats ', stats, ')'))
    Effect.map((stats) => AST.node(undefined, ["Gram","Stats"], AST.object(stats))),
    Effect.flatMap((stats) => Console.log(AST.stringify(stats)))
  );

// gram stat   [-v | --verbose] [--] [<filename>...]
const filenames = Args.text({ name: 'filenames' }).pipe(Args.repeated);
const verbose = Options.boolean('verbose').pipe(
  Options.withAlias('v'),
  Options.withFallbackConfig(Config.boolean('VERBOSE'))
);
export const gramStat = Command.make(
  'stat',
  { filenames, verbose },
  ({ filenames, verbose }) =>
    pipe(
      filenames,
      Array.map((filename) => gramStats(filename, verbose)), // effectfully parse each filename
      Effect.all // combine all effects into one
    )
);
