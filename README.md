# assertcheck

Negative Space Programming for TypeScript.  
Declare invalid states · Fail fast · Trust the boundary · Zero overhead when disabled.

---

## Negative Space Programming

assertcheck is built around the principle of **Negative Space Programming** — defining what your code *cannot accept* is just as important as defining what it does.

In visual art, negative space is the empty area around a subject that gives the subject its shape. In code, negative space is the set of **invalid states and broken assumptions** you make explicit, rather than leaving them as silent bugs.

Without assertions, bad data propagates silently:

```ts
function chargeOrder(order: Order) {
  if (!order || !order.amount) return // absorbed, never caught
  // ...
}
```

With assertcheck, you declare the negative space at the boundary:

```ts
function chargeOrder(order: Order) {
  assert.notNil(order, "order is required")
  assert.positive(order.amount, "order amount must be positive")
  assert.equal(order.status, "pending", {
    msg:    "order must be pending before charge",
    actual: "order.status",
    note:   "call resetOrder() before retrying",
  })
  // ...
}
```

Assertions are **living contracts**: executable, impossible to ignore, and impossible to go stale. When one fires, it names the broken assumption at the exact location it was violated — not three call-stack frames later.

---

## Install

```bash
# npm / yarn / pnpm
npm install @assertcheck/core lodash
yarn add @assertcheck/core lodash
pnpm add @assertcheck/core lodash

# Bun
bun add @assertcheck/core lodash

# JSR (Deno / Bun)
deno add jsr:@assertcheck/core
bunx jsr add @assertcheck/core
```

---

## Quick start

```ts
import { assert, check, setAssertMode } from "@assertcheck/core"

// Explicit mode — overrides auto-detection
setAssertMode("enabled")

// Standalone assertion
assert.equal(order.status, "pending", {
  msg:    "order must be pending before payment",
  actual: "order.status",
  note:   "call resetOrder() first",
})

// Chainable wrapper
check(users)
  .noNils("no null users allowed")
  .uniqueBy("id", "duplicate user IDs")
  .all(u => u.active, "all users must be active")
  .sortedBy("createdAt")
```

---

## Modes

| Mode         | Behaviour              | Default when            |
|--------------|------------------------|-------------------------|
| `"disabled"` | No-op — zero overhead  | `NODE_ENV=production`   |
| `"warn"`     | Log only, no throw     | Manual                  |
| `"enabled"`  | Log + throw            | All other environments  |

```ts
import { setAssertMode } from "@assertcheck/core"

setAssertMode("disabled") // silence everything
setAssertMode("warn")     // observe without crashing
setAssertMode("enabled")  // full enforcement
```

---

## Error output

Failures produce an ELM-inspired formatted block:

```
══════════════════ ● Order status mismatch ════════════════════

── values ──────────────────────────────────────────────────────
  + expected        "pending"
  ✗ order.status    "paid"

── note ────────────────────────────────────────────────────────
  call resetOrder() before retrying

════════════════════════════════════════════════════════════════
```

Deep equality failures include a structured diff:

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

Output adapts to the runtime:
- **Node.js / Bun / Deno** — ANSI colours on TTY, plain text in pipes. Respects `NO_COLOR`.
- **Browser** — collapsible `console.groupCollapsed` in DevTools.
- **Disabled / piped CI** — plain text, no escape codes.

---

## API overview

### Existence
| Function | Description |
|---|---|
| `assert.nil(v)` | Must be `null` or `undefined` |
| `assert.notNil(v)` | Must not be `null` or `undefined` — narrows to `NonNullable<T>` |
| `assert.empty(v)` | Must be empty (string / array / object / Map / Set) |
| `assert.notEmpty(v)` | Must not be empty |

### Type guards
| Function | Narrows to |
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
| Function | Description |
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
`assert.not(fn, ...args)` — the **only** negation API. Wraps any assertion.

```ts
assert.not(assert.equal, user.role, "admin")
assert.not(assert.includes, errors, "FATAL")
assert.not(assert.hasKey, patch, "id")
```

---

## Chainable API

```ts
import { check } from "@assertcheck/core"

// Arrays → ArrayChecker<T>
check(users)
  .notEmpty()
  .noNils()
  .uniqueBy("id")
  .all(u => u.active)
  .sortedBy("createdAt")
  .len(10)

// Objects → ObjectChecker<T>
check(config)
  .hasKeys(["host", "port"])
  .noNilValues()
  .dig("database.pool.max", 10)
```

---

## AssertionError

```ts
import { assert, AssertionError } from "@assertcheck/core"

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

## Build with Bun

```bash
bun run build      # compile to ./dist
bun run typecheck  # tsc --noEmit
bun test           # run test suite
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

## License

MIT
