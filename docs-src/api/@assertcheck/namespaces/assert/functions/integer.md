[**@assertcheck/core v1.0.0**](../../../../_generated.md)

***

[@assertcheck/core](../../../../_generated.md) / [assert](../_generated.md) / integer

# Function: integer()

```ts
function integer(v, opts?): asserts v is number;
```

Defined in: src/assert.ts:242

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
