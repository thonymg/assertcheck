[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / notNil

# Function: notNil()

```ts
function notNil<T>(v, opts?): asserts v is NonNullable<T>;
```

Defined in: [src/assert.ts:102](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L102)

Asserts that a value is **not** `null` or `undefined`.
Narrows the type to `NonNullable<T>` after the call.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `v` | `T` \| `null` \| `undefined` | The value to check. |
| `opts?` | `Opts` | Optional message / context. |

## Returns

`asserts v is NonNullable<T>`

## Example

```ts
assert.notNil(user, "user must exist")
user.name // TypeScript now knows user is not null/undefined
```
