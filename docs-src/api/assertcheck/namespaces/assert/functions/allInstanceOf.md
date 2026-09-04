[**assertcheck v0.5.15**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / allInstanceOf

# Function: allInstanceOf()

```ts
function allInstanceOf<T, TArgs>(
   arr, 
   ctor, 
   opts?): asserts arr is T[];
```

Defined in: [src/assert.ts:241](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/assert.ts#L241)

## Type Parameters

| Type Parameter |
| ------ |
| `T` |
| `TArgs` *extends* `unknown`[] |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `arr` | `unknown`[] |
| `ctor` | (...`args`) => `T` |
| `opts?` | `Opts` |

## Returns

`asserts arr is T[]`
