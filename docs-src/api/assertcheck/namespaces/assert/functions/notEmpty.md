[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / notEmpty

# Function: notEmpty()

```ts
function notEmpty<T>(v, opts?): asserts v is NonNullable<T>;
```

Defined in: [src/assert.ts:163](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L163)

Asserts that a value is **not** empty.
Uses `_.isEmpty`, which handles strings, arrays, objects, Map, and Set.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `v` | `T` | The value to check. |
| `opts?` | `Opts` | Optional message / context. |

## Returns

`asserts v is NonNullable<T>`

## Example

```ts
assert.notEmpty(users, "users list must not be empty")
```
