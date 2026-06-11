[**@assertcheck/core v1.0.0**](../../../../_generated.md)

***

[@assertcheck/core](../../../../_generated.md) / [assert](../_generated.md) / unique

# Function: unique()

```ts
function unique<T>(arr, opts?): void;
```

Defined in: src/assert.ts:1110

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
