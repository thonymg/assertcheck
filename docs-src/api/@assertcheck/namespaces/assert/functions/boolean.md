[**assertcheck v1.0.0**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / boolean

# Function: boolean()

```ts
function boolean(v, opts?): asserts v is boolean;
```

Defined in: src/assert.ts:284

Asserts that `v` is a `boolean`. Narrows the type after the call.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `unknown` |
| `opts?` | `Opts` |

## Returns

`asserts v is boolean`

## Example

```ts
`assert.boolean(flag, "flag must be boolean")`
```
