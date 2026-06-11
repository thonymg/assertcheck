[**assertcheck v1.0.0**](../../../../_generated.md)

***

[assertcheck](../../../../_generated.md) / [assert](../_generated.md) / not

# Function: not()

```ts
function not(fn, ...args): void;
```

Defined in: src/assert.ts:1942

Inverts any assertion — passes only if the inner assertion throws.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fn` | (...`args`) => `void` | Any assertion function from this module. |
| ...`args` | `unknown`[] | Arguments to forward to the assertion function. |

## Returns

`void`

## Remarks

This is the **only** negation API in the library. Instead of duplicating
every assertion as `notEqual`, `notEmpty`, etc., wrap any assertion in
`not()`.

## Example

```ts
// assert that two values are NOT equal
assert.not(assert.equal, user.role, "admin")

// assert that the array does NOT contain "FATAL"
assert.not(assert.includes, errors, "FATAL")

// assert the object does NOT have a forbidden key
assert.not(assert.hasKey, patch, "id")
```
