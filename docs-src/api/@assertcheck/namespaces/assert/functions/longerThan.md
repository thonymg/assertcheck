[**assertcheck v1.0.0**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / longerThan

# Function: longerThan()

```ts
function longerThan<T>(
   arr, 
   n, 
   opts?): void;
```

Defined in: src/assert.ts:786

Asserts that the array has more than `n` elements.

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
`assert.longerThan(results, 0, "must have at least one result")`
```
