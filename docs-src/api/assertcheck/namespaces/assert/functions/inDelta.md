[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / inDelta

# Function: inDelta()

```ts
function inDelta(
   actual, 
   expected, 
   delta, 
   opts?): void;
```

Defined in: [src/assert.ts:729](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L729)

Asserts that `|actual - expected| <= delta`.
Useful for floating-point comparisons and timing tolerances.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `actual` | `number` |
| `expected` | `number` |
| `delta` | `number` |
| `opts?` | `Opts` |

## Returns

`void`

## Example

```ts
assert.inDelta(computed, 1.333, 0.001, "floating point result out of tolerance")
```
