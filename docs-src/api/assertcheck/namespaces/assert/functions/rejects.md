[**assertcheck v0.5.15**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / rejects

# Function: rejects()

```ts
function rejects<E, TArgs>(
   promise, 
   ctorOrOpts?, 
opts?): Promise<void>;
```

Defined in: [src/assert.ts:316](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/assert.ts#L316)

## Type Parameters

| Type Parameter |
| ------ |
| `E` *extends* `Error` |
| `TArgs` *extends* `unknown`[] |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `promise` | `Awaitable`\<`unknown`\> |
| `ctorOrOpts?` | `Opts` \| ((...`args`) => `E`) |
| `opts?` | `Opts` |

## Returns

`Promise`\<`void`\>
