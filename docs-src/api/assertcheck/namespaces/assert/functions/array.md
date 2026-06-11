[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / array

# Function: array()

```ts
function array<T>(v, opts?): asserts v is T[];
```

Defined in: [src/assert.ts:307](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L307)

Asserts that `v` is an array. Narrows the type to `T[]` after the call.

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `T` | `unknown` | The expected element type (defaults to `unknown`). |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `unknown` |
| `opts?` | `Opts` |

## Returns

`asserts v is T[]`

## Example

```ts
`assert.array<User>(users, "users must be an array")`
```
