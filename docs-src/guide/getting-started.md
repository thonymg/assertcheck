# Getting started

**assertcheck** is a production-grade assertion library for TypeScript. It gives you expressive, richly-formatted runtime assertions with zero configuration.

## Why assertcheck?

Most assertion libraries are designed for tests only. assertcheck is designed for **production code** — it runs in any environment (Node.js, Bun, Deno, browser), formats errors in a way that makes debugging fast, and lets you silence or soften assertions per-environment without changing your code.

::: tip Negative Space Programming
assertcheck is built around the principle of **Negative Space Programming**: define what your code *cannot accept*, not just what it should do. An assertion is a declaration of an invalid state that must never occur — not error handling, but a contract. [Learn the principle →](/guide/negative-space)
:::

The fail-fast consequence is immediate: instead of a null value propagating silently through five layers before causing an obscure crash, the assertion fires at the exact point where the invariant breaks:

```ts
// Without NSP — bad data propagates silently
function chargeOrder(order: Order) {
  if (!order || !order.amount) return // absorbed, not caught
  // ...
}

// With NSP — bad data is rejected at the boundary
function chargeOrder(order: Order) {
  assert.notNil(order, "order is required")
  assert.positive(order.amount, "order amount must be positive")
  // ...
}
```

A well-placed assertion is worth a hundred debugging sessions.

## Install

::: code-group

```sh [npm]
npm install @assertcheck/core lodash
```

```sh [yarn]
yarn add @assertcheck/core lodash
```

```sh [pnpm]
pnpm add @assertcheck/core lodash
```

```sh [bun]
bun add @assertcheck/core lodash
```

```sh [jsr]
deno add jsr:@assertcheck/core
bunx jsr add @assertcheck/core
```

:::

## Your first assertion

Every assertion accepts an optional last parameter — a plain string or an options object — that appears in the error message. This is the most important feature to use: **always describe what the value represents**, not just what it should be.

```ts
import { assert } from "@assertcheck/core"

// Without context — not very helpful on failure:
assert.equal(order.status, "pending")

// With context — tells you exactly what failed and why:
assert.equal(order.status, "pending", {
  msg:    "order must be pending before payment",
  actual: "order.status",             // labels the actual value in the output
  note:   "call resetOrder() first",  // hint for the developer
})
```

When this fails, you get a formatted error message in your terminal:

```
══════════════════ ● order must be pending before payment ═════

── values ──────────────────────────────────────────────────────
  + expected        "pending"
  ✗ order.status    "paid"

── note ────────────────────────────────────────────────────────
  call resetOrder() before retrying

════════════════════════════════════════════════════════════════
```

## Chainable style

Use `check()` for fluent, readable multi-step validation on a single value. Each step throws immediately on failure — the chain stops at the first violated assertion.

```ts
import { check } from "@assertcheck/core"

// Instead of writing:
assert.notEmpty(users, "no null users")
assert.noNils(users, "no null users")
assert.uniqueBy(users, "id", "duplicate user IDs detected")
assert.all(users, u => u.active, "all users must be active")

// Write this:
check(users)
  .notEmpty("users list must not be empty")
  .noNils("no null users")
  .uniqueBy("id", "duplicate user IDs detected")
  .all(u => u.active, "all users must be active")
  .sortedBy("createdAt")
```

Both styles are equivalent at runtime — `check()` is purely a readability choice.

## Next steps

- Learn about [assertion modes](/guide/modes) to control behaviour per environment.
- Understand the [error format](/guide/error-format) — how to read and interpret failures.
- Explore the [chainable API](/guide/check) for multi-step validation.
- Read how to [build custom assertions](/guide/custom-assertions) using the formatting primitives.
- Browse the full [API reference](/api/index) for every assertion method and its parameters.
