[**assertcheck v1.0.0**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / allValuesMatch

# Function: allValuesMatch()

```ts
function allValuesMatch<T>(
   obj, 
   predicate, 
   opts?): void;
```

Defined in: src/assert.ts:1666

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
