[**assertcheck v0.5.15**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / instanceOf

# Function: instanceOf()

```ts
function instanceOf<T, TArgs>(
   v, 
   ctor, 
   opts?): asserts v is T;
```

Defined in: [src/assert.ts:207](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/assert.ts#L207)

## Type Parameters

| Type Parameter |
| ------ |
| `T` |
| `TArgs` *extends* `unknown`[] |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `unknown` |
| `ctor` | (...`args`) => `T` |
| `opts?` | `Opts` |

## Returns

`asserts v is T`
