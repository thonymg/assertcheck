[**assertcheck v1.0.0**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / func

# Function: func()

```ts
function func<T>(v, opts?): asserts v is T;
```

Defined in: src/assert.ts:364

Asserts that `v` is a function. Narrows the type to `T` after the call.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* (...`args`) => `unknown` | (...`args`) => `unknown` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `unknown` |
| `opts?` | `Opts` |

## Returns

`asserts v is T`

## Example

```ts
`assert.func(handler, "handler must be a function")`
```
