# Assertcheck

> **Negative Space Programming for TypeScript.**  
> Declare what cannot exist. Fail where it matters. Ship with confidence.

[![npm](https://img.shields.io/npm/v/assertcheck?color=0ea5e9&label=npm)](https://www.npmjs.com/package/assertcheck)
[![JSR](https://jsr.io/badges/assertcheck)](https://jsr.io/assertcheck)
[![License](https://img.shields.io/badge/license-Apache_2.0-orange)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-first-3178c6)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-ready-fbf0df)](https://bun.sh/)
[![Documentation](https://img.shields.io/badge/docs-thonymg.github.io-blue)](https://thonymg.github.io/assertcheck/)

---

## The problem with "defensive" code

Most TypeScript codebases hide bugs behind `if (!x) return`.  
Silent failures. No trace. No context. Hours lost in production.

```ts
// ❌ Before — bad data propagates in silence
function chargeOrder(order: Order) {
  if (!order || !order.amount) return  // swallowed. never caught. never debugged.
}
```

```ts
// ✅ After — invalid state is declared at the boundary
function chargeOrder(order: Order) {
  assert.notNil(order, "order is required")
  assert.positive(order.amount, "order amount must be positive")
  assert.equal(order.status, "pending", {
    msg:    "order must be pending before charge",
    actual: "order.status",
    note:   "call resetOrder() before retrying",
  })
  // from here: every assumption is verified, every invariant is explicit
}
```

**Assertcheck makes invalid states impossible to ignore.**  
Not a validator. Not a schema library. A contract system — at every boundary, for every assumption.

---

## Why Assertcheck?

| | `if/return` | `zod` / `yup` | **Assertcheck** |
|---|---|---|---|
| Fails loudly in dev | ❌ | ✅ | ✅ |
| Zero overhead in prod | ❌ | ❌ | ✅ (`disabled` mode) |
| Type narrowing | ❌ | ✅ | ✅ |
| Structured, readable errors | ❌ | ⚠️ | ✅ |
| Chainable fluent API | ❌ | ❌ | ✅ |
| Works on functions/purity | ❌ | ❌ | ✅ |
| AI Copilot skills included | ❌ | ❌ | ✅ |

---

## Install

```bash
# npm / yarn / pnpm
npm install assertcheck
yarn add assertcheck
pnpm add assertcheck

# Bun
bun add assertcheck

# Deno / JSR
deno add jsr:assertcheck
bunx jsr add assertcheck
```

---

## Quick start

### Single assertions

```ts
import { assert } from "assertcheck"

assert.notNil(user, "user is required")
assert.equal(order.status, "pending", {
  msg:    "order must be pending before payment",
  actual: "order.status",
  note:   "call resetOrder() first",
})
```

### Fluent chains

```ts
import { check } from "assertcheck"

check(users)
  .notEmpty("users list cannot be empty")
  .noNils("no null users allowed")
  .uniqueBy("id", "duplicate user IDs detected")
  .all(u => u.active, "all users must be active")
  .sortedBy("createdAt")
```

---

## Error output that actually helps

When an assertion fires, you get a precise, ELM-inspired diagnostic — not a 40-line stack trace.

```
══════════════════ ● Order status mismatch ════════════════════

── values ──────────────────────────────────────────────────────
  + expected        "pending"
  ✗ order.status    "paid"

── note ────────────────────────────────────────────────────────
  call resetOrder() before retrying

════════════════════════════════════════════════════════════════
```

Deep equality failures include a structural diff, field by field:

```
══════════════════ ● Deep equality failed ═════════════════════

── diff ────────────────────────────────────────────────────────
  ·  id           "usr_123"
  ~  status
       expected   "active"
       actual     "banned"
  +  role         "admin"   ← missing

════════════════════════════════════════════════════════════════
```

Output adapts automatically:
- **Node / Bun / Deno** — ANSI colours on TTY, plain text in pipes. Respects `NO_COLOR`.
- **Browser** — collapsible `console.groupCollapsed` in DevTools.
- **CI** — clean plain text, no escape codes.

---

## Modes — no code changes between environments

```ts
import { setAssertMode } from "assertcheck"

setAssertMode("disabled") // production: zero overhead, no-op
setAssertMode("warn")     // staging: log without crashing
setAssertMode("enabled")  // dev: full enforcement (default)
```

| Mode | Behaviour | Default when |
|---|---|---|
| `"disabled"` | No-op — zero overhead | `NODE_ENV=production` |
| `"warn"` | Log only, no throw | Manual |
| `"enabled"` | Log + throw | All other environments |

---

## Full API

### Existence
| | |
|---|---|
| `assert.nil(v)` | Must be `null` or `undefined` |
| `assert.notNil(v)` | Must not be `null` or `undefined` — narrows to `NonNullable<T>` |
| `assert.empty(v)` | Must be empty (string / array / object / Map / Set) |
| `assert.notEmpty(v)` | Must not be empty |

### Type guards
| | Narrows to |
|---|---|
| `assert.string(v)` | `string` |
| `assert.number(v)` | `number` |
| `assert.integer(v)` | `number` (integer) |
| `assert.finite(v)` | `number` (finite) |
| `assert.boolean(v)` | `boolean` |
| `assert.array<T>(v)` | `T[]` |
| `assert.object<T>(v)` | `T` |
| `assert.func<T>(v)` | `T` |
| `assert.instanceOf(v, Ctor)` | `Ctor instance` |

### Equality
| | |
|---|---|
| `assert.equal(a, b)` | Strict `===` |
| `assert.deepEqual(a, b)` | Deep equality with structural diff |

### Numerics
`positive` · `negative` · `zero` · `greater` · `greaterOrEqual` · `less` · `lessOrEqual` · `withinRange` · `inDelta`

### Arrays _(Ruby-inspired)_
`len` · `longerThan` · `shorterThan` · `includes` · `all` · `any` · `none` · `one` · `count` · `containsAll` · `containsNone` · `elementsMatch` · `subset` · `unique` · `uniqueBy` · `increasing` · `nonDecreasing` · `sortedBy` · `first` · `last` · `sumBy` · `noNils` · `flat` · `allInstanceOf` · `zippedWith` · `groupedBy` · `partition`

### Objects _(Ruby Hash-inspired)_
`hasKey` · `hasKeys` · `hasExactKeys` · `hasOnlyKeys` · `hasValue` · `containsSubset` · `allValuesMatch` · `noNilValues` · `dig`

### Functions _(mathematical properties)_
`returns` · `pure` · `idempotent` · `arity` · `mapsDistinct` · `homomorphic`

### Negation

`assert.not(fn, ...args)` — the only negation API. Wraps any assertion.

```ts
assert.not(assert.equal, user.role, "admin")
assert.not(assert.includes, errors, "FATAL")
assert.not(assert.hasKey, patch, "id")
```

---

## Chainable API

```ts
import { check } from "assertcheck"

// Arrays
check(users)
  .notEmpty()
  .noNils()
  .uniqueBy("id")
  .all(u => u.active)
  .sortedBy("createdAt")
  .len(10)

// Objects
check(config)
  .hasKeys(["host", "port"])
  .noNilValues()
  .dig("database.pool.max", 10)
```

---

## AssertionError

```ts
import { assert, AssertionError } from "assertcheck"

try {
  assert.equal(order.status, "pending")
} catch (err) {
  if (err instanceof AssertionError) {
    err.assertion // "equal"
    err.actual    // "paid"
    err.expected  // "pending"
  }
}
```

---

## AI Skills — Copilot-native from day one

Assertcheck ships with [Copilot skills](https://github.com/thonymg/assertcheck/tree/main/skills) so your AI assistant understands and applies the library's patterns automatically.

| Skill | What it does |
|---|---|
| `assertcheck-audit` | Audits existing code for missing or weak assertions |
| `assertcheck-feature` | Designs a new assertion following the library's contracts |
| `assertcheck-refactor` | Refactors code toward negative-space programming |
| `assertcheck-selector` | Selects the right assertion for a given scenario |
| `assertcheck-spec` | Writes invariant-driven specs |

```bash
# Install all skills
bunx skills add thonymg/assertcheck --skill='*'
npx skills add thonymg/assertcheck --skill='*'

# Or globally
bunx skills add thonymg/assertcheck --skill='*' -g
```

Learn more at [vercel-labs/skills](https://github.com/vercel-labs/skills).

---

## Project structure

```
src/
  index.ts    — barrel export
  types.ts    — shared types and interfaces
  env.ts      — runtime detection (Node / Bun / Deno / browser)
  mode.ts     — AssertMode state management
  error.ts    — AssertionError class
  format.ts   — ANSI/browser formatter, diff engine, block builder
  fail.ts     — internal fail() dispatcher
  assert.ts   — all assertion functions
  checker.ts  — chainable wrapper (check())
tests/
  assert.test.ts
```

---

## Build

```bash
bun run build      # compile to ./dist
bun run typecheck  # tsc --noEmit
bun test           # run test suite
```

---

## License

Apache License 2.0 — free to use, modify, and distribute commercially as long as you retain attribution. See [LICENSE](./LICENSE).

---

## Built by Vagabond Studio

---

### You have ambitions. You need a team that can match them.

**[Vagabond Studio](mailto:hello@vagabond.work)** partners with small and mid-size companies that think bigger than their headcount.

We're a fully remote, senior-only collective — engineers *and* designers working together from day one. No handoffs. No agency bloat.

**What we do:**

- **Product engineering** — TypeScript, VueJs, Rails, Django full-stack. From greenfield to production, or embedded in your existing codebase.
- **UI/UX design** — Interfaces that are fast to ship and fast to use. We design systems, not just screens.
- **Technical leadership** — Architecture decisions, code reviews, and the kind of senior judgment that prevents six-month rewrites.

**Who we work with:**

Growing companies between 5 and 200 people who need craft-level output without building a full in-house team. Startups shipping their first real product. Scale-ups that have outgrown their MVP and need the codebase to match their ambitions.

**How we work:**

Embedded in your stack. On your timeline. Fully async-first, with structured sync when it matters. We don't disappear after delivery — we stay until it ships right.

---

**Ready to talk?**

[**→ Book a discovery call**](https://calendly.com/vagabond-studio/appel-de-decouverte-vagabond-studio) — 30 minutes, no pitch, just a real conversation about your project.

Or write to us directly: [hello@vagabond.work](mailto:hello@vagabond.work)

*We take on 2–3 new clients per quarter. If the timing is right, let's talk.*
