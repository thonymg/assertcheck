[**assertcheck v0.5.15**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / resolvesNotNil

# Function: resolvesNotNil()

```ts
function resolvesNotNil<T>(promise, opts?): Promise<NonNullable<T>>;
```

Defined in: [src/assert.ts:336](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/assert.ts#L336)

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `promise` | `Awaitable`\<`T` \| `null` \| `undefined`\> |
| `opts?` | `Opts` |

## Returns

`Promise`\<`NonNullable`\<`T`\>\>
