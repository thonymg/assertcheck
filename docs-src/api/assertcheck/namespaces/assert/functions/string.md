[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / string

# Function: string()

```ts
function string(v, opts?): asserts v is string;
```

Defined in: [src/assert.ts:188](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L188)

Asserts that `v` is a `string`. Narrows the type after the call.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `unknown` |
| `opts?` | `Opts` |

## Returns

`asserts v is string`

## Example

```ts
`assert.string(name, "name must be a string")`
```
