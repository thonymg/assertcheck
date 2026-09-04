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

Defined in: [src/assert.ts:288](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/assert.ts#L288)

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
