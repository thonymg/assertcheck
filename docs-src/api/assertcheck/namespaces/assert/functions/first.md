[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / first

# Function: first()

```ts
function first<T>(
   arr, 
   expected, 
   opts?): void;
```

Defined in: [src/assert.ts:1237](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L1237)

Asserts that the first element equals `expected` — Ruby `arr.first`.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `arr` | `T`[] |
| `expected` | `T` |
| `opts?` | `Opts` |

## Returns

`void`

## Example

```ts
`assert.first(sorted, lowestId, "first element must be the lowest id")`
```
