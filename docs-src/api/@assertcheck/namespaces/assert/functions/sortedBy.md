[**assertcheck v1.0.0**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / sortedBy

# Function: sortedBy()

```ts
function sortedBy<T>(
   arr, 
   iteratee, 
   opts?): void;
```

Defined in: src/assert.ts:1216

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
