[**assertcheck v1.0.0**](../../../../_generated.md)

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

Defined in: src/assert.ts:1451

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
