[**@assertcheck/core v1.0.0**](../../../../_generated.md)

***

[@assertcheck/core](../../../../_generated.md) / [assert](../_generated.md) / flat

# Function: flat()

```ts
function flat(arr, opts?): void;
```

Defined in: src/assert.ts:1339

Asserts that the array has no nesting (all elements are non-array).

## Parameters

| Parameter | Type |
| ------ | ------ |
| `arr` | `unknown`[] |
| `opts?` | `Opts` |

## Returns

`void`

## Example

```ts
`assert.flat(tags, "tags array must be flat")`
```
