[**assertcheck v1.0.0**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / zippedWith

# Function: zippedWith()

```ts
function zippedWith<A, B>(
   a, 
   b, 
   predicate, 
   opts?): void;
```

Defined in: src/assert.ts:1389

Asserts that two arrays, when zipped together, satisfy the predicate
for every pair — Ruby `arr.zip(other).all? { |a,b| ... }`.

## Type Parameters

| Type Parameter |
| ------ |
| `A` |
| `B` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `a` | `A`[] |
| `b` | `B`[] |
| `predicate` | (`a`, `b`) => `boolean` |
| `opts?` | `Opts` |

## Returns

`void`

## Example

```ts
`assert.zippedWith(inputs, outputs, (i, o) => o.id === i.id, "ids must match")`
```
