[**assertcheck v1.0.0**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / containsSubset

# Function: containsSubset()

```ts
function containsSubset<T>(
   obj, 
   subset, 
   opts?): void;
```

Defined in: src/assert.ts:1640

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
