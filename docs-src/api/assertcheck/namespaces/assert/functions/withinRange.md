[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / withinRange

# Function: withinRange()

```ts
function withinRange(
   v, 
   min, 
   max, 
   opts?): void;
```

Defined in: [src/assert.ts:695](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L695)

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
