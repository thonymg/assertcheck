[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / instanceOf

# Function: instanceOf()

```ts
function instanceOf<T>(
   v, 
   ctor, 
   opts?): asserts v is T;
```

Defined in: [src/assert.ts:404](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L404)

Asserts that `v` is an instance of the given constructor.
Narrows the type to `T` after the call.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `v` | `unknown` | The value to check. |
| `ctor` | (...`args`) => `T` | The constructor to test against. |
| `opts?` | `Opts` | Optional message / context. |

## Returns

`asserts v is T`

## Example

```ts
assert.instanceOf(err, ValidationError, "must be a ValidationError")
err.field // TypeScript knows err is ValidationError
```
