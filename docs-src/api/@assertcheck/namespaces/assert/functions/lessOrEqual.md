[**assertcheck v1.0.0**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / lessOrEqual

# Function: lessOrEqual()

```ts
function lessOrEqual(
   a, 
   b, 
   opts?): void;
```

Defined in: src/assert.ts:658

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
