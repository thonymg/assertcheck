[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / hasKey

# Function: hasKey()

```ts
function hasKey<T, K>(
   obj, 
   key, 
   opts?): asserts obj is T & Record<K, unknown>;
```

Defined in: [src/assert.ts:1489](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L1489)

Asserts that `obj` has the given key — Ruby `hash.key?(k)`.
Narrows the type to `T & Record<K, unknown>` after the call.

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `object` |
| `K` *extends* `string` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `obj` | `T` |
| `key` | `K` |
| `opts?` | `Opts` |

## Returns

`asserts obj is T & Record<K, unknown>`

## Example

```ts
`assert.hasKey(config, "database", "database key required")`
```
