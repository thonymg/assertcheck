[**assertcheck v0.5.15**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / zippedWith

# Function: zippedWith()

```ts
function zippedWith<A, B>(
   a, 
   b, 
   predicate, 
   opts?): void;
```

Defined in: [src/assert.ts:258](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/assert.ts#L258)

## Type Parameters

| Type Parameter |
| ------ |
| `A` |
| `B` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `a` | `A`[] |
| `b` | `B`[] |
| `predicate` | (`a`, `b`) => `boolean` |
| `opts?` | `Opts` |

## Returns

`void`
