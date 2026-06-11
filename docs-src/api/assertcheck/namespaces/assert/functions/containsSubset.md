[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / containsSubset

# Function: containsSubset()

```ts
function containsSubset<T>(
   obj, 
   subset, 
   opts?): void;
```

Defined in: [src/assert.ts:1640](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L1640)

Asserts that `obj` contains all key-value pairs in `subset`.

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `object` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `obj` | `T` |
| `subset` | `Partial`\<`T`\> |
| `opts?` | `Opts` |

## Returns

`void`

## Example

```ts
`assert.containsSubset(user, { role: "admin" }, "user must be admin")`
```
