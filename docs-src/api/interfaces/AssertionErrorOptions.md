[**assertcheck v0.2.152**](../_generated.md)

***

[assertcheck](../_generated.md) / AssertionErrorOptions

# Interface: AssertionErrorOptions

Defined in: [src/types.ts:107](https://github.com/thonymg/assertcheck/blob/fb514a0b33c45a051bb86cba2282fd5e4dfae3f9/src/types.ts#L107)

Constructor options for [AssertionError](../classes/AssertionError.md).

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="actual"></a> `actual?` | `unknown` | The value that was actually received. | [src/types.ts:113](https://github.com/thonymg/assertcheck/blob/fb514a0b33c45a051bb86cba2282fd5e4dfae3f9/src/types.ts#L113) |
| <a id="assertion"></a> `assertion` | `string` | The name of the assertion function that failed (e.g. `"equal"`). | [src/types.ts:109](https://github.com/thonymg/assertcheck/blob/fb514a0b33c45a051bb86cba2282fd5e4dfae3f9/src/types.ts#L109) |
| <a id="expected"></a> `expected?` | `unknown` | The value or constraint that was expected. | [src/types.ts:115](https://github.com/thonymg/assertcheck/blob/fb514a0b33c45a051bb86cba2282fd5e4dfae3f9/src/types.ts#L115) |
| <a id="message"></a> `message` | `string` | The formatted, human-readable error message. | [src/types.ts:111](https://github.com/thonymg/assertcheck/blob/fb514a0b33c45a051bb86cba2282fd5e4dfae3f9/src/types.ts#L111) |
