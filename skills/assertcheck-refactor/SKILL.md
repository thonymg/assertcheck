---
name: assertcheck-refactor
description: Help a developer add Negative Space Programming assertions to existing code being modified. Trigger when the user says "I'm changing this function", "I'm adding a parameter to…", "I need to update this service", "I'm extending this class", or shares existing code they are about to modify.
---

# assertcheck-refactor

## References — load before starting

- [references/hidden-assumption-scanner.md](references/hidden-assumption-scanner.md)
- [references/refactor-diff-format.md](references/refactor-diff-format.md)

---

## LAWS

**LAW 1 — Interview before touching the code.**
Q1 and Q2 must be answered before producing any diff.
Q2 is critical: if a safety check is being removed without a replacement assertion → that is a regression. Flag it before anything else.

**LAW 2 — Hidden assumption scanner runs before any diff.**
Use `references/hidden-assumption-scanner.md`, all 5 passes, in order.
Every pattern found = one potential `assert.*` to add.

**LAW 3 — Every removed safety check must be explicitly documented.**
`if (!x) return` removed → must be replaced by `assert.notNil`. Never silently deleted.
`?? fallback` removed → must be replaced by `assert.notNil`. Fallbacks hide invalid inputs.
Document each removal with the `⚠` format from `references/refactor-diff-format.md`.

**LAW 4 — `[EXISTING]` annotations must explain WHY the original was insufficient.**
Not "moved from line 5". But: "replaces silent `if (!orderId) return` — caller now gets an AssertionError instead of undefined".

**LAW 5 — `[NEW]` annotations mark assertions added for the change, not pre-existing gaps.**
Distinguish: `[EXISTING — promoted]` vs `[NEW — added for new param]`.

**LAW 6 — Deliver in order: impact table → guard diff → removed safety flags → caller note.**
Never skip the caller note if the function has multiple call sites.

---

## Triggers

- "I'm adding a new parameter to this function"
- "I'm changing the behavior of this method"
- "I need to extend this class with a new method"
- "I'm refactoring this service"
- User shares code they are about to change (not brand new)

---

## Interview — ask before any output

```
1. What are you changing? (adding a param / changing logic / extracting / replacing a call)
2. Are you removing or replacing any safety check? (if (!x) return / ?? / try-catch)
3. Does the change add a new external dependency? (DB call / API / env var)
4. Does the change affect the valid states the entity can be in?
5. Is this function called from multiple places?
   (if yes: will all callers satisfy the new preconditions?)
```

---

## Protocol — 4 steps

### Step 1 — Hidden assumption scanner (all 5 passes)

| Pass | What to look for |
|:-----|:----------------|
| **A — Parameters** | accessed without nil/type check before first use |
| **B — External data** | `await result` used directly without nil check |
| **C — Environment** | `process.env.X` or `config.x.y` accessed without guard |
| **D — State** | entity field read without asserting current state |
| **E — Silent exits** | `if (!x) return` / `x ?? fallback` / `x?.field` / swallowed `catch` |

### Step 2 — Change impact table

| Change type | Guard impact |
|:------------|:-------------|
| **New parameter added** | Add preconditions for the new param at function top |
| **Type widened** (`string` → `string \| null`) | Add nil guard on every usage site |
| **New external call added** | Add integration guard on the response |
| **New state dependency** | Add state guard before accessing it |
| **`if (!x) return` removed** | Replace with `assert.notNil` — never silently delete |
| **`?? fallback` removed** | Replace with `assert.notNil` — never silently delete |

### Step 3 — Guard diff

Annotate every assertion with `[EXISTING]` or `[NEW]`:

```ts
// ── guards ──────────────────────────────────────────────────────
// [EXISTING — promoted from silent `if (!orderId) return`]
assert.notNil(orderId, {
  msg:  "orderId is required to process a payment",
  note: "check that the caller passes a valid order id",
})

// [NEW — added for new currency param]
assert.string(currency,   "currency must be a string")
assert.notEmpty(currency, "currency code must not be empty (e.g. 'EUR', 'USD')")
```

Use exact format from `references/refactor-diff-format.md`.
Load `assertcheck-selector` for assertion selection.

### Step 4 — Removed safety flags

```
⚠ Line <N>: `<original pattern>` removed.
→ Replaced with: <assert call>
→ Why: <one sentence — what the original hid and why the assertion is more precise>
```

---

## Canonical example

**Before (hidden assumptions: orderId silent exit, order nil, amount untyped):**

```ts
async function processPayment(orderId: string, amount: number) {
  if (!orderId) return
  const order = await repo.findById(orderId)
  const receipt = await gateway.charge(amount)
  return receipt
}
```

**After (adding `currency: string` param + promoting hidden contracts):**

```ts
import { assert } from "assertcheck"
// docs: https://thonymg.github.io/assertcheck/

async function processPayment(orderId: string, amount: number, currency: string) {
  // ── guards ──────────────────────────────────────────────────────
  // [EXISTING — promoted from silent `if (!orderId) return`]
  assert.string(orderId,   "orderId must be a string")
  assert.notEmpty(orderId, "orderId must not be empty")

  // [EXISTING — amount was unvalidated]
  assert.number(amount,   "amount must be a number")
  assert.greater(amount, 0, {
    msg:  "payment amount must be positive",
    note: "use refundPayment() for negative adjustments",
  })

  // [NEW — new currency param]
  assert.string(currency,   "currency must be a string")
  assert.notEmpty(currency, "currency code must not be empty (e.g. 'EUR', 'USD')")

  // ── logic ──────────────────────────────────────────────────────
  const order = await repo.findById(orderId)

  // [EXISTING — order was accessed without nil check]
  assert.notNil(order, {
    msg:    "order must exist before processing payment",
    actual: "orderId",
    note:   "verify the orderId comes from a valid creation flow",
  })

  return await gateway.charge(amount, currency)
}
```

**Removed safety flag:**

```
⚠ Line 3: `if (!orderId) return` removed.
→ Replaced with: assert.string(orderId) + assert.notEmpty(orderId)
→ Why: silent return gives caller undefined with no stack trace.
  Assertion surfaces the failure immediately at its origin with full context.
```

---

## SELF-CHECK — run before delivering

- [ ] Interview: Q1 and Q2 answered before any diff was produced
- [ ] Hidden assumption scanner: all 5 passes run, none skipped
- [ ] Impact table: one row per change type, guard impact filled
- [ ] Guard diff: every assertion has `[EXISTING]` or `[NEW]` annotation
- [ ] `[EXISTING]` annotations: explain WHY the original was insufficient (not just where)
- [ ] Every removed `if (!x) return` or `?? fallback` has a `⚠` removal flag
- [ ] Every assertion has `msg` with domain context
- [ ] Caller note: included if the function has multiple call sites

If any item fails → fix before delivering.
