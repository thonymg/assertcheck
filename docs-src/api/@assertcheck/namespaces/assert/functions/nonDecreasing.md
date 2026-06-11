[**assertcheck v1.0.0**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / nonDecreasing

# Function: nonDecreasing()

```ts
function nonDecreasing(arr, opts?): void;
```

Defined in: src/assert.ts:1191

Asserts that numeric array elements are non-decreasing (allows equal values).

## Parameters

| Parameter | Type |
| ------ | ------ |
| `arr` | `number`[] |
| `opts?` | `Opts` |

## Returns

`void`

## Example

```ts
`assert.nonDecreasing(scores, "scores must not decrease")`
```
