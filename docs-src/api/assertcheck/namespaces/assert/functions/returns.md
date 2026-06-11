[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / returns

# Function: returns()

```ts
function returns<TArgs, TReturn>(
   fn, 
   args, 
   expected, 
   opts?): void;
```

Defined in: [src/assert.ts:1743](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L1743)

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
