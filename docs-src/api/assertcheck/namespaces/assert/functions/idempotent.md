[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / idempotent

# Function: idempotent()

```ts
function idempotent<T>(
   fn, 
   arg, 
   opts?): void;
```

Defined in: [src/assert.ts:1804](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L1804)

Asserts that `fn(fn(x))` equals `fn(x)` (idempotent function).

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `fn` | (`v`) => `T` |
| `arg` | `T` |
| `opts?` | `Opts` |

## Returns

`void`

## Example

```ts
`assert.idempotent(normalizeEmail, "Alice@Example.COM")`
```
