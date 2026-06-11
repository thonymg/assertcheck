[**@assertcheck/core v1.0.0**](../../../../_generated.md)

***

[@assertcheck/core](../../../../_generated.md) / [assert](../_generated.md) / sumBy

# Function: sumBy()

```ts
function sumBy<T>(
   arr, 
   iteratee, 
   expected, 
   opts?): void;
```

Defined in: src/assert.ts:1285

Asserts that `_.sumBy(arr, iteratee)` equals `expected` — Ruby `arr.sum`.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `arr` | `T`[] |
| `iteratee` | `string` \| ((`value`) => `number`) |
| `expected` | `number` |
| `opts?` | `Opts` |

## Returns

`void`

## Example

```ts
`assert.sumBy(lineItems, "totalCents", invoiceTotal, "line items must match invoice")`
```
