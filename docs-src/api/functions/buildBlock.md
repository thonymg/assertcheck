[**@assertcheck/core v1.0.0**](../_generated.md)

***

[@assertcheck/core](../_generated.md) / buildBlock

# Function: buildBlock()

```ts
function buildBlock(def): string;
```

Defined in: src/format.ts:363

Builds the complete formatted error block string from a BlockDef.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `def` | `BlockDef` | The block definition. |

## Returns

`string`

The complete formatted string, ready to print.

## Remarks

The output follows this ELM-inspired structure:
```
══════════════════ ● Title ════════════════════════════════

── values ──────────────────────────────────────────────────
  + expected      "pending"
  ✗ actual        "paid"

── diff ────────────────────────────────────────────────────
  · id            "usr_123"
  ~ status
      expected    "active"
      actual      "banned"

── context ─────────────────────────────────────────────────
  index           3
  array size      10

── note ────────────────────────────────────────────────────
  Call resetOrder() before retrying

════════════════════════════════════════════════════════════
```

## Example

```ts
import { buildBlock, fmtValue } from "@assertcheck/core/format"

const msg = buildBlock({
  assertion: "equal",
  title:     "Order status mismatch",
  rows: [
    { label: "expected", value: fmtValue("pending"), indicator: "+" },
    { label: "actual",   value: fmtValue("paid"),    indicator: "✗" },
  ],
  note: "Call resetOrder() before retrying",
})
```
