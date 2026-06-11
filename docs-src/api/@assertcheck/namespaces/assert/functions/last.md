[**assertcheck v1.0.0**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / last

# Function: last()

```ts
function last<T>(
   arr, 
   expected, 
   opts?): void;
```

Defined in: src/assert.ts:1261

Asserts that the last element equals `expected` — Ruby `arr.last`.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `arr` | `T`[] |
| `expected` | `T` |
| `opts?` | `Opts` |

## Returns

`void`

## Example

```ts
`assert.last(pipeline, finalStep, "pipeline must end with finalStep")`
```
