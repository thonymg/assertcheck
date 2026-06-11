[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / none

# Function: none()

```ts
function none<T>(
   arr, 
   predicate, 
   opts?): void;
```

Defined in: [src/assert.ts:924](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L924)

Asserts that no element satisfies the predicate — Ruby `none?`.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `arr` | `T`[] |
| `predicate` | (`v`) => `boolean` |
| `opts?` | `Opts` |

## Returns

`void`

## Example

```ts
`assert.none(users, u => u.banned && u.active, "banned users must be inactive")`
```
