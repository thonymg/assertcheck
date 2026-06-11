[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / allValuesMatch

# Function: allValuesMatch()

```ts
function allValuesMatch<T>(
   obj, 
   predicate, 
   opts?): void;
```

Defined in: [src/assert.ts:1666](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L1666)

Asserts that all values in `obj` satisfy the predicate.

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `object` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `obj` | `T` |
| `predicate` | (`v`, `k`) => `boolean` |
| `opts?` | `Opts` |

## Returns

`void`

## Example

```ts
`assert.allValuesMatch(inventory, (qty) => qty >= 0, "no negative stock")`
```
