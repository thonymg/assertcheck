[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / partition

# Function: partition()

```ts
function partition<T>(
   arr, 
   predicate, 
   expectedMatch, 
   expectedRest, 
   opts?): void;
```

Defined in: [src/assert.ts:1451](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L1451)

Asserts the sizes of both partitions produced by `_.partition`.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `arr` | `T`[] |
| `predicate` | (`v`) => `boolean` |
| `expectedMatch` | `number` |
| `expectedRest` | `number` |
| `opts?` | `Opts` |

## Returns

`void`

## Example

```ts
`assert.partition(jobs, j => j.done, 8, 2, "8 done, 2 pending")`
```
