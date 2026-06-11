[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / arity

# Function: arity()

```ts
function arity(
   fn, 
   n, 
   opts?): void;
```

Defined in: [src/assert.ts:1830](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L1830)

Asserts that `fn.length` equals `n` (declared parameter count).

## Parameters

| Parameter | Type |
| ------ | ------ |
| `fn` | (...`args`) => `unknown` |
| `n` | `number` |
| `opts?` | `Opts` |

## Returns

`void`

## Example

```ts
`assert.arity(transform, 1, "pipeline steps must be unary")`
```
