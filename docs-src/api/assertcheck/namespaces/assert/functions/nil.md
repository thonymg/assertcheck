[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / nil

# Function: nil()

```ts
function nil(v, opts?): asserts v is null | undefined;
```

Defined in: [src/assert.ts:65](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L65)

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
