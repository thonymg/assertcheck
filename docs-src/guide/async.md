---
title: Async assertions
description: Runtime contracts for Promises — assert.rejects, assert.resolves, and more.
---

# Async assertions

assertcheck covers the full async surface of your codebase. Every sync assertion has a parallel async counterpart that speaks the same language — same error format, same `opts` API.

::: tip Same philosophy, async context
Async assertions are Jidoka for Promises: violations fire at the boundary where the contract is broken — not in the `.catch()` handler three calls later.
:::

---

## The `Awaitable<T>` input type

Every async assertion accepts either a **ready Promise** or a **zero-arg thunk** returning one:

```ts
type Awaitable<T> = Promise<T> | (() => Promise<T>)
```

**Why the thunk form?**

If a function throws synchronously before returning a Promise, passing its result directly means the error happens *before* the assertion runs:

```ts
// This crashes before assert.rejects sees anything
await assert.rejects(riskyFactory(null))
//                   ^ TypeError thrown here — assertion never called

// The thunk form captures synchronous throws too
await assert.rejects(() => riskyFactory(null))
//                   ^ assertion calls it internally — error is caught
```

Use the thunk form whenever the async operation might throw during argument setup or before the first `await`.

---

## Rejection assertions

### `assert.rejects` — any rejection, or typed

```ts
// Any rejection
await assert.rejects(
  processPayment(badOrder),
  "payment must reject for invalid orders"
)

// Typed rejection — verifies instanceof
await assert.rejects(
  processPayment(expiredCard),
  PaymentError,
  {
    msg:  "expired card must throw PaymentError",
    note: "check that the card validator runs before stripe.charge()",
  }
)

// Thunk form — captures sync throws during setup
await assert.rejects(
  () => stripe.charges.create(null as never),
  TypeError,
  "charge() must reject null params"
)
```

When the assertion fails, the error block shows what was resolved instead:

```
════════════════ ● expired card must throw PaymentError ═════════

── values ──────────────────────────────────────────────────────
  + expected        PaymentError
  ✗ received        NetworkError
    message         "connection timeout"

════════════════════════════════════════════════════════════════
```

---

### `assert.rejectsWithMessage` — exact message match

Use when the rejection message drives downstream logic (frontend copy, support triage, error codes):

```ts
await assert.rejectsWithMessage(
  chargeCard(insufficientFundsCard),
  "insufficient funds",
  {
    msg:  "decline reason must be exact for the UI",
    note: "the frontend reads this string to display the right copy",
  }
)
```

Works on any thrown value — `Error` instances and plain strings alike:

```ts
// Thrown string: Promise.reject("card expired")
await assert.rejectsWithMessage(legacyApi.pay(order), "card expired")
```

---

### `assert.rejectsMatching` — regex pattern match

Use when the message varies but must contain a recognisable pattern:

```ts
// Multiple valid failure reasons
await assert.rejectsMatching(
  processPayment(badCard),
  /card (expired|declined|invalid)/,
  "payment error must name the card failure reason"
)

// Dynamic content — the message includes runtime data
await assert.rejectsMatching(
  chargeCard({ number: "4242424242424242" }),
  /card ending in \d{4}/,
  "error must reference the card number for user clarity"
)
```

```
════════════ ● payment error must name the card failure reason ══

── values ──────────────────────────────────────────────────────
  + pattern         /card (expired|declined|invalid)/
  ✗ actual          "network timeout"

════════════════════════════════════════════════════════════════
```

---

### `assert.rejectsSatisfying` — custom predicate on the thrown value

Use when you need to inspect structured properties of the error — status codes, error codes, domain-specific fields:

```ts
// Assert a specific HTTP status code
await assert.rejectsSatisfying(
  api.get("/admin"),
  (err) => err instanceof ApiError && err.status === 403,
  {
    msg:  "unauthorized access must return 403",
    note: "check that the auth middleware runs before the route handler",
  }
)

// Assert a typed error code (legacy service throwing plain objects)
await assert.rejectsSatisfying(
  legacyPaymentService.charge(order),
  (err) =>
    typeof err === "object" &&
    err !== null &&
    (err as { code: string }).code === "CARD_DECLINED",
  "legacy service must throw { code: 'CARD_DECLINED' }"
)

// Assert multiple conditions on a rich error
await assert.rejectsSatisfying(
  rateLimitedApi.post("/orders"),
  (err) =>
    err instanceof ApiError &&
    err.status === 429 &&
    typeof err.retryAfter === "number" &&
    err.retryAfter > 0,
  {
    msg:  "rate limit must include retry-after for client backoff",
    note: "the client uses retryAfter to schedule the next attempt",
  }
)
```

---

## Resolution assertions

### `assert.resolves` — asserts and returns the value

The most common async assertion. It asserts that the promise resolves *and* returns the resolved value for inline use — no intermediate variable needed:

```ts
// Assert + use the value immediately — no separate try/catch
const user = await assert.resolves(
  fetchUser(id),
  { msg: "fetchUser must not throw", note: "check that id is a valid UUID" }
)
assert.notNil(user.email, "user must have an email")
assert.equal(user.role, "customer", "only customers are returned here")
```

Compare with the alternative:

```ts
// Without assertcheck — no context when it fails
const user = await fetchUser(id)  // throws? you get a raw stack trace

// Without assertcheck — verbose, no formatted error
let user: User
try {
  user = await fetchUser(id)
} catch (e) {
  throw new Error(`fetchUser failed: ${e}`)
}
```

When `fetchUser` rejects, the error block names the thrown value and its type:

