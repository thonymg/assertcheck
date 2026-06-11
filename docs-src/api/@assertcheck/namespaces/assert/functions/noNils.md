[**@assertcheck/core v1.0.0**](../../../../_generated.md)

***

[@assertcheck/core](../../../../_generated.md) / [assert](../_generated.md) / noNils

# Function: noNils()

```ts
function noNils<T>(arr, opts?): asserts arr is T[];
```

Defined in: src/assert.ts:1317

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
