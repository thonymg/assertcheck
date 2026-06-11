[**assertcheck v0.2.152**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / notNil

# Function: notNil()

```ts
function notNil<T>(v, opts?): asserts v is NonNullable<T>;
```

Defined in: [src/assert.ts:52](https://github.com/thonymg/assertcheck/blob/fb514a0b33c45a051bb86cba2282fd5e4dfae3f9/src/assert.ts#L52)

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
