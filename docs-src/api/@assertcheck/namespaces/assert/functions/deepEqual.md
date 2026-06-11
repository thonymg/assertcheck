[**assertcheck v1.0.0**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / deepEqual

# Function: deepEqual()

```ts
function deepEqual<T>(
   actual, 
   expected, 
   opts?): void;
```

Defined in: src/assert.ts:476

Asserts deep equality using `_.isEqual`.
Works on objects, arrays, and nested structures.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `actual` | `T` | The value under test. |
| `expected` | `T` | The expected value. |
| `opts?` | `Opts` | Optional message / context. |

## Returns

`void`

## Example

```ts
assert.deepEqual(parsed, { id: 1, name: "Alice" }, "parsed user mismatch")
```
