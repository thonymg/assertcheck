[**@assertcheck/core v1.0.0**](../../../../_generated.md)

***

[@assertcheck/core](../../../../_generated.md) / [assert](../_generated.md) / arity

# Function: arity()

```ts
function arity(
   fn, 
   n, 
   opts?): void;
```

Defined in: src/assert.ts:1830

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
