[**assertcheck v0.5.15**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / resolvesSatisfying

# Function: resolvesSatisfying()

```ts
function resolvesSatisfying<T>(
   promise, 
   predicate, 
opts?): Promise<void>;
```

Defined in: [src/assert.ts:331](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/assert.ts#L331)

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `promise` | `Awaitable`\<`T`\> |
| `predicate` | (`v`) => `boolean` |
| `opts?` | `Opts` |

## Returns

`Promise`\<`void`\>
