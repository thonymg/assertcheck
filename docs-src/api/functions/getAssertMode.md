[**@assertcheck/core v1.0.0**](../_generated.md)

***

[@assertcheck/core](../_generated.md) / getAssertMode

# Function: getAssertMode()

```ts
function getAssertMode(): AssertMode;
```

Defined in: src/mode.ts:160

Returns the current global assertion mode.

## Returns

[`AssertMode`](../type-aliases/AssertMode.md)

The active [AssertMode](../type-aliases/AssertMode.md).

## Example

```ts
import { getAssertMode } from "@assertcheck/core"

console.log(getAssertMode()) // "enabled"
```
