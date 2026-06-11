[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / sumBy

# Function: sumBy()

```ts
function sumBy<T>(
   arr, 
   iteratee, 
   expected, 
   opts?): void;
```

Defined in: [src/assert.ts:1285](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L1285)

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
