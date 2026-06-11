[**@assertcheck/core v1.0.0**](../../../../_generated.md)

***

[@assertcheck/core](../../../../_generated.md) / [assert](../_generated.md) / containsNone

# Function: containsNone()

```ts
function containsNone<T>(
   arr, 
   items, 
   opts?): void;
```

Defined in: src/assert.ts:1023

Asserts that none of `items` are present in `arr`.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `arr` | `T`[] |
| `items` | `T`[] |
| `opts?` | `Opts` |

## Returns

`void`

## Example

```ts
`assert.containsNone(errors, fatalErrors, "fatal error occurred")`
```
