[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / instanceOf

# Function: instanceOf()

```ts
function instanceOf<T>(
   v, 
   ctor, 
   opts?): asserts v is T;
```

Defined in: [src/assert.ts:64](https://github.com/thonymg/assertcheck/blob/fb514a0b33c45a051bb86cba2282fd5e4dfae3f9/src/assert.ts#L64)

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `unknown` |
| `ctor` | (...`args`) => `T` |
| `opts?` | `Opts` |

## Returns

`asserts v is T`
