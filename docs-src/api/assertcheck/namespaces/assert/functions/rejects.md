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

Defined in: [src/assert.ts:304](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/assert.ts#L304)

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
