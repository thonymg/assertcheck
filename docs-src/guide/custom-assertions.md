# Custom assertions

assertcheck exposes its internal formatting primitives so you can build custom assertions that look and feel native.

## Building a custom assertion

```ts
import { buildBlock, color, fmtValue, fail, parseOpts } from "assertcheck"
import type { Opts } from "assertcheck" // re-exported as AssertOptions

export function assertPositiveInteger(
  value: unknown,
  opts?: string | AssertOptions
): asserts value is number {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) return

  const o = parseOpts(opts)
  fail({
    assertion: "positiveInteger",
    message: buildBlock({
      assertion: "positiveInteger",
      title: o.msg ?? "Expected a positive integer",
      rows: [
        { label: "received", value: fmtValue(value), indicator: color.removed("✗") },
        { label: "expected", value: "integer > 0",   indicator: color.added("+") },
      ],
      note: o.note,
    }),
    actual:   value,
    expected: "positive integer",
  })
}
```

The output will match the assertcheck style exactly:

```
══════════════════ ● Expected a positive integer ══════════════

── values ──────────────────────────────────────────────────────
  + expected        integer > 0
  ✗ received        -3

════════════════════════════════════════════════════════════════
```

## Available primitives

| Export | Purpose |
|---|---|
| `buildBlock(def)` | Build the full formatted error string from a `BlockDef` |
| `fmtValue(v)` | Format any value for display (handles nesting, truncation) |
| `color` | ANSI colour helpers: `color.added`, `color.removed`, `color.index`, etc. |
| `parseOpts(opts)` | Normalise `string \| AssertOptions \| undefined` → `{ msg, note, actual }` |
| `fail(opts)` | Throw or warn depending on current mode |
| `diffObjects(a, b)` | Generate diff rows between two objects |

## Using `assert.not` instead of `assertNotX`

Rather than writing `assertNotPositiveInteger`, use `assert.not`:

```ts
assert.not(assertPositiveInteger, value) // passes if assertPositiveInteger would throw
```
