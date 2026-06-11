<script setup>
const setups = [
  {
    name: 'Web API (Express / Fastify / Hono)',
    desc: 'Log violations in production without crashing requests. Let your observability platform surface assertion failures as non-fatal events.',
    icon: 'ri:server-line',
  },
  {
    name: 'CLI tool',
    desc: 'Disable assertions in production binaries. Your contracts are validated during development and CI — trust them at runtime.',
    icon: 'ri:terminal-line',
  },
  {
    name: 'Next.js / full-stack app',
    desc: 'Warn on the server in production. On the client, disabled mode avoids any output in the browser console.',
    icon: 'ri:layout-grid-line',
  },
  {
    name: 'Test suite',
    desc: 'Always run in "enabled" mode during tests. Assertions in test code are contracts too — they should throw on violation.',
    icon: 'ri:test-tube-line',
  },
]
</script>

# Assertion modes

assertcheck has three modes that control what happens when an assertion fails. Understanding modes is the key to using assertcheck effectively across all environments — without ever changing your assertion code.

::: info One call. Every module inherits it.
Mode is a single global value. One call to `modeAssertIn()` at your app entry point affects every assertion in the process. Configure once. All modules inherit the setting automatically.
:::

---

## The three modes

| Mode | On failure | When to use |
|---|---|---|
| `"enabled"` | Log + throw `AssertionError` | Development, CI, test suites, strict production |
| `"warn"` | Log only — no throw | Production observability without crashing users |
| `"disabled"` | No-op — zero overhead | High-performance production paths, CLI binaries |

### `"enabled"` — full enforcement

Every violation throws an `AssertionError` with a formatted error block. Execution stops at the assertion. This is the default in every environment — you don't need to configure anything to get started.

```ts
import { assert } from "assertcheck"

assert.notNil(userId, "userId is required")
// If userId is null → throws AssertionError immediately
```

### `"warn"` — observability without crashing

Violations are logged to `console.warn` (or your configured logger), but execution continues. Use this in production to surface assertion failures without impacting uptime.

```ts
modeAssertIn("prod", "warn")
// Violations are logged to your observability platform, not thrown
```

This is the most common production configuration. You get visibility into invariant violations in production — the things that *should never happen* but occasionally do — without risking downtime.

### `"disabled"` — zero overhead

Every assertion is a no-op. No string formatting, no object allocation, no conditional logic. Assertions compile away. Use this when your contracts are fully trusted and performance is critical.

---

## Setup: one call at your entry point

Call `modeAssertIn()` **once**, at the very start of your application, before any assertions are evaluated:

```ts
import { modeAssertIn } from "assertcheck"

modeAssertIn("prod", "warn")     // warn in production
modeAssertIn("staging", "warn")  // same for staging
modeAssertIn("ci", "enabled")    // full enforcement in CI
```

`modeAssertIn` reads `NODE_ENV` at call time. Only the call matching the current environment takes effect. You can stack multiple calls for different environments — they're all evaluated, only the matching one applies.

::: warning Call order matters
If you call `modeAssertIn("prod", "warn")` and then `modeAssertIn("prod", "disabled")`, the last one wins. For the same environment label, last write wins.
:::

**Environment label reference:**

| Label | Matches `NODE_ENV` |
|---|---|
| `"prod"` | `"production"`, `"prod"` |
| `"dev"` | `"development"`, `"dev"` |
| `"test"` | `"test"` |
| `"staging"` | `"staging"`, `"stage"` |
| `"ci"` | `"ci"` |

---

## Manual control for tests and benchmarks

```ts
import { setAssertMode, getAssertMode } from "assertcheck"

const saved = getAssertMode()
setAssertMode("disabled")

// run code that must not assert (e.g. a benchmark)

setAssertMode(saved) // always restore — this pattern is safe even on throw
```

---

## Recommended setups

<Card :items="setups" :grid="2" />

### Web API (Express / Fastify / Hono)

```ts
// src/app.ts — entry point
import { modeAssertIn } from "assertcheck"

modeAssertIn("prod", "warn")     // violations are logged, not thrown
modeAssertIn("staging", "warn")  // same for staging — surface issues before they hit prod
```

### CLI tool

```ts
// bin/cli.ts — entry point
import { modeAssertIn } from "assertcheck"

modeAssertIn("prod", "disabled") // contracts are trusted in release builds
```

### Next.js / full-stack app

```ts
// instrumentation.ts (Next.js 14+) or _app.ts
import { modeAssertIn } from "assertcheck"

modeAssertIn("prod", "warn")     // server: log violations without crashing requests
```

### Always-enabled setup (strict mode)

Some teams choose to always run `"enabled"` — even in production. This is valid for internal services where crashes are acceptable and full traceability is preferred over uptime.

```ts
// No call needed — "enabled" is the unconditional default
```

---

## Mode does not change your assertion code

The key design principle: **your assertion code is identical across all environments**. You write the contract once. The mode determines what happens when it fires.

```ts
// This code is the same in development, staging, and production
function processPayment(payment: Payment) {
  assert.notNil(payment, "payment is required")
  assert.positive(payment.amount, "amount must be positive")
}
```

In dev: fires immediately with a formatted error.  
In prod with `"warn"`: logs a warning, continues.  
In prod with `"disabled"`: the two lines cost nothing at all.