```
══════════════════ ● fetchUser must not throw ══════════════════

── values ──────────────────────────────────────────────────────
  ✗ thrown          "User not found: usr_ghost"
    type            "UserNotFoundError"

── note ────────────────────────────────────────────────────────
  check that id is a valid UUID

════════════════════════════════════════════════════════════════
```

---

### `assert.resolvesWith` — asserts the resolved value

Asserts resolution *and* verifies the value with deep equality. On mismatch, produces a field-level diff:

```ts
// Primitive value
await assert.resolvesWith(
  getDefaultCurrency(),
  "USD",
  "default currency must be USD for new accounts"
)

// Object — produces a field-by-field diff on failure
await assert.resolvesWith(
  fetchUser("usr_alice"),
  { id: "usr_alice", role: "customer", active: true },
  {
    msg:  "usr_alice must be an active customer",
    note: "check the test fixtures in seeds/users.ts",
  }
)
```

```
════════════ ● usr_alice must be an active customer ════════════

── diff ────────────────────────────────────────────────────────
  ·  id       "usr_alice"
  ~  role
       expected   "customer"
       actual     "admin"
  ·  active   true

════════════════════════════════════════════════════════════════
```

---

### `assert.resolvesSatisfying` — predicate on the resolved value

Use when the value can't be known exactly, but its invariants can:

```ts
// Assert structure without knowing the exact content
await assert.resolvesSatisfying(
  authService.login({ email: "alice@example.com", password }),
  (token) => token.split(".").length === 3 && token.length > 50,
  "login must return a valid JWT"
)

// Assert a list invariant
await assert.resolvesSatisfying(
  userRepo.findByRole("admin"),
  (users) =>
    users.length > 0 &&
    users.every((u) => u.role === "admin"),
  {
    msg:  "admin query must return only admins",
    note: "check the role filter in the ORM query",
  }
)

// Assert a time-sensitive result
await assert.resolvesSatisfying(
  cache.get("price:prod_123"),
  (entry) => entry !== null && Date.now() - entry.cachedAt < 60_000,
  "cached price must be less than 60 seconds old"
)
```

---

### `assert.resolvesNotNil` — the most common case, narrowed

When you need to assert the resolved value is non-null *and* use it immediately with TypeScript safety:

```ts
// TypeScript knows `user` is User — no `!` or null check needed
const user = await assert.resolvesNotNil(
  userRepo.findById(id),
  { msg: "user must exist", note: "check that the id comes from a valid session" }
)

// Safe — TypeScript + assertcheck both guarantee non-null here
assert.equal(user.role, "customer")
assert.notEmpty(user.email)
```

Compare with the common alternative that lies to TypeScript:

```ts
const user = await userRepo.findById(id)
if (!user) throw new Error("user not found")  // plain Error, no context
user!.role  // the ! is a promise TypeScript can't verify
```

::: info Why return the value?
`resolvesNotNil` returns `Promise<NonNullable<T>>` so the assertion and the variable assignment are one operation. The narrowed type propagates — no cast, no `!`.
:::

---

## Combining async assertions in a test

```ts
import { assert } from "assertcheck"

describe("OrderService.placeOrder", () => {
  it("creates a paid order for a valid user", async () => {
    // assert.resolvesNotNil: asserts + narrows + returns inline
    const order = await assert.resolvesNotNil(
      OrderService.placeOrder("usr_alice", cartItems),
      "placeOrder must return a non-null order"
    )
    assert.equal(order.status, "paid")
    assert.equal(order.userId, "usr_alice")
    assert.positive(order.totalCents)
  })

  it("rejects with PaymentError when Stripe declines", async () => {
    // rejectsSatisfying: checks type + domain field in one assertion
    await assert.rejectsSatisfying(
      OrderService.placeOrder("usr_alice", largeItems),
      (err) => err instanceof PaymentError && err.code === "amount_too_large",
      "Stripe limit exceeded must propagate as PaymentError with the right code"
    )
  })

  it("error message includes userId for support tracing", async () => {
    await assert.rejectsMatching(
      OrderService.placeOrder("usr_alice", largeItems),
      /usr_alice.*exceeded|exceeded.*usr_alice/i,
      "support needs the userId in the error to correlate with Stripe logs"
    )
  })

  it("rejects immediately for an empty cart — no DB or Stripe call", async () => {
    await assert.rejectsMatching(
      OrderService.placeOrder("usr_alice", []),
      /at least one item/,
      "empty cart must be caught at the boundary, not after a DB round-trip"
    )
  })
})
```

---

## Quick reference

### Rejection

| Method | Asserts |
|---|---|
| `assert.rejects(p, opts?)` | Promise rejects |
| `assert.rejects(p, Ctor, opts?)` | Promise rejects with an instance of `Ctor` |
| `assert.rejectsWithMessage(p, msg, opts?)` | Rejection message equals `msg` |
| `assert.rejectsMatching(p, /regex/, opts?)` | Rejection message matches pattern |
| `assert.rejectsSatisfying(p, fn, opts?)` | Rejection value satisfies predicate |

### Resolution

| Method | Asserts | Returns |
|---|---|---|
| `assert.resolves(p, opts?)` | Promise resolves | `Promise<T>` — the resolved value |
| `assert.resolvesWith(p, expected, opts?)` | Resolves to `expected` (deep equal) | `Promise<void>` |
| `assert.resolvesSatisfying(p, fn, opts?)` | Resolved value satisfies predicate | `Promise<void>` |
| `assert.resolvesNotNil(p, opts?)` | Resolves to a non-null value | `Promise<NonNullable<T>>` |

All methods accept `Promise<T>` or `() => Promise<T>`.
