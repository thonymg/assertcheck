[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / one

# Function: one()

```ts
function one<T>(
   arr, 
   predicate, 
   opts?): void;
```

Defined in: [src/assert.ts:947](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L947)

Asserts that exactly one element satisfies the predicate — Ruby `one?`.

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
`assert.one(events, e => e.type === "checkout", "exactly one checkout expected")`
```
