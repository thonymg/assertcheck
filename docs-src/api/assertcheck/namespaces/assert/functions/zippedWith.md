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

Defined in: [src/assert.ts:246](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/assert.ts#L246)

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
