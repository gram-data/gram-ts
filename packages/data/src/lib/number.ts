import { Magma } from 'fp-ts/Magma'
import { Semigroup } from 'fp-ts/Semigroup'
import { Monoid } from 'fp-ts/Monoid'
import { Eq } from 'fp-ts/Eq'

export const equalNumbers:Eq<number> = {
  equals: (x: number, y: number) => (x === y)
}

export const addNumbers:Magma<number> = {
  concat: (x,y) => x + y
}

export const semigroupAddNumber:Semigroup<number> = {
  ...addNumbers
}

export const monoidAddNumbers:Monoid<number> = {
  ...semigroupAddNumber,
  empty: 0
}

