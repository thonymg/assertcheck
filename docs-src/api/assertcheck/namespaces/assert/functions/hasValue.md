[**assertcheck v0.5.15**](../../../../_generated.md)

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

Defined in: [src/assert.ts:272](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/assert.ts#L272)

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
