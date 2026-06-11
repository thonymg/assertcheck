[**@assertcheck/core v1.0.0**](../../../../_generated.md)

***

[@assertcheck/core](../../../../_generated.md) / [assert](../_generated.md) / withinRange

# Function: withinRange()

```ts
function withinRange(
   v, 
   min, 
   max, 
   opts?): void;
```

Defined in: src/assert.ts:695

Asserts that `v` is within the closed range `[min, max]`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `v` | `number` | The value to check. |
| `min` | `number` | Inclusive lower bound. |
| `max` | `number` | Inclusive upper bound. |
| `opts?` | `Opts` | Optional message / context. |

## Returns

`void`

## Example

```ts
assert.withinRange(percentage, 0, 100, "percentage must be 0–100")
```
