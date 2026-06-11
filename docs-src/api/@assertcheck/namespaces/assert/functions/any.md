[**assertcheck v1.0.0**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / any

# Function: any()

```ts
function any<T>(
   arr, 
   predicate, 
   opts?): void;
```

Defined in: src/assert.ts:902

Asserts that at least one element satisfies the predicate — Ruby `any?`.

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
`assert.any(events, e => e.type === "purchase", "need a purchase event")`
```
