[**assertcheck v0.5.15**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / hasExactKeys

# Function: hasExactKeys()

```ts
function hasExactKeys<K>(
   obj, 
   keys, 
   opts?): asserts obj is Record<K, unknown>;
```

Defined in: [src/assert.ts:278](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/assert.ts#L278)

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
