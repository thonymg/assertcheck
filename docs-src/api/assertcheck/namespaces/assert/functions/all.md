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

Defined in: [src/assert.ts:230](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/assert.ts#L230)

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
