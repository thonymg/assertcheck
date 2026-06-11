[**@assertcheck/core v1.0.0**](../_generated.md)

***

[@assertcheck/core](../_generated.md) / AssertionErrorOptions

# Interface: AssertionErrorOptions

Defined in: src/types.ts:107

Constructor options for [AssertionError](../classes/AssertionError.md).

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="actual"></a> `actual?` | `unknown` | The value that was actually received. | src/types.ts:113 |
| <a id="assertion"></a> `assertion` | `string` | The name of the assertion function that failed (e.g. `"equal"`). | src/types.ts:109 |
| <a id="expected"></a> `expected?` | `unknown` | The value or constraint that was expected. | src/types.ts:115 |
| <a id="message"></a> `message` | `string` | The formatted, human-readable error message. | src/types.ts:111 |
