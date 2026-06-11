[**@assertcheck/core v1.0.0**](../../../../_generated.md)

***

[@assertcheck/core](../../../../_generated.md) / [assert](../_generated.md) / uniqueBy

# Function: uniqueBy()

```ts
function uniqueBy<T>(
   arr, 
   iteratee, 
   opts?): void;
```

Defined in: src/assert.ts:1138

Asserts that all elements are unique when mapped through `iteratee`.
Equivalent to Ruby `arr.uniq { |x| x.key }.length == arr.length`.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `arr` | `T`[] |
| `iteratee` | `ValueIteratee`\<`T`\> |
| `opts?` | `Opts` |

## Returns

`void`

## Example

```ts
`assert.uniqueBy(users, "email", "duplicate emails")`
```
