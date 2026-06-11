[**assertcheck v1.0.0**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / positive

# Function: positive()

```ts
function positive(n, opts?): void;
```

Defined in: src/assert.ts:501

Asserts that `n` is a positive finite number (> 0).

## Parameters

| Parameter | Type |
| ------ | ------ |
| `n` | `number` |
| `opts?` | `Opts` |

## Returns

`void`

## Example

```ts
`assert.positive(amountCents, "amount must be positive")`
```
