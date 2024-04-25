import * as S from "@effect/schema/Schema"

const Person = S.Struct({
  name: S.optional(S.String.pipe(S.nonEmpty()), {
    exact: true
  })
})

