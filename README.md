# gram-ts -- TypeScript support for gram

> Gram is a subject-based notation for structured data

This library provides a parser and supporting data structures for Gram.

## About Gram

Gram "subjects" represent data as a hierarchy of decorated patterns, where a pattern has the shape:

```ts
export interface Pattern<V> {
  value: V;
  members: Pattern<V>[];
}
```

And the `V` in gram consists of:
- an identifier
- zero or more labels
- a propery record

As a language, gram includes notation for common patterns:
- `[a:Label1:Label2 {i:1, t:"two"} | member1, member2, memberN]` --> a general subject with identifier, labels, properties and members
- `(a:Person {name:"ABK"})` --> a special subject with no members, called a "node"
- `@style({x:10, y:20, color:"red"}) [anyPattern]` --> a subject with one member, called an "annotation"
- `(a)-[:KNOWS {since:2010}]->(b)` --> a subject with exactly two members, called a "relationship"

The general subject notation -- `[a:Label | member1, member2, memberN]` -- handles all other patterns of arbitrary arity and connectedness. For example:
- a sequence has an arbitrary number of members
- a path is a chained sequence of relationships which share nodes along the way
- a component is a sequence of members which are connected (no member is isolated)
