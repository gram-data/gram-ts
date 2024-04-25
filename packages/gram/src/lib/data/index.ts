

export interface Pattern<V> {
  value: V
  members: Pattern<V>[]
}

export const value = <V>(p:Pattern<V>):V => p.value

export const of = <V>(value:V):Pattern<V> => ({
  value,
  members: []
})

export const make = <V>(value:V, members:Pattern<V>[]) => ({
  value, members
})





