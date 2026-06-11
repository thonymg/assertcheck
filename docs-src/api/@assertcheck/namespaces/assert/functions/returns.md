[**@assertcheck/core v1.0.0**](../../../../_generated.md)

***

[@assertcheck/core](../../../../_generated.md) / [assert](../_generated.md) / returns

# Function: returns()

```ts
function returns<TArgs, TReturn>(
   fn, 
   args, 
   expected, 
   opts?): void;
```

Defined in: src/assert.ts:1743

Asserts that `fn(...args)` returns `expected` (deep equality).

## Type Parameters

| Type Parameter |
| ------ |
| `TArgs` *extends* `unknown`[] |
| `TReturn` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `fn` | (...`args`) => `TReturn` |
| `args` | `TArgs` |
| `expected` | `TReturn` |
| `opts?` | `Opts` |

## Returns

`void`

## Example

```ts
`assert.returns(getDefaultCurrency, [], "USD")`
```
