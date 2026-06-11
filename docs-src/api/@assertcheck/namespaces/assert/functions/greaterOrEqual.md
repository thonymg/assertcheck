[**assertcheck v1.0.0**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / greaterOrEqual

# Function: greaterOrEqual()

```ts
function greaterOrEqual(
   a, 
   b, 
   opts?): void;
```

Defined in: src/assert.ts:601

Asserts that `a >= b`.

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
`assert.greaterOrEqual(balance, amount, "insufficient funds")`
```
