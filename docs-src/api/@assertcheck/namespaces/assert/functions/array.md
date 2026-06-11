[**assertcheck v1.0.0**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / array

# Function: array()

```ts
function array<T>(v, opts?): asserts v is T[];
```

Defined in: src/assert.ts:307

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
