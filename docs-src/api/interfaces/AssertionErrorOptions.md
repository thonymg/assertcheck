[**assertcheck v0.5.15**](../_generated.md)

***

[assertcheck](../_generated.md) / AssertionErrorOptions

# Interface: AssertionErrorOptions

Defined in: [src/types.ts:61](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/types.ts#L61)

Constructor options for [AssertionError](../classes/AssertionError.md).

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="actual"></a> `actual?` | `unknown` | The value that was actually received. | [src/types.ts:67](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/types.ts#L67) |
| <a id="assertion"></a> `assertion` | `string` | The name of the assertion function that failed (e.g. `"equal"`). | [src/types.ts:63](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/types.ts#L63) |
| <a id="expected"></a> `expected?` | `unknown` | The value or constraint that was expected. | [src/types.ts:69](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/types.ts#L69) |
| <a id="message"></a> `message` | `string` | The formatted, human-readable error message. | [src/types.ts:65](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/types.ts#L65) |
