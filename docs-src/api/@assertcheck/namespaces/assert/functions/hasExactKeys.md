[**assertcheck v1.0.0**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / hasExactKeys

# Function: hasExactKeys()

```ts
function hasExactKeys<K>(
   obj, 
   keys, 
   opts?): asserts obj is Record<K, unknown>;
```

Defined in: src/assert.ts:1549

Asserts that `obj` has **exactly** the given keys — no more, no less.
Narrows the type to `Record<K, unknown>` after the call.

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

## Example

```ts
`assert.hasExactKeys(payload, ["id","name","email"])`
```
