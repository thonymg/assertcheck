[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / allInstanceOf

# Function: allInstanceOf()

```ts
function allInstanceOf<T>(
   arr, 
   ctor, 
   opts?): asserts arr is T[];
```

Defined in: [src/assert.ts:1361](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L1361)

Asserts that all elements are instances of the given constructor.
Narrows the type to `T[]` after the call.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `arr` | `unknown`[] |
| `ctor` | (...`args`) => `T` |
| `opts?` | `Opts` |

## Returns

`asserts arr is T[]`

## Example

```ts
`assert.allInstanceOf(events, DomainEvent, "all events must be DomainEvent")`
```
