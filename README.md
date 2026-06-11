# Assertcheck

**Negative Space Programming for TypeScript.**  
Declare what cannot exist. Fail where it matters. Ship with confidence.

[![npm](https://img.shields.io/npm/v/assertcheck?color=0ea5e9&label=npm)](https://www.npmjs.com/package/assertcheck)
[![JSR](https://jsr.io/badges/assertcheck)](https://jsr.io/assertcheck)
[![License](https://img.shields.io/badge/license-Apache_2.0-orange)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-first-3178c6)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-ready-fbf0df)](https://bun.sh/)

---

## The idea

In visual art, **negative space** is what surrounds the subject — the void that gives it shape.

In code, negative space is the set of invalid states your program should never reach.  
Most code silently absorbs them. Assertcheck makes them impossible to ignore.

```ts
// Before — bad data propagates in silence
function chargeOrder(order: Order) {
  if (!order || !order.amount) return // swallowed, never caught
}

// After — invalid state is declared at the boundary
function chargeOrder(order: Order) {
  assert.notNil(order, "order is required")
  assert.positive(order.amount, "order amount must be positive")
  assert.equal(order.status, "pending", {
    msg:    "order must be pending before charge",
    actual: "order.status",
    note:   "call resetOrder() before retrying",
  })
  // from here: every assumption is verified
}
```

Assertions are **living contracts** — executable, unforgeable, and impossible to go stale.  
When one fires, it names the broken assumption at the exact location it was violated.

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

```ts
import { assert, check, setAssertMode } from "assertcheck"

// Single assertion
assert.equal(order.status, "pending", {
  msg:    "order must be pending before payment",
  actual: "order.status",
  note:   "call resetOrder() first",
})

// Fluent chain
check(users)
  .notEmpty("users list cannot be empty")
  .noNils("no null users allowed")
  .uniqueBy("id", "duplicate user IDs detected")
  .all(u => u.active, "all users must be active")
  .sortedBy("createdAt")
```

---

## Modes

Control the behaviour per environment — no code changes required.

| Mode | Behaviour | Default when |
|---|---|---|
| `"disabled"` | No-op — zero overhead | `NODE_ENV=production` |
| `"warn"` | Log only, no throw | Manual |
| `"enabled"` | Log + throw | All other environments |

```ts
import { setAssertMode } from "assertcheck"

setAssertMode("disabled") // silence everything
setAssertMode("warn")     // observe without crashing
setAssertMode("enabled")  // full enforcement
```

---

## Error output

Failures produce structured, ELM-inspired diagnostics — not stack-trace noise.

```
══════════════════ ● Order status mismatch ════════════════════

── values ──────────────────────────────────────────────────────
  + expected        "pending"
  ✗ order.status    "paid"

── note ────────────────────────────────────────────────────────
  call resetOrder() before retrying

════════════════════════════════════════════════════════════════
```

Deep equality failures include a precise structural diff:

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

Output adapts to the runtime automatically:
- **Node / Bun / Deno** — ANSI colours on TTY, plain text in pipes. Respects `NO_COLOR`.
- **Browser** — collapsible `console.groupCollapsed` in DevTools.
- **CI / piped** — clean plain text, no escape codes.

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
| `assert.deepEqual(a, b)` | Deep equality via `_.isEqual`, with diff |

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

Licensed under the **Apache License 2.0** — free to use, modify, and distribute in any context, commercial or otherwise, as long as you retain attribution. See [LICENSE](./LICENSE).

---

## Built by Vagabond Studio

Assertcheck is crafted and maintained by **Vagabond Studio** — a fully remote, senior-only development collective building high-quality TypeScript, Rails, and full-stack products for companies that care about craft.

**Looking for a team?**  
Whether you need to ship a product from scratch, reinforce an existing team, or bring technical leadership to a complex project — we work embedded in your stack, on your timeline, fully remote.

→ [amichel@getmeelo.com](mailto:amichel@getmeelo.com)
