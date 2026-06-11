[**assertcheck v0.2.152**](../_generated.md)

***

[assertcheck](../_generated.md) / buildBlock

# Function: buildBlock()

```ts
function buildBlock(def): string;
```

Defined in: [src/format.ts:363](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/format.ts#L363)

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
import { buildBlock, fmtValue } from "assertcheck/format"

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
