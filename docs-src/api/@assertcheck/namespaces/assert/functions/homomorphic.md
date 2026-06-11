[**assertcheck v1.0.0**](../../../../_generated.md)

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

Defined in: src/assert.ts:1893

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
