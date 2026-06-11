[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / integer

# Function: integer()

```ts
function integer(v, opts?): asserts v is number;
```

Defined in: [src/assert.ts:242](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L242)

Asserts that `v` is a finite integer (no floats, no NaN, no Infinity).

## Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `unknown` |
| `opts?` | `Opts` |

## Returns

`asserts v is number`

## Example

```ts
`assert.integer(amountCents, "amount must be integer cents")`
```
