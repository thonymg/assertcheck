[**@assertcheck/core v1.0.0**](../../../../_generated.md)

***

[@assertcheck/core](../../../../_generated.md) / [assert](../_generated.md) / notEmpty

# Function: notEmpty()

```ts
function notEmpty<T>(v, opts?): asserts v is NonNullable<T>;
```

Defined in: src/assert.ts:163

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
