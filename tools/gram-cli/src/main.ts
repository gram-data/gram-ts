import { Args, Command, Options } from "@effect/cli"
import { NodeContext, NodeRuntime } from "@effect/platform-node"
import { Array, Config, ConfigProvider, Console, Effect, Option } from "effect"

import { gramAdd } from "./gram-cmds"
import { gramStat } from "./gram-stat"

// gram [--version] [-h | --help] [-c <name>=<value>]
const configs = Options.keyValueMap("c").pipe(Options.optional)
const gram = Command.make("gram", { configs }, ({ configs }) =>
  Option.match(configs, {
    onNone: () => Console.log("Running 'gram'"),
    onSome: (configs) => {
      const keyValuePairs = Array.fromIterable(configs)
        .map(([key, value]) => `${key}=${value}`)
        .join(", ")
      return Console.log(`Running 'gram' with the following configs: ${keyValuePairs}`)
    }
  }))


const command = gram.pipe(Command.withSubcommands([gramAdd, gramStat]))

const cli = Command.run(command, {
  name: "gram tool",
  version: "v1.0.0"
})

Effect.suspend(() => cli(process.argv)).pipe(
  Effect.withConfigProvider(ConfigProvider.nested(ConfigProvider.fromEnv(), "GIT")),
  Effect.provide(NodeContext.layer),
  NodeRuntime.runMain
)