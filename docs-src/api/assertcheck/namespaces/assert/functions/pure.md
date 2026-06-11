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

Defined in: [src/assert.ts:118](https://github.com/thonymg/assertcheck/blob/fb514a0b33c45a051bb86cba2282fd5e4dfae3f9/src/assert.ts#L118)

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
