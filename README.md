# AssertCheck

> **Negative Space Programming for TypeScript.**
> Declare what cannot exist. Fail where it matters. Ship with confidence.

[![npm](https://img.shields.io/npm/v/assertcheck?color=0ea5e9&label=npm)](https://www.npmjs.com/package/assertcheck)
[![JSR](https://jsr.io/badges/@thonymg/assertcheck)](https://jsr.io/@thonymg/assertcheck)
[![License](https://img.shields.io/badge/license-Apache_2.0-orange)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-first-3178c6)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-ready-fbf0df)](https://bun.sh/)
[![Documentation](https://img.shields.io/badge/docs-thonymg.github.io-blue)](https://thonymg.github.io/assertcheck/)

---

## The problem with "defensive" code

Most TypeScript codebases hide bugs behind `if (!x) return`.
Silent failures. No trace. No context. Hours lost in production.

```ts
// Before — bad data propagates in silence
function chargeOrder(order: Order) {
  if (!order || !order.amount) return // swallowed, never caught, never debugged
}
```

```ts
// After — invalid state is declared at the boundary
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

**AssertCheck makes invalid states impossible to ignore.**
Not a validator. Not a schema library. A contract system — at every boundary, for every assumption.

Assertions are **always enabled**. There is no mode system, no `NODE_ENV` switch, no configuration. Every failure prints a formatted diagnostic and throws an `AssertionError`.

---

## Why AssertCheck?

| | `if/return` | `node:assert` | `zod` / `yup` | **AssertCheck** |
|---|:---:|:---:|:---:|:---:|
| Fails loudly | No | Yes | Yes | Yes |
| Type narrowing | No | Partial | Yes | Yes |
| Structured, readable errors | No | Partial | Partial | Yes |
| Structural diff on deep equality | No | Partial | No | Yes |
| Chainable fluent API | No | No | No | Yes |
| Async assertions (`rejects` / `resolves`) | No | Yes | No | Yes |
| Function properties (purity, idempotence) | No | No | No | Yes |
| AI skills included | No | No | No | Yes |

Zod and Yup validate data crossing the outside boundary (forms, APIs, JSON). AssertCheck enforces invariants at every **internal** boundary: function arguments, state transitions, external responses, collection shapes. They complement each other.

---

## Install

```bash
# npm / yarn / pnpm / bun
npm install assertcheck
yarn add assertcheck
pnpm add assertcheck
bun add assertcheck

# JSR (Deno / Bun / npm)
deno add jsr:@thonymg/assertcheck
bunx jsr add @thonymg/assertcheck
npx jsr add @thonymg/assertcheck
```

Requirements: Node.js 18+, Bun 1+, or Deno 1.38+. TypeScript 5+. `lodash` is a regular dependency and is installed automatically.

When installed from JSR, import from `@thonymg/assertcheck` instead of `assertcheck`.

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

Every assertion takes an optional last argument: a plain string (the message) or an options object with `msg`, `actual` (label for the received value) and `note` (what the caller should do).

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

### Async

```ts
const user = await assert.resolvesNotNil(db.users.findById(id), "user must exist")

await assert.rejects(() => api.charge(expiredCard), PaymentError, "expired card must be rejected")
await assert.rejectsMatching(api.pay(order), /insufficient funds/)
```

Async assertions accept a `Promise` or a zero-arg thunk `() => Promise`. Use the thunk when the callee may throw synchronously before returning a promise.

---

## Error output that actually helps

When an assertion fires, you get a precise, ELM-inspired diagnostic — not a 40-line stack trace.

```
══════════════════ ● order must be pending before charge ══════

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
- **Node / Bun / Deno** — ANSI colours on a TTY, plain text in pipes and CI. Respects `NO_COLOR`.
- **Browser** — collapsible `console.groupCollapsed` in DevTools.

The stack trace is trimmed so the first frame points at your call site, not inside the library.

---

## Full API

Every function is available as `assert.<name>(...)`. The last parameter is always `opts?: string | AssertOptions`.

### Existence

| | |
|---|---|
| `nil(v)` | Must be `null` or `undefined` |
| `notNil(v)` | Must not be `null` or `undefined` — narrows to `NonNullable<T>` |
| `empty(v)` | Must be empty (string / array / object / Map / Set) |
| `notEmpty(v)` | Must not be empty — narrows to `NonNullable<T>` |

### Type guards

| | Narrows to |
|---|---|
| `string(v)` | `string` |
| `number(v)` | `number` |
| `integer(v)` | `number` (integer) |
| `finite(v)` | `number` (finite) |
| `boolean(v)` | `boolean` |
| `array<T>(v)` | `T[]` |
| `object<T>(v)` | `T` |
| `func<T>(v)` | `T` |
| `instanceOf(v, Ctor)` | instance of `Ctor` |

### Equality

| | |
|---|---|
| `equal(actual, expected)` | Strict `===` |
| `deepEqual(actual, expected)` | Deep equality with structural diff |

### Numerics

`positive(n)` · `negative(n)` · `zero(n)` · `greater(a, b)` · `greaterOrEqual(a, b)` · `less(a, b)` · `lessOrEqual(a, b)` · `withinRange(v, min, max)` · `inDelta(actual, expected, delta)`

### Arrays _(Ruby-inspired)_

| | |
|---|---|
| `len(arr, n)` · `longerThan(arr, n)` · `shorterThan(arr, n)` | Length |
| `includes(arr, item)` · `containsAll(arr, items)` · `containsNone(arr, items)` · `subset(arr, sub)` | Membership |
| `all(arr, pred)` · `any(arr, pred)` · `none(arr, pred)` · `one(arr, pred)` · `count(arr, pred, n)` | Predicates — `all` narrows with a type guard |
| `elementsMatch(a, b)` | Same elements, any order |
| `unique(arr)` · `uniqueBy(arr, key)` | Uniqueness |
| `increasing(arr)` · `nonDecreasing(arr)` · `sortedBy(arr, key)` | Ordering |
| `first(arr, expected)` · `last(arr, expected)` | Boundary elements |
| `sumBy(arr, key, expected)` | Aggregation |
| `noNils(arr)` · `flat(arr)` · `allInstanceOf(arr, Ctor)` | Shape — `noNils` and `allInstanceOf` narrow |
| `zippedWith(a, b, pred)` · `groupedBy(arr, key, groups)` · `partition(arr, pred, nMatch, nRest)` | Structure |

### Objects _(Ruby Hash-inspired)_

| | |
|---|---|
| `hasKey(obj, key)` · `hasKeys(obj, keys)` | Required keys — narrow to `T & Record<K, unknown>` |
| `hasExactKeys(obj, keys)` · `hasOnlyKeys(obj, allowed)` | Exact / allowed key set |
| `hasValue(obj, key, expected)` | Key holds the expected value |
| `containsSubset(obj, subset)` | Partial deep match |
| `allValuesMatch(obj, pred)` · `noNilValues(obj)` | Value constraints |
| `dig(obj, "a.b.c", expected)` | Nested path equals expected value |

### Functions _(mathematical properties)_

| | |
|---|---|
| `returns(fn, args, expected)` | `fn(...args)` deep-equals `expected` |
| `pure(fn, args)` | Same output on repeated calls, arguments untouched |
| `idempotent(fn, arg)` | `fn(fn(x)) === fn(x)` |
| `arity(fn, n)` | Declared parameter count |
| `mapsDistinct(fn, inputs)` | Distinct inputs give distinct outputs |
| `homomorphic(fn, a, b, op)` | `fn(op(a, b)) === op(fn(a), fn(b))` |

### Async _(Promise or thunk)_

| | |
|---|---|
| `rejects(p)` · `rejects(p, ErrorCtor)` | Rejects, optionally with an instance of `ErrorCtor` |
| `rejectsWithMessage(p, msg)` | Rejection message equals `msg` |
| `rejectsMatching(p, /re/)` | Rejection message matches the pattern |
| `rejectsSatisfying(p, pred)` | Rejection value satisfies the predicate |
| `resolves(p)` | Resolves — returns the value |
| `resolvesWith(p, expected)` | Resolves to a deep-equal value |
| `resolvesSatisfying(p, pred)` | Resolved value satisfies the predicate |
| `resolvesNotNil(p)` | Resolves to a non-nil value — returns `NonNullable<T>` |

### Negation

`assert.not(fn, ...args)` is the only negation API. It passes when the wrapped assertion would throw, and works with built-in and custom assertions alike.

```ts
assert.not(assert.equal, user.role, "admin")
assert.not(assert.includes, errors, "FATAL")
assert.not(assert.hasKey, patch, "id")
```

---

## Chainable API

`check(value)` returns an `ArrayChecker` for arrays, an `ObjectChecker` for plain objects, and a bare `Checker` for anything else. Each method calls the matching `assert.*` and returns `this`, so the chain stops at the first failure.

```ts
import { check } from "assertcheck"

// Arrays
check(users)
  .notEmpty()
  .noNils()            // narrows the rest of the chain to NonNullable<T>[]
  .uniqueBy("id")
  .all(u => u.active)
  .sortedBy("createdAt")
  .len(10)

// Objects
check(config)
  .hasKeys(["host", "port"])
  .noNilValues()
  .dig("database.pool.max", 10)

// Any value — tap for side effects mid-chain
check(orders)
  .tap(v => console.log("orders:", v.length))
  .all(o => o.status === "paid")
```

Array methods: `notEmpty` · `len` · `longerThan` · `shorterThan` · `includes` · `all` · `any` · `none` · `one` · `count` · `unique` · `uniqueBy` · `noNils` · `sortedBy` · `increasing` · `nonDecreasing` · `first` · `last` · `sumBy` · `subset` · `elementsMatch` · `containsAll` · `containsNone` · `flat` · `groupedBy` · `allInstanceOf` · `zippedWith` · `partition`

Object methods: `notEmpty` · `hasKey` · `hasKeys` · `hasExactKeys` · `hasOnlyKeys` · `deepEqual` · `containsSubset` · `noNilValues` · `allValuesMatch` · `dig`

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
    err.message   // the full formatted block
  }
}
```

---

## Custom assertions

The formatting primitives are exported so domain assertions look native: `buildBlock`, `fmtValue`, `diffObjects`, `color`, `output`, `parseOpts`.

```ts
import { AssertionError, buildBlock, color, fmtValue, output, parseOpts } from "assertcheck"
import type { AssertOptions } from "assertcheck"

export function assertOrderId(v: unknown, opts?: string | AssertOptions): asserts v is string {
  if (typeof v === "string" && /^ord_[a-z0-9]{16}$/.test(v)) return
  const o = parseOpts(opts)
  const message = buildBlock({
    assertion: "orderId",
    title: o.msg ?? "Invalid order ID",
    rows: [
      { label: "expected", value: "ord_<16 chars>", indicator: color.added("+") },
      { label: o.actual ?? "received", value: fmtValue(v), indicator: color.removed("✗") },
    ],
    note: o.note,
  })
  output(message)
  throw new AssertionError({ assertion: "orderId", message, actual: v, expected: "order ID" })
}
```

See the [custom assertions guide](https://thonymg.github.io/assertcheck/guide/custom-assertions) for the full walkthrough.

---

## AI Skills

AssertCheck ships with [AI skills](https://github.com/thonymg/assertcheck/tree/main/skills) so your coding assistant applies the library's patterns for you.

| Skill | What it does |
|---|---|
| `assertcheck-spec` | Writes the precondition / postcondition table before any implementation |
| `assertcheck-feature` | Builds a new function or service with its guard block first |
| `assertcheck-audit` | Scans existing code for unguarded boundaries and proposes assertions |
| `assertcheck-refactor` | Modifies code without silently dropping a safety check |
| `assertcheck-selector` | Picks the most specific `assert.*` for a given invariant |

```bash
# Install all skills in the current project
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
  index.ts      — public barrel export
  types.ts      — AssertOptions, AssertionErrorOptions, BlockDef, RowDef
  env.ts        — runtime detection (Node / Bun / Deno / browser, NO_COLOR)
  error.ts      — AssertionError
  format.ts     — block builder, value formatter, diff engine, ANSI / DevTools output
  fail.ts       — internal: output + throw
  assert.ts     — every assertion, sync and async
  checker.ts    — check(), Checker, ArrayChecker, ObjectChecker
tests/
  assert.test.ts       — sync assertions
  assert.deep.test.ts  — deepEqual and diff output
  async.test.ts        — rejects / resolves family
examples/
  ecommerce/    — services and tests using assertcheck end to end
skills/         — AI skills (one folder per skill, SKILL.md + references)
docs-src/       — VitePress site (guide, skills, generated API reference)
```

---

## Development

```bash
bun install
bun test               # test suite against src/
bun run test:dist      # same suite against the built dist/
bun run typecheck      # tsc --noEmit
bun run format         # prettier
bun run build          # bundle to ./dist
bun run docs:dev       # regenerate API docs (typedoc) and serve the site
bun run release        # interactive version bump, tag and publish (npm + JSR)
```

Pushing a `v*` tag triggers the publish workflow in `.github/workflows/publish.yml`.

---

## License

Apache License 2.0 — free to use, modify, and distribute commercially as long as you retain attribution. See [LICENSE](./LICENSE).

---

## Built by Vagabond Studio

**[Vagabond Studio](https://vagabond.work)** is a fully remote, senior-only collective of engineers and designers. We build TypeScript, Vue.js, Rails, and Django products from greenfield to production — and we stay until it ships right.

AssertCheck is one of the open-source tools we maintain as a demonstration of how we approach software: explicit contracts, zero defensive noise, and code that communicates intent at every boundary.

**What we do:**

- **Product engineering** — TypeScript, Vue.js, Rails, Django. Full-stack from greenfield to production, or embedded in your existing codebase.
- **UI/UX design** — Interfaces designed and engineered in the same team. No handoffs. No agency bloat.
- **Technical leadership** — Architecture decisions, code reviews, and the kind of senior judgment that prevents six-month rewrites.

**Who we work with:**

Growing companies between 5 and 200 people who need craft-level output without building a full in-house team. Startups shipping their first real product. Scale-ups that have outgrown their MVP and need the codebase to match their ambitions.

**[Book a discovery call](https://calendly.com/vagabond-studio/appel-de-decouverte-vagabond-studio)** — 30 minutes, no pitch, just a real conversation about your project.

Or reach us directly: [hello@vagabond.work](mailto:hello@vagabond.work)

_We take on 2–3 new clients per quarter._
