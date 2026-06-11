[**@assertcheck/core v1.0.0**](../../../../_generated.md)

***

[@assertcheck/core](../../../../_generated.md) / [assert](../_generated.md) / containsAll

# Function: containsAll()

```ts
function containsAll<T>(
   arr, 
   items, 
   opts?): void;
```

Defined in: src/assert.ts:997

Asserts that all items in `items` are present in `arr`.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `arr` | `T`[] |
| `items` | `T`[] |
| `opts?` | `Opts` |

## Returns

`void`

## Example

```ts
`assert.containsAll(permissions, required, "missing required permissions")`
```
