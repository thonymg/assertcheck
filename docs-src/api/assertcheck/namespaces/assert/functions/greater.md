[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / greater

# Function: greater()

```ts
function greater(
   a, 
   b, 
   opts?): void;
```

Defined in: [src/assert.ts:573](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L573)

Asserts that `a > b`.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `a` | `number` |
| `b` | `number` |
| `opts?` | `Opts` |

## Returns

`void`

## Example

```ts
`assert.greater(newVersion, currentVersion, "version must increase")`
```
