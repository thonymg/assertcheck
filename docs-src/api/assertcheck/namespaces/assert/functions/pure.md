[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / pure

# Function: pure()

```ts
function pure<TArgs, TReturn>(
   fn, 
   args, 
   opts?): void;
```

Defined in: [src/assert.ts:1774](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L1774)

Asserts that calling `fn` twice with the same arguments produces identical
results (referential transparency / pure function).

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
| `opts?` | `Opts` |

## Returns

`void`

## Example

```ts
`assert.pure(calculateTax, [order])`
```
