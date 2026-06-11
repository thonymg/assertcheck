[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / shorterThan

# Function: shorterThan()

```ts
function shorterThan<T>(
   arr, 
   n, 
   opts?): void;
```

Defined in: [src/assert.ts:811](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L811)

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
