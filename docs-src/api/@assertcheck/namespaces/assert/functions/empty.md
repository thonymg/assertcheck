[**assertcheck v1.0.0**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / empty

# Function: empty()

```ts
function empty(v, opts?): void;
```

Defined in: src/assert.ts:134

Asserts that a value is empty.
Uses `_.isEmpty`, which handles strings, arrays, objects, Map, and Set.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `v` | `unknown` | The value to check. |
| `opts?` | `Opts` | Optional message / context. |

## Returns

`void`

## Example

```ts
assert.empty(errors, "no errors expected")
```
