[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / greaterOrEqual

# Function: greaterOrEqual()

```ts
function greaterOrEqual(
   a, 
   b, 
   opts?): void;
```

Defined in: [src/assert.ts:601](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L601)

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
