[**assertcheck v1.0.0**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / elementsMatch

# Function: elementsMatch()

```ts
function elementsMatch<T>(
   a, 
   b, 
   opts?): void;
```

Defined in: src/assert.ts:1050

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
