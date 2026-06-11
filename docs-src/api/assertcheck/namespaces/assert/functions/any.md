[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / any

# Function: any()

```ts
function any<T>(
   arr, 
   predicate, 
   opts?): void;
```

Defined in: [src/assert.ts:902](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L902)

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
