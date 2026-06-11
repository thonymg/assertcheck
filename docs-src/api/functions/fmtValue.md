[**assertcheck v0.2.152**](../_generated.md)

***

[assertcheck](../_generated.md) / fmtValue

# Function: fmtValue()

```ts
function fmtValue(v, depth?): string;
```

Defined in: [src/format.ts:230](https://github.com/thonymg/assertcheck/blob/fb514a0b33c45a051bb86cba2282fd5e4dfae3f9/src/format.ts#L230)

Formats any JavaScript value into a compact, type-coloured string
suitable for display in error output.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `v` | `unknown` | `undefined` | The value to format. |
| `depth` | `number` | `0` | Internal recursion depth (0 = top level). |

## Returns

`string`

A formatted, optionally coloured string.

## Remarks

- Strings are wrapped in `"double quotes"`.
- Arrays are abbreviated after 3 elements: `[1, 2, 3, …+7]`.
- Objects are abbreviated after 3 keys.
- Recursion is limited to 2 levels deep.
- When ANSI is available, each type is rendered in a distinct colour.

## Example

```ts
import { fmtValue } from "assertcheck/format"

fmtValue("hello")        // → "hello"   (green in terminal)
fmtValue(42)             // → 42        (yellow)
fmtValue([1, 2, 3, 4])   // → [1, 2, 3, …+1]
fmtValue(null)           // → null      (dim)
```
