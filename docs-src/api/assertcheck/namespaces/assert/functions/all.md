[**assertcheck v0.5.15**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / all

# Function: all()

```ts
function all<T, U>(
   arr, 
   predicate, 
   opts?): asserts arr is U[];
```

Defined in: [src/assert.ts:218](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/assert.ts#L218)

## Type Parameters

| Type Parameter |
| ------ |
| `T` |
| `U` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `arr` | `T`[] |
| `predicate` | ((`v`) => `v is U`) \| ((`v`) => `boolean`) |
| `opts?` | `Opts` |

## Returns

`asserts arr is U[]`
