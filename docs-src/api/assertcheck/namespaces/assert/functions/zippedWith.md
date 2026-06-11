[**assertcheck v0.2.152**](../../../../_generated.md)

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

Defined in: [src/assert.ts:1389](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L1389)

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
