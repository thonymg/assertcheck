[**assertcheck v1.0.0**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / pure

# Function: pure()

```ts
function pure<TArgs, TReturn>(
   fn, 
   args, 
   opts?): void;
```

Defined in: src/assert.ts:1774

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
