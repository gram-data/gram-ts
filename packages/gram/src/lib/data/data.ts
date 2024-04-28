

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

export const empty = make(null, [])

export const node = <V>(value:V) => make(value, [])

export const relationship = <V>(value:V, members:[Pattern<V>,Pattern<V>]) => make(value, members)

export const pattern = <V>(value:V, members:Pattern<V>[]) => make(value, members)

export const append = <V>(p:Pattern<V>, member:Pattern<V>) => ({
  ...p,
  members: [...p.members, member]
})



