[**@assertcheck/core v1.0.0**](../../../../_generated.md)

***

[@assertcheck/core](../../../../_generated.md) / [assert](../_generated.md) / includes

# Function: includes()

```ts
function includes<T>(
   arr, 
   item, 
   opts?): void;
```

Defined in: src/assert.ts:836

Asserts that the array contains the given item (using `_.includes`).

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `arr` | `T`[] |
| `item` | `T` |
| `opts?` | `Opts` |

## Returns

`void`

## Example

```ts
`assert.includes(roles, "admin", "admin role required")`
```
