[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / hasValue

# Function: hasValue()

```ts
function hasValue<T, K>(
   obj, 
   key, 
   expected, 
   opts?): void;
```

Defined in: [src/assert.ts:111](https://github.com/thonymg/assertcheck/blob/fb514a0b33c45a051bb86cba2282fd5e4dfae3f9/src/assert.ts#L111)

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `object` |
| `K` *extends* `string` \| `number` \| `symbol` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `obj` | `T` |
| `key` | `K` |
| `expected` | `T`\[`K`\] |
| `opts?` | `Opts` |

## Returns

`void`
