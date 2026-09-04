[**assertcheck v0.5.15**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / notNil

# Function: notNil()

```ts
function notNil<T>(v, opts?): asserts v is NonNullable<T>;
```

Defined in: [src/assert.ts:191](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/assert.ts#L191)

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `T` \| `null` \| `undefined` |
| `opts?` | `Opts` |

## Returns

`asserts v is NonNullable<T>`
