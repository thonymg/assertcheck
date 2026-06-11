[**@assertcheck/core v1.0.0**](../../../../_generated.md)

***

[@assertcheck/core](../../../../_generated.md) / [assert](../_generated.md) / none

# Function: none()

```ts
function none<T>(
   arr, 
   predicate, 
   opts?): void;
```

Defined in: src/assert.ts:924

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
