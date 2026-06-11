[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / all

# Function: all()

```ts
function all<T, U>(
   arr, 
   predicate, 
   opts?): asserts arr is U[];
```

Defined in: [src/assert.ts:872](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L872)

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
