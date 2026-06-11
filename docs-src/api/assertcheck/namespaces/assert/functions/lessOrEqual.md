[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / lessOrEqual

# Function: lessOrEqual()

```ts
function lessOrEqual(
   a, 
   b, 
   opts?): void;
```

Defined in: [src/assert.ts:658](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L658)

Asserts that `a <= b`.

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
`assert.lessOrEqual(pageSize, 100, "page size exceeds limit")`
```
