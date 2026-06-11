[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / noNils

# Function: noNils()

```ts
function noNils<T>(arr, opts?): asserts arr is T[];
```

Defined in: [src/assert.ts:1317](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L1317)

Asserts that the array contains no `null` or `undefined` values.
Narrows the type to `NonNullable<T>[]` after the call.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `arr` | (`T` \| `null` \| `undefined`)[] |
| `opts?` | `Opts` |

## Returns

`asserts arr is T[]`

## Example

```ts
`assert.noNils(records, "records must not contain null entries")`
```
