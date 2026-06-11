[**@assertcheck/core v1.0.0**](../../../../_generated.md)

***

[@assertcheck/core](../../../../_generated.md) / [assert](../_generated.md) / mapsDistinct

# Function: mapsDistinct()

```ts
function mapsDistinct<T, U>(
   fn, 
   a, 
   b, 
   opts?): void;
```

Defined in: src/assert.ts:1855

Asserts that `fn(a)` and `fn(b)` produce different results.
Useful to detect hash collisions or identity-collapse bugs.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |
| `U` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `fn` | (`v`) => `U` |
| `a` | `T` |
| `b` | `T` |
| `opts?` | `Opts` |

## Returns

`void`

## Example

```ts
`assert.mapsDistinct(hashFn, "user:1", "user:2", "hash collision")`
```
