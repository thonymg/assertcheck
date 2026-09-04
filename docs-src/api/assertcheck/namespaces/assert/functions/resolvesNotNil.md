[**assertcheck v0.5.15**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / resolvesNotNil

# Function: resolvesNotNil()

```ts
function resolvesNotNil<T>(promise, opts?): Promise<NonNullable<T>>;
```

Defined in: [src/assert.ts:324](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/assert.ts#L324)

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
