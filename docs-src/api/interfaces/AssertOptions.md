[**assertcheck v0.2.152**](../_generated.md)

***

[assertcheck](../_generated.md) / AssertOptions

# Interface: AssertOptions

Defined in: [src/types.ts:78](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/types.ts#L78)

Options accepted by every assertion function.

## Remarks

All fields are optional. You can pass a plain `string` as a shorthand for
`{ msg: "..." }`.

## Example

```ts
// Shorthand string
assert.equal(a, b, "values must match")

// Full options object
assert.equal(a, b, {
  msg:    "order status mismatch",
  actual: "order.status",
  note:   "call resetOrder() before retrying",
})
```

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="actual"></a> `actual?` | `string` | Label for the actual value in the error output. Useful to identify which variable or field failed. **Example** ``"order.status"`, `"response.body.user.age"`` | [src/types.ts:90](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/types.ts#L90) |
| <a id="msg"></a> `msg?` | `string` | Human-readable description of what the assertion checks. Appears as the title in the formatted error block. | [src/types.ts:83](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/types.ts#L83) |
| <a id="note"></a> `note?` | `string` | Additional context about why this assertion exists or how to fix it. Displayed in the `note` section of the error block. **Example** ``"Call resetOrder() before retrying"`` | [src/types.ts:97](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/types.ts#L97) |
