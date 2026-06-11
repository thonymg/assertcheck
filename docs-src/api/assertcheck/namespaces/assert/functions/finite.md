[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / finite

# Function: finite()

```ts
function finite(v, opts?): asserts v is number;
```

Defined in: [src/assert.ts:263](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L263)

Asserts that `v` is a finite number (excludes NaN and ±Infinity).

## Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `unknown` |
| `opts?` | `Opts` |

## Returns

`asserts v is number`

## Example

```ts
`assert.finite(ratio, "ratio must be finite")`
```
