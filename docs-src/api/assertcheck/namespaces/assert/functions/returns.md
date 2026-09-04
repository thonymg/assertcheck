[**assertcheck v0.5.15**](../../../../_generated.md)

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

Defined in: [src/assert.ts:294](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/assert.ts#L294)

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
