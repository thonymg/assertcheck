[**@assertcheck/core v1.0.0**](../../../../_generated.md)

***

[@assertcheck/core](../../../../_generated.md) / [assert](../_generated.md) / hasOnlyKeys

# Function: hasOnlyKeys()

```ts
function hasOnlyKeys(
   obj, 
   allowed, 
   opts?): void;
```

Defined in: src/assert.ts:1589

Asserts that `obj` contains only keys from the `allowed` list.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `obj` | `object` |
| `allowed` | `string`[] |
| `opts?` | `Opts` |

## Returns

`void`

## Example

```ts
`assert.hasOnlyKeys(patch, ["name","email"], "patch contains immutable fields")`
```
