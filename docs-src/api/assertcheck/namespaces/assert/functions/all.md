[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / all

# Function: all()

```ts
function all<T, U>(
   arr, 
   predicate, 
   opts?): asserts arr is U[];
```

Defined in: [src/assert.ts:83](https://github.com/thonymg/assertcheck/blob/fb514a0b33c45a051bb86cba2282fd5e4dfae3f9/src/assert.ts#L83)

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
