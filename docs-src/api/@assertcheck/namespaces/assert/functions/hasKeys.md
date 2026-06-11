[**assertcheck v1.0.0**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / hasKeys

# Function: hasKeys()

```ts
function hasKeys<T, K>(
   obj, 
   keys, 
   opts?): asserts obj is T & Record<K, unknown>;
```

Defined in: src/assert.ts:1518

Asserts that `obj` has all the given keys.
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
| `keys` | `K`[] |
| `opts?` | `Opts` |

## Returns

`asserts obj is T & Record<K, unknown>`

## Example

```ts
`assert.hasKeys(config, ["host","port","database"])`
```
