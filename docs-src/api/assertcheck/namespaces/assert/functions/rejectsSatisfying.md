[**assertcheck v0.5.15**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / rejectsSatisfying

# Function: rejectsSatisfying()

```ts
function rejectsSatisfying(
   promise, 
   predicate, 
opts?): Promise<void>;
```

Defined in: [src/assert.ts:323](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/assert.ts#L323)

## Parameters

| Parameter | Type |
| ------ | ------ |
| `promise` | `Awaitable`\<`unknown`\> |
| `predicate` | (`err`) => `boolean` |
| `opts?` | `Opts` |

## Returns

`Promise`\<`void`\>
