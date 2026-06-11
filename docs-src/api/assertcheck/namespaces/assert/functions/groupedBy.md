[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / groupedBy

# Function: groupedBy()

```ts
function groupedBy<T>(
   arr, 
   iteratee, 
   expectedGroups, 
   opts?): void;
```

Defined in: [src/assert.ts:1411](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L1411)

Asserts the expected group keys produced by `_.groupBy`.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `arr` | `T`[] |
| `iteratee` | `ValueIteratee`\<`T`\> |
| `expectedGroups` | `string`[] |
| `opts?` | `Opts` |

## Returns

`void`

## Example

```ts
`assert.groupedBy(events, "type", ["click","view","purchase"])`
```
