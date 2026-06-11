[**@assertcheck/core v1.0.0**](../../../../_generated.md)

***

[@assertcheck/core](../../../../_generated.md) / [assert](../_generated.md) / equal

# Function: equal()

```ts
function equal<T>(
   actual, 
   expected, 
   opts?): void;
```

Defined in: src/assert.ts:443

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
