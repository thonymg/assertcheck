[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / unique

# Function: unique()

```ts
function unique<T>(arr, opts?): void;
```

Defined in: [src/assert.ts:1110](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L1110)

Asserts that all elements are strictly unique (`indexOf` comparison).

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `arr` | `T`[] |
| `opts?` | `Opts` |

## Returns

`void`

## Example

```ts
`assert.unique(ids, "duplicate IDs detected")`
```
