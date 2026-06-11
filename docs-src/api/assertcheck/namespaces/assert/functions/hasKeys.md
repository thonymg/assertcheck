[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / hasKeys

# Function: hasKeys()

```ts
function hasKeys<T, K>(
   obj, 
   keys, 
   opts?): asserts obj is T & Record<K, unknown>;
```

Defined in: [src/assert.ts:108](https://github.com/thonymg/assertcheck/blob/fb514a0b33c45a051bb86cba2282fd5e4dfae3f9/src/assert.ts#L108)

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
