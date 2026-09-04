[**assertcheck v0.5.15**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / pure

# Function: pure()

```ts
function pure<TArgs, TReturn>(
   fn, 
   args, 
   opts?): void;
```

Defined in: [src/assert.ts:300](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/assert.ts#L300)

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
