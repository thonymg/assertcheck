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

Defined in: [src/assert.ts:284](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/assert.ts#L284)

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
