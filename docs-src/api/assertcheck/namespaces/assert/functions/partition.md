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

Defined in: [src/assert.ts:248](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/assert.ts#L248)

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
