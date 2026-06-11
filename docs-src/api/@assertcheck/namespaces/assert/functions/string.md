[**assertcheck v1.0.0**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / string

# Function: string()

```ts
function string(v, opts?): asserts v is string;
```

Defined in: src/assert.ts:188

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
