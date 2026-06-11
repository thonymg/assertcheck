[**@assertcheck/core v1.0.0**](../../../../_generated.md)

***

[@assertcheck/core](../../../../_generated.md) / [assert](../_generated.md) / subset

# Function: subset()

```ts
function subset<T>(
   arr, 
   sub, 
   opts?): void;
```

Defined in: src/assert.ts:1084

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
