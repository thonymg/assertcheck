[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / subset

# Function: subset()

```ts
function subset<T>(
   arr, 
   sub, 
   opts?): void;
```

Defined in: [src/assert.ts:1084](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L1084)

Asserts that all elements of `sub` are present in `arr`.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `arr` | `T`[] |
| `sub` | `T`[] |
| `opts?` | `Opts` |

## Returns

`void`

## Example

```ts
`assert.subset(arr, required, "some required elements are missing")`
```
