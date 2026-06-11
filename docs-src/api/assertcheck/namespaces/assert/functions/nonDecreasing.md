[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / nonDecreasing

# Function: nonDecreasing()

```ts
function nonDecreasing(arr, opts?): void;
```

Defined in: [src/assert.ts:1191](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L1191)

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
