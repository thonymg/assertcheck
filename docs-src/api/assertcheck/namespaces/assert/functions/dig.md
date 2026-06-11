[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / dig

# Function: dig()

```ts
function dig<T>(
   obj, 
   path, 
   expected, 
   opts?): void;
```

Defined in: [src/assert.ts:1714](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L1714)

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
