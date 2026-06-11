[**@assertcheck/core v1.0.0**](../../../../_generated.md)

***

[@assertcheck/core](../../../../_generated.md) / [assert](../_generated.md) / count

# Function: count()

```ts
function count<T>(
   arr, 
   predicate, 
   n, 
   opts?): void;
```

Defined in: src/assert.ts:972

Asserts that exactly `n` elements satisfy the predicate — Ruby `count { }`.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `arr` | `T`[] |
| `predicate` | (`v`) => `boolean` |
| `n` | `number` |
| `opts?` | `Opts` |

## Returns

`void`

## Example

```ts
`assert.count(transactions, t => t.amount > 1000, 3, "expected 3 large transactions")`
```
