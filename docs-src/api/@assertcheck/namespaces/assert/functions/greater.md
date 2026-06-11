[**@assertcheck/core v1.0.0**](../../../../_generated.md)

***

[@assertcheck/core](../../../../_generated.md) / [assert](../_generated.md) / greater

# Function: greater()

```ts
function greater(
   a, 
   b, 
   opts?): void;
```

Defined in: src/assert.ts:573

Asserts that `a > b`.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `a` | `number` |
| `b` | `number` |
| `opts?` | `Opts` |

## Returns

`void`

## Example

```ts
`assert.greater(newVersion, currentVersion, "version must increase")`
```
