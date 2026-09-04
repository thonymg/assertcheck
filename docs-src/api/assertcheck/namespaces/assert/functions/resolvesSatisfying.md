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

Defined in: [src/assert.ts:319](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/assert.ts#L319)

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
