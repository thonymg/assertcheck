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

Defined in: [src/assert.ts:311](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/assert.ts#L311)

## Parameters

| Parameter | Type |
| ------ | ------ |
| `promise` | `Awaitable`\<`unknown`\> |
| `predicate` | (`err`) => `boolean` |
| `opts?` | `Opts` |

## Returns

`Promise`\<`void`\>
