[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / boolean

# Function: boolean()

```ts
function boolean(v, opts?): asserts v is boolean;
```

Defined in: [src/assert.ts:284](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L284)

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
