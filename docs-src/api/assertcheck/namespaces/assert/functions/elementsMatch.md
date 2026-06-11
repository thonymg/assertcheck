[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / elementsMatch

# Function: elementsMatch()

```ts
function elementsMatch<T>(
   a, 
   b, 
   opts?): void;
```

Defined in: [src/assert.ts:1050](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L1050)

Asserts that the two arrays have the same elements regardless of order.
Uses `_.sortBy` for a deterministic comparison (works with objects).

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `a` | `T`[] |
| `b` | `T`[] |
| `opts?` | `Opts` |

## Returns

`void`

## Example

```ts
`assert.elementsMatch(result, expected, "wrong set of ids")`
```
