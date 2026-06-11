# Error format

When an assertion fails in `"enabled"` mode, assertcheck throws an `AssertionError` with a rich formatted message designed to show you **what failed, what was expected, and what to do next** — without opening a debugger.

## Anatomy of an error block

```
══════════════════ ● order must be pending ════════════════════

── values ──────────────────────────────────────────────────────
  + expected        "pending"
  ✗ order.status    "paid"

── note ────────────────────────────────────────────────────────
  call resetOrder() before retrying

════════════════════════════════════════════════════════════════
```

The block has four optional sections:

| Section | Content |
|---|---|
| **Header** | Assertion name + your `msg` (title) |
| **values** | Side-by-side comparison with `+` expected / `✗` actual |
| **diff** | Structured diff for `deepEqual` failures |
| **note** | Free-text hint passed via `opts.note` |

## Deep equality diff

```
══════════════════ ● Deep equality failed ═════════════════════

── diff ────────────────────────────────────────────────────────
  ·  id           "usr_123"
  ~  status
       expected   "active"
       actual     "banned"
  +  role         "admin"   ← missing in actual

════════════════════════════════════════════════════════════════
```

Diff indicators:

| Symbol | Meaning |
|---|---|
| `·` | Unchanged |
| `~` | Changed |
| `+` | Present in expected, missing in actual |
| `-` | Present in actual, extra |

## Runtime adaptation

The output adapts automatically to the environment:

- **Node.js / Bun / Deno TTY** — ANSI colours. Respects `NO_COLOR`.
- **CI / piped output** — plain text, no escape codes.
- **Browser DevTools** — `console.groupCollapsed` with CSS styling.

## Adding context to failures

The `opts` parameter is the most important tool for making failures actionable. Always use it:

```ts
assert.equal(order.status, "pending", {
  msg:    "order must be pending before payment",  // replaces default title
  actual: "order.status",                          // labels the actual value in the output
  note:   "call resetOrder() first",               // hint shown below the diff
})

// Or just a plain string for a quick message:
assert.notNil(userId, "userId is required")
```

::: tip When to use opts.note
Use `note` to explain **what the caller should do** when this assertion fires. It will appear in logs, error trackers, and developer consoles. Think of it as an inline fix suggestion.
:::

## Accessing error metadata

`AssertionError` carries structured metadata:

```ts
import { AssertionError } from "assertcheck"

try {
  assert.equal(order.status, "pending")
} catch (e) {
  if (e instanceof AssertionError) {
    console.log(e.assertion) // "equal"
    console.log(e.actual)    // "paid"
    console.log(e.expected)  // "pending"
    console.log(e.message)   // formatted block string
  }
}
```
