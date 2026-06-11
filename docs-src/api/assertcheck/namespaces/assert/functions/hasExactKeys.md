[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / hasExactKeys

# Function: hasExactKeys()

```ts
function hasExactKeys<K>(
   obj, 
   keys, 
   opts?): asserts obj is Record<K, unknown>;
```

Defined in: [src/assert.ts:109](https://github.com/thonymg/assertcheck/blob/fb514a0b33c45a051bb86cba2282fd5e4dfae3f9/src/assert.ts#L109)

## Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* `string` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `obj` | `object` |
| `keys` | `K`[] |
| `opts?` | `Opts` |

## Returns

`asserts obj is Record<K, unknown>`
