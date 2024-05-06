import { Args, Command, Options } from "@effect/cli"
import { Array, Config, ConfigProvider, Console, Effect, Option } from "effect"

// gram add   [-v | --verbose] [--] [<pathspec>...]
const pathspec = Args.text({ name: "pathspec" }).pipe(Args.repeated)
const verbose = Options.boolean("verbose").pipe(
  Options.withAlias("v"),
  Options.withFallbackConfig(Config.boolean("VERBOSE"))
)
export const gramAdd = Command.make("add", { pathspec, verbose }, ({ pathspec, verbose }) => {
  const paths = Array.match(pathspec, {
    onEmpty: () => "",
    onNonEmpty: (paths) => ` ${Array.join(paths, ":")}`
  })
  return Console.log(`Running 'gram add${paths}' with '--verbose ${verbose}'`)
})

