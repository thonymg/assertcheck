[**@assertcheck/core v1.0.0**](../../../../_generated.md)

***

[@assertcheck/core](../../../../_generated.md) / [assert](../_generated.md) / first

# Function: first()

```ts
function first<T>(
   arr, 
   expected, 
   opts?): void;
```

Defined in: src/assert.ts:1237

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
