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

Defined in: [src/assert.ts:195](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/assert.ts#L195)

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
