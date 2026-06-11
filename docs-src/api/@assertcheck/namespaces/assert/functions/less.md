[**@assertcheck/core v1.0.0**](../../../../_generated.md)

***

[@assertcheck/core](../../../../_generated.md) / [assert](../_generated.md) / less

# Function: less()

```ts
function less(
   a, 
   b, 
   opts?): void;
```

Defined in: src/assert.ts:630

Asserts that `a < b`.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `a` | `number` |
| `b` | `number` |
| `opts?` | `Opts` |

## Returns

`void`

## Example

```ts
`assert.less(latencyMs, 200, "latency too high")`
```
