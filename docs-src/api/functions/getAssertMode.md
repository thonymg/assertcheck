[**assertcheck v0.2.152**](../_generated.md)

***

[assertcheck](../_generated.md) / getAssertMode

# Function: getAssertMode()

```ts
function getAssertMode(): AssertMode;
```

Defined in: [src/mode.ts:160](https://github.com/thonymg/assertcheck/blob/fb514a0b33c45a051bb86cba2282fd5e4dfae3f9/src/mode.ts#L160)

Returns the current global assertion mode.

## Returns

[`AssertMode`](../type-aliases/AssertMode.md)

The active [AssertMode](../type-aliases/AssertMode.md).

## Example

```ts
import { getAssertMode } from "assertcheck"

console.log(getAssertMode()) // "enabled"
```
