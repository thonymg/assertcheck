[**@assertcheck/core v1.0.0**](../../../../_generated.md)

***

[@assertcheck/core](../../../../_generated.md) / [assert](../_generated.md) / len

# Function: len()

```ts
function len<T>(
   arr, 
   n, 
   opts?): void;
```

Defined in: src/assert.ts:761

Asserts that the array has exactly `n` elements.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `arr` | `T`[] |
| `n` | `number` |
| `opts?` | `Opts` |

## Returns

`void`

## Example

```ts
`assert.len(users, 10, "expected 10 users")`
```
