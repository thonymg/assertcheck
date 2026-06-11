[**assertcheck v1.0.0**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / idempotent

# Function: idempotent()

```ts
function idempotent<T>(
   fn, 
   arg, 
   opts?): void;
```

Defined in: src/assert.ts:1804

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
