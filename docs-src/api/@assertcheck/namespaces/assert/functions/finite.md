[**@assertcheck/core v1.0.0**](../../../../_generated.md)

***

[@assertcheck/core](../../../../_generated.md) / [assert](../_generated.md) / finite

# Function: finite()

```ts
function finite(v, opts?): asserts v is number;
```

Defined in: src/assert.ts:263

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
