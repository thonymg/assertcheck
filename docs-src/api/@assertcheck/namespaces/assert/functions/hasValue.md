[**assertcheck v1.0.0**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / hasValue

# Function: hasValue()

```ts
function hasValue<T, K>(
   obj, 
   key, 
   expected, 
   opts?): void;
```

Defined in: src/assert.ts:1616

Asserts that `obj[key] === expected` (deep equality via `_.isEqual`).
The value type is inferred from `T[K]`.

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `object` |
| `K` *extends* `string` \| `number` \| `symbol` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `obj` | `T` |
| `key` | `K` |
| `expected` | `T`\[`K`\] |
| `opts?` | `Opts` |

## Returns

`void`

## Example

```ts
`assert.hasValue(config, "port", 5432, "wrong database port")`
```
