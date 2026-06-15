<script setup>
const nextSteps = [
  {
    name: 'Negative Space Programming',
    desc: 'Understand the design philosophy behind assertcheck and why declaring invalid states changes how you debug.',
    link: '/guide/negative-space',
    linkText: 'Read the principle',
    icon: 'ri:focus-3-line',
  },
  {
    name: 'Error format',
    desc: 'Learn to write assertions that produce actionable errors — with labels, diffs, and inline fix hints.',
    link: '/guide/error-format',
    linkText: 'Read the format guide',
    icon: 'ri:terminal-line',
  },
  {
    name: 'Chainable API',
    desc: 'Use check() to declare multiple invariants on the same value in a single fluent expression.',
    link: '/guide/check',
    linkText: 'Explore check()',
    icon: 'ri:link-m',
  },
]
</script>

# Getting started

**assertcheck** is a production-grade assertion library for TypeScript. Runtime contracts that fire at the point of violation — not three layers later in a stack trace.

::: tip Negative Space Programming
assertcheck is built around the principle of **Negative Space Programming**: define what your code *cannot accept*, not just what it should do. An assertion is a declaration of an invalid state that must never occur — not error handling, but a living contract. [Learn the principle →](/guide/negative-space)
:::

## The problem

Most TypeScript codebases handle bad input with defensive returns. They look safe, but they aren't — they silently absorb broken assumptions, and the bug surfaces somewhere completely unrelated, much later, with no context.

```ts
// The standard pattern — and its hidden cost
function chargeOrder(order: Order) {
  if (!order) return            // caller gets undefined, no error, no trace
  if (!order.amount) return     // zero and negative amounts silently pass through
  if (order.status !== "pending") return  // double-charge is now possible
}
```

With assertcheck, every broken assumption has a name and an origin:

```ts
import { assert } from "assertcheck"

function chargeOrder(order: Order) {
  assert.notNil(order, "order is required")
  assert.positive(order.amount, "order amount must be positive")
  assert.equal(order.status, "pending", {
    msg:    "order must be pending before charge",
    actual: "order.status",
    note:   "call resetOrder() before retrying",
  })
  // If any precondition is broken, execution stops here — not somewhere downstream.
}
```

## Install

::: code-group

```sh [npm]
npm install assertcheck
```

```sh [yarn]
yarn add assertcheck
```

```sh [pnpm]
pnpm add assertcheck
```

```sh [bun]
bun add assertcheck
```

```sh [jsr / Deno]
deno add jsr:assertcheck
bunx jsr add assertcheck
```

:::

## Your first assertion

Every assertion accepts an optional last argument — a plain string or an options object. **Always describe what the value represents**, not just what it should be. That description is what makes failures readable at 3am during an incident.

```ts
import { assert } from "assertcheck"

// A bare assertion — technically correct, but useless when it fires
assert.equal(order.status, "pending")

// A contextual assertion — tells you what failed, what was expected, and what to do
assert.equal(order.status, "pending", {
  msg:    "order must be pending before payment",
  actual: "order.status",            // labels the actual value in the diff
  note:   "call resetOrder() first", // shown as a hint in the error output
})
```

When the second one fires, you get this in your terminal:

```
══════════════════ ● order must be pending before payment ═════

── values ──────────────────────────────────────────────────────
  + expected        "pending"
  ✗ order.status    "paid"

── note ────────────────────────────────────────────────────────
  call resetOrder() before retrying

════════════════════════════════════════════════════════════════
```

No stack trace archaeology. No `console.log` debugging. The error tells you exactly where to look.

## Chainable style

Use `check()` when you're validating multiple invariants on the same value. Each step throws immediately on failure — the chain stops at the first violated assertion.

```ts
import { check } from "assertcheck"

check(users)
  .notEmpty("users list must not be empty")
  .noNils("no null users allowed")
  .uniqueBy("id", "duplicate user IDs detected")
  .all(u => u.active, "all users must be active before processing")
  .sortedBy("createdAt")
```

Both `assert.*` and `check()` are equivalent at runtime — `check()` is a readability choice, not a different execution model.

## Production-ready from day one

assertcheck runs in every environment with zero setup. Assertions always throw on failure — no configuration, no modes, no entry-point calls. Import and use.

```ts
import { assert } from "assertcheck"
// That's it. Every assertion always throws on failure.
```

## Next steps

<Links :items="nextSteps" :grid="2" />
