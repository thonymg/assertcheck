[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / includes

# Function: includes()

```ts
function includes<T>(
   arr, 
   item, 
   opts?): void;
```

Defined in: [src/assert.ts:836](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L836)

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
