[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / equal

# Function: equal()

```ts
function equal<T>(
   actual, 
   expected, 
   opts?): void;
```

Defined in: [src/assert.ts:443](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L443)

Asserts strict equality (`===`).

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `actual` | `T` | The value under test. |
| `expected` | `T` | The expected value. |
| `opts?` | `Opts` | Optional message / context. |

## Returns

`void`

## Example

```ts
assert.equal(order.status, "pending", {
  msg:    "order must be pending before payment",
  actual: "order.status",
})
```
