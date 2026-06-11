[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / hasOnlyKeys

# Function: hasOnlyKeys()

```ts
function hasOnlyKeys(
   obj, 
   allowed, 
   opts?): void;
```

Defined in: [src/assert.ts:1589](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/assert.ts#L1589)

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
