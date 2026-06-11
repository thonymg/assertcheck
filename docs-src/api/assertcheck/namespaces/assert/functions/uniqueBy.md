[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / uniqueBy

# Function: uniqueBy()

```ts
function uniqueBy<T>(
   arr, 
   iteratee, 
   opts?): void;
```

Defined in: [src/assert.ts:1138](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L1138)

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
