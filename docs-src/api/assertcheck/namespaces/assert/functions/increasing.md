[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / increasing

# Function: increasing()

```ts
function increasing(arr, opts?): void;
```

Defined in: [src/assert.ts:1166](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L1166)

Asserts that numeric array elements are strictly increasing.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `arr` | `number`[] |
| `opts?` | `Opts` |

## Returns

`void`

## Example

```ts
`assert.increasing(versions, "versions must increase")`
```
