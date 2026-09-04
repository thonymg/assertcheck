[**assertcheck v0.5.15**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / hasKeys

# Function: hasKeys()

```ts
function hasKeys<T, K>(
   obj, 
   keys, 
   opts?): asserts obj is T & Record<K, unknown>;
```

Defined in: [src/assert.ts:261](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/assert.ts#L261)

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `object` |
| `K` *extends* `string` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `obj` | `T` |
| `keys` | `K`[] |
| `opts?` | `Opts` |

## Returns

`asserts obj is T & Record<K, unknown>`
