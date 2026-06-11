[**assertcheck v1.0.0**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / number

# Function: number()

```ts
function number(v, opts?): asserts v is number;
```

Defined in: src/assert.ts:215

Asserts that `v` is a `number`. Narrows the type after the call.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `unknown` |
| `opts?` | `Opts` |

## Returns

`asserts v is number`

## Example

```ts
`assert.number(price, "price must be a number")`
```
