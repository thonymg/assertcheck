[**assertcheck v1.0.0**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / one

# Function: one()

```ts
function one<T>(
   arr, 
   predicate, 
   opts?): void;
```

Defined in: src/assert.ts:947

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
