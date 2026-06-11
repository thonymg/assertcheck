[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / flat

# Function: flat()

```ts
function flat(arr, opts?): void;
```

Defined in: [src/assert.ts:1339](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L1339)

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
