[**@assertcheck/core v1.0.0**](../../../../_generated.md)

***

[@assertcheck/core](../../../../_generated.md) / [assert](../_generated.md) / dig

# Function: dig()

```ts
function dig<T>(
   obj, 
   path, 
   expected, 
   opts?): void;
```

Defined in: src/assert.ts:1714

Asserts that the object has a value at a nested path — Ruby `hash.dig(:a, :b)`.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `obj` | `T` |
| `path` | `string` \| `string`[] |
| `expected` | `unknown` |
| `opts?` | `Opts` |

## Returns

`void`

## Example

```ts
`assert.dig(config, "database.pool.max", 10)`
```
