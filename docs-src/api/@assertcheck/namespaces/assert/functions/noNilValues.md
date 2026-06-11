[**assertcheck v1.0.0**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / noNilValues

# Function: noNilValues()

```ts
function noNilValues<T>(obj, opts?): void;
```

Defined in: src/assert.ts:1692

Asserts that no value in `obj` is `null` or `undefined`.

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `object` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `obj` | `T` |
| `opts?` | `Opts` |

## Returns

`void`

## Example

```ts
`assert.noNilValues(config, "config must have no null values")`
```
