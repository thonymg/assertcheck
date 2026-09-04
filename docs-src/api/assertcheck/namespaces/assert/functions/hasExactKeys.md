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

Defined in: [src/assert.ts:266](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/assert.ts#L266)

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
