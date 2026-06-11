[**assertcheck v0.2.152**](../../../../_generated.md)

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

Defined in: [src/assert.ts:1616](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L1616)

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
