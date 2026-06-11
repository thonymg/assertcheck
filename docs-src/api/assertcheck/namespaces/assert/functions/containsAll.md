[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / containsAll

# Function: containsAll()

```ts
function containsAll<T>(
   arr, 
   items, 
   opts?): void;
```

Defined in: [src/assert.ts:997](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L997)

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
