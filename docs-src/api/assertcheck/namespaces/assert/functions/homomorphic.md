[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / homomorphic

# Function: homomorphic()

```ts
function homomorphic<T>(
   fn, 
   combine, 
   a, 
   b, 
   opts?): void;
```

Defined in: [src/assert.ts:1893](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L1893)

Asserts that `fn(combine(a, b))` equals `combine(fn(a), fn(b))`.
Tests the homomorphism law — that a transform distributes over
a combining operation.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `fn` | (`v`) => `T` |
| `combine` | (`a`, `b`) => `T` |
| `a` | `T` |
| `b` | `T` |
| `opts?` | `Opts` |

## Returns

`void`

## Example

```ts
assert.homomorphic(
  normalize,
  (a, b) => [...a, ...b],
  [1, 2], [3, 4],
  "normalize must distribute over concatenation"
)
```
