[**assertcheck v1.0.0**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / all

# Function: all()

```ts
function all<T, U>(
   arr, 
   predicate, 
   opts?): asserts arr is U[];
```

Defined in: src/assert.ts:872

Asserts that every element satisfies the predicate — Ruby `all?`.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |
| `U` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `arr` | `T`[] |
| `predicate` | ((`v`) => `v is U`) \| ((`v`) => `boolean`) |
| `opts?` | `Opts` |

## Returns

`asserts arr is U[]`

## Remarks

When the predicate is a type guard `(v: T) => v is U`, the entire
array is narrowed to `U[]` after the call.

## Example

```ts
assert.all(orders, o => o.status === "paid", "all orders must be paid")

// With type guard — narrows array type:
assert.all(items, (v): v is string => typeof v === "string")
items // string[]
```
