# Error format

When an assertion fails in `"enabled"` mode, assertcheck throws an `AssertionError` with a rich formatted message designed to answer three questions immediately: **what failed**, **what was expected**, and **what to do next** — without opening a debugger.

::: tip The three-second rule
A good assertion error should be fully understood in three seconds. If you have to grep for context, the assertion wasn't written well enough. The `opts` parameter is how you get there.
:::

---

## Anatomy of an error block

```
══════════════════ ● order must be pending before charge ══════

── values ──────────────────────────────────────────────────────
  + expected        "pending"
  ✗ order.status    "paid"

── note ────────────────────────────────────────────────────────
  call resetOrder() before retrying

════════════════════════════════════════════════════════════════
```

The block has four sections — all optional, all driven by the `opts` parameter you pass:

| Section | Content | Driven by |
|---|---|---|
| **Header** | Assertion name + message title | `opts.msg` |
| **values** | `+` expected / `✗` actual, side-by-side | `opts.actual` label |
| **diff** | Structural diff for `deepEqual` failures | automatic |
| **note** | Free-text hint — what the caller should do | `opts.note` |

---

## Writing assertions that produce great errors

The difference between a useless error and a useful one is entirely in how you write the `opts`:

```ts
// Useless at 3am during an incident — no context, no hint
assert.equal(order.status, "pending")

// Clear, actionable, self-contained
assert.equal(order.status, "pending", {
  msg:    "order must be pending before payment",  // replaces the default title
  actual: "order.status",                          // labels the actual value in the output
  note:   "call resetOrder() first",               // shown as a fix hint below the diff
})
```

For simple one-liner messages, a plain string works:

```ts
assert.notNil(userId, "userId is required")
```

::: tip When to use `opts.note`
Use `note` to explain **what the caller should do** when this assertion fires. It will appear in logs, error trackers, and developer consoles. Think of it as an inline fix suggestion — visible exactly when it's most useful.
:::

---

## Deep equality diff

`assert.deepEqual` produces a field-by-field structural diff when the objects don't match:

```
══════════════════ ● API response shape changed ═══════════════

── diff ────────────────────────────────────────────────────────
  ·  id           "usr_123"
  ~  status
       expected   "active"
       actual     "banned"
  +  role         "admin"   ← missing in actual
  -  legacyField  "old"     ← present in actual, not in expected

════════════════════════════════════════════════════════════════
```

Diff indicators:

| Symbol | Meaning |
|---|---|
| `·` | Field matches — unchanged |
| `~` | Field exists in both — value differs |
| `+` | Present in expected, missing in actual |
| `-` | Present in actual, not expected |

This makes it immediately clear whether a field is missing, extra, or just wrong — without staring at two JSON blobs.

---

## Catching errors programmatically

`AssertionError` carries structured metadata alongside the formatted message — useful for error reporters, test utilities, and custom error handling:

```ts
import { assert, AssertionError } from "assertcheck"

try {
  assert.equal(order.status, "pending", {
    msg:    "order must be pending before payment",
    actual: "order.status",
  })
} catch (e) {
  if (e instanceof AssertionError) {
    e.assertion  // "equal"
    e.actual     // "paid"
    e.expected   // "pending"
    e.message    // the full formatted block string (for logging)
  }
}
```

---

## Runtime adaptation

Output adapts automatically to the environment — no configuration required:

| Environment | Output format |
|---|---|
| Node.js / Bun / Deno on TTY | ANSI colours — green for expected, red for actual |
| CI / piped output | Plain text — no escape codes |
| Browser DevTools | `console.groupCollapsed` with CSS styling |
| `NO_COLOR` env set | Plain text regardless of TTY |

---

## Examples across assertion types

### Type failure

```ts
assert.string(userId, "userId must be a string")
// userId = 42
```

```
══════════════════ ● userId must be a string ══════════════════

── values ──────────────────────────────────────────────────────
  + expected        string
  ✗ received        42 (number)

════════════════════════════════════════════════════════════════
```

### Range failure

```ts
assert.withinRange(discount, 0, 1, {
  msg:  "discount must be a fraction between 0 and 1",
  note: "pass 0.15 for a 15% discount — not 15",
})
// discount = 15
```

```
══════════════════ ● discount must be a fraction between 0 and 1

── values ──────────────────────────────────────────────────────
  + range           [0, 1]
  ✗ received        15

── note ────────────────────────────────────────────────────────
  pass 0.15 for a 15% discount — not 15

════════════════════════════════════════════════════════════════
```

### Collection failure

```ts
check(orders)
  .noNils("no null orders allowed in the batch")
// orders = [order1, null, order3]
```

```
══════════════════ ● no null orders allowed in the batch ══════

── values ──────────────────────────────────────────────────────
  found null at index   1

════════════════════════════════════════════════════════════════
```
