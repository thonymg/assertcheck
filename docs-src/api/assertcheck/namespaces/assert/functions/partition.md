[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / partition

# Function: partition()

```ts
function partition<T>(
   arr, 
   predicate, 
   expectedMatch, 
   expectedRest, 
   opts?): void;
```

Defined in: [src/assert.ts:105](https://github.com/thonymg/assertcheck/blob/fb514a0b33c45a051bb86cba2282fd5e4dfae3f9/src/assert.ts#L105)

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `arr` | `T`[] |
| `predicate` | (`v`) => `boolean` |
| `expectedMatch` | `number` |
| `expectedRest` | `number` |
| `opts?` | `Opts` |

## Returns

`void`
