[**@assertcheck/core v1.0.0**](../../../../_generated.md)

***

[@assertcheck/core](../../../../_generated.md) / [assert](../_generated.md) / nil

# Function: nil()

```ts
function nil(v, opts?): asserts v is null | undefined;
```

Defined in: src/assert.ts:65

Asserts that a value is `null` or `undefined`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `v` | `unknown` | The value to check. |
| `opts?` | `Opts` | Optional message / context. |

## Returns

asserts v is null \| undefined

## Example

```ts
assert.nil(response.error, "no error expected")
```
