[**assertcheck v0.2.152**](../../../../_generated.md)

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

Defined in: [src/assert.ts:103](https://github.com/thonymg/assertcheck/blob/fb514a0b33c45a051bb86cba2282fd5e4dfae3f9/src/assert.ts#L103)

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
