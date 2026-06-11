[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / sortedBy

# Function: sortedBy()

```ts
function sortedBy<T>(
   arr, 
   iteratee, 
   opts?): void;
```

Defined in: [src/assert.ts:1216](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L1216)

Asserts that the array is sorted by the given iteratee — Ruby `sort_by`.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `arr` | `T`[] |
| `iteratee` | `ValueIteratee`\<`T`\> |
| `opts?` | `Opts` |

## Returns

`void`

## Example

```ts
`assert.sortedBy(events, "timestamp", "events must be chronological")`
```
