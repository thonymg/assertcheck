[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / negative

# Function: negative()

```ts
function negative(n, opts?): void;
```

Defined in: [src/assert.ts:525](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L525)

Asserts that `n` is a negative finite number (< 0).

## Parameters

| Parameter | Type |
| ------ | ------ |
| `n` | `number` |
| `opts?` | `Opts` |

## Returns

`void`

## Example

```ts
`assert.negative(delta, "delta must be negative")`
```
