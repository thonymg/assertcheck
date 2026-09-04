[**assertcheck v0.5.15**](../../../../_generated.md)

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

Defined in: [src/assert.ts:260](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/assert.ts#L260)

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
