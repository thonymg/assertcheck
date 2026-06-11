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

Defined in: [src/assert.ts:117](https://github.com/thonymg/assertcheck/blob/fb514a0b33c45a051bb86cba2282fd5e4dfae3f9/src/assert.ts#L117)

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
