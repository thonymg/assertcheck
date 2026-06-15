---
layout: home

hero:
  name: "AssertCheck"
  text: "Define what your code must never accept."
  tagline: Production-grade assertion library for TypeScript. Explicit contracts, fail-fast execution, richly formatted errors — zero overhead when silent.
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: Why AssertCheck?
      link: /guide/negative-space
    - theme: alt
      text: API reference
      link: /api/index

features:
  - title: Negative Space Programming
    details: Assertions define the invalid states your code must never see — making contracts explicit, executable, and impossible to ignore. The boundary between valid and invalid is the most important line you write.
    link: /guide/negative-space
    linkText: Learn the principle
  - title: Fail-fast, always
    details: Violations fire at their origin, not three layers later. Every assertion always throws — no configuration, no silent modes, no surprises.
  - title: Richly formatted errors
    details: ELM-inspired output with diffs, labels, and notes. ANSI colours on TTY, plain text in pipes and CI, collapsible groups in browser DevTools. Respects NO_COLOR.
  - title: Chainable API
    details: check(value).noNils().uniqueBy("id").all(u => u.active) — fluent, readable, type-safe. Declare all invariants on a value in one place.
  - title: Zero setup
    details: Import and use — no configuration files, no entry-point calls, no mode system. Assertions always throw on failure, in every environment.
---

<div class="vp-doc" style="max-width:960px;margin:0 auto;padding:3rem 1.5rem 0">

## TypeScript types vanish at runtime. Assertions don't.

Static types are a compile-time promise. At runtime, that promise is gone.
Every `null` you thought was impossible, every shape you assumed was enforced — they all arrive anyway.
The standard response is defensive code: `if (!x) return`. Silent. Invisible. The bug propagates.

AssertCheck replaces that with a **contract system**: declare what must never happen, fire exactly where it happens, and surface exactly what went wrong.

::: code-group

```ts [Without AssertCheck — silent failures]
function chargeOrder(order: Order) {
  if (!order) return                       // absorbed — caller gets undefined, no trace
  if (!order.amount) return               // absorbed — negative amounts silently pass
  if (order.status !== "pending") return  // absorbed — double-charge possible

  // Three broken assumptions. None of them surfaced. Ever.
}
```

```ts [With AssertCheck — explicit contracts]
function chargeOrder(order: Order) {
  assert.notNil(order, "order is required")
  assert.positive(order.amount, "order amount must be positive")
  assert.equal(order.status, "pending", {
    msg:    "order must be pending before charge",
    actual: "order.status",
    note:   "call resetOrder() before retrying",
  })

  // Every precondition is named, enforced, and traceable.
}
```

:::

---

## What a failure actually looks like

When `order.status` is `"paid"` instead of `"pending"`, you get a formatted diagnostic — not a cryptic stack trace.

```
══════════════════ ● order must be pending before charge ══════

── values ──────────────────────────────────────────────────────
  + expected        "pending"
  ✗ order.status    "paid"

── note ────────────────────────────────────────────────────────
  call resetOrder() before retrying

════════════════════════════════════════════════════════════════
```

Exact location. Exact values. Exact next step. No debugger, no guessing, no context-switching.

Deep equality failures go further — a field-by-field structural diff:

```
══════════════════ ● User shape mismatch ══════════════════════

── diff ────────────────────────────────────────────────────────
  ·  id           "usr_123"
  ~  status
       expected   "active"
       actual     "banned"
  +  role         "admin"   ← missing in actual

════════════════════════════════════════════════════════════════
```

Output adapts automatically: ANSI on TTY, plain text in CI, `console.groupCollapsed` in the browser.

---

## Why not Zod? Why not if/return?

| | `if/return` | `node:assert` | `zod` / `yup` | **assertcheck** |
|---|:---:|:---:|:---:|:---:|
| Fails loudly in dev | — | Yes | Yes | Yes |
| Zero overhead in prod | — | — | — | Yes (`disabled` mode) |
| Type narrowing | — | — | Yes | Yes |
| Structured, readable errors | — | Partial | Partial | Yes |
| Chainable fluent API | — | — | — | Yes |
| Enforces function invariants | — | — | — | Yes |
| AI Copilot skills included | — | — | — | Yes |

Zod and Yup are schema validators — they validate data that comes in from the outside (forms, APIs, JSON). AssertCheck is a **contract system** — it enforces invariants at every internal boundary: function arguments, state transitions, external responses, collection shapes. The two are complementary, not competing.

---

## 50+ assertions. One consistent pattern.

Every assertion accepts an optional `opts` parameter with a message, an actual-value label, and a hint for the developer.

```ts
import { assert, check } from "assertcheck"

// Existence & type guards
assert.notNil(user, "user is required")
assert.string(userId, "userId must be a string")
assert.positive(price, "price must be positive")

// Deep equality with structural diff
assert.deepEqual(result, expected, "API response shape changed")

// Chainable invariants on collections
check(orders)
  .notEmpty("cart must not be empty before checkout")
  .noNils("no null order items allowed")
  .all(o => o.amount > 0, "all orders must have a positive amount")
  .uniqueBy("id", "duplicate order IDs detected")

// Object shape guards
check(config)
  .hasKeys(["host", "port", "database"], "missing required config keys")
  .dig("database.pool.max", 10, "pool size must be at least 10")
```

50+ methods covering existence, types, numerics, equality, arrays, objects, and function purity.

---

## Works across the entire TypeScript ecosystem

No configuration. No polyfills. No runtime dependencies beyond `lodash`.

- **Node.js 18+** — full ANSI output on TTY
- **Bun 1+** — native, tested first
- **Deno / JSR** — `deno add jsr:assertcheck`
- **Browser** — DevTools-friendly `console.groupCollapsed` output
- **Edge runtimes** — no Node.js APIs required

---

## Built by Vagabond Studio

AssertCheck is maintained by **[Vagabond Studio](https://vagabond.work)** — a fully remote, senior-only collective of engineers and designers.

We build TypeScript, Vue.js, Rails, and Django products from greenfield to production. AssertCheck is how we guard every internal boundary in every service we ship.

[Book a discovery call](https://calendly.com/vagabond-studio/appel-de-decouverte-vagabond-studio) · [hello@vagabond.work](mailto:hello@vagabond.work)

</div>
