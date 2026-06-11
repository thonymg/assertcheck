[**assertcheck v0.2.152**](../_generated.md)

***

[assertcheck](../_generated.md) / getAssertMode

# Function: getAssertMode()

```ts
function getAssertMode(): AssertMode;
```

Defined in: [src/mode.ts:160](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/mode.ts#L160)

Returns the current global assertion mode.

## Returns

[`AssertMode`](../type-aliases/AssertMode.md)

The active [AssertMode](../type-aliases/AssertMode.md).

## Example

```ts
import { getAssertMode } from "assertcheck"

console.log(getAssertMode()) // "enabled"
```
