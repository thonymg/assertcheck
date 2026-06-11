[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / object

# Function: object()

```ts
function object<T>(v, opts?): asserts v is T;
```

Defined in: [src/assert.ts:337](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L337)

Asserts that `v` is a plain object (not a class instance, not an array).
Narrows the type to `T` after the call.

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `T` *extends* `object` | `object` | The expected object type (defaults to `object`). |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `unknown` |
| `opts?` | `Opts` |

## Returns

`asserts v is T`

## Example

```ts
`assert.object<Config>(raw, "raw must be a plain object")`
```
