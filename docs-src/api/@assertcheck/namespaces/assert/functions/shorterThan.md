[**@assertcheck/core v1.0.0**](../../../../_generated.md)

***

[@assertcheck/core](../../../../_generated.md) / [assert](../_generated.md) / shorterThan

# Function: shorterThan()

```ts
function shorterThan<T>(
   arr, 
   n, 
   opts?): void;
```

Defined in: src/assert.ts:811

Asserts that the array has fewer than `n` elements.

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
`assert.shorterThan(queue, 1000, "queue overflow")`
```
