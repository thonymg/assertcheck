# assertcheck-refactor

Modify existing code without breaking contracts. Every change is mapped to its guard impact.
Every removed safety check is replaced by an assertion — never silently deleted.

> "Figuring out what code doesn't do (and why) can be positively enlightening."
> — Fabian Giesen, *Negative space in programming*

---

## When to use it

- "I'm adding a new parameter to this function"
- "I'm changing the behavior of this method"
- "I need to extend this class with a new method"
- "I'm refactoring this service"
- You share existing code you are about to modify

---

## How it works

The skill enforces a 4-step protocol. It will not produce any diff until the interview is complete.

### Interview first

```
1. What are you changing? (adding a param / changing logic / extracting / replacing a call)
2. Are you removing or replacing any safety check? (if (!x) return / ?? / try-catch)
3. Does the change add a new external dependency?
4. Does the change affect valid entity states?
5. Is this function called from multiple places?
```

Question 2 is critical: if a safety check is being removed without a replacement assertion, the skill flags it as a regression before anything else.

### Step 1 — Hidden assumption scanner

A 5-pass scan of the existing code before any change is made:

| Pass | What to look for |
|:-----|:----------------|
| **A — Parameters** | accessed without nil/type check before first use |
| **B — External data** | `await` result used directly without nil check |
| **C — Environment** | `process.env.X` or `config.x.y` accessed without guard |
| **D — State** | entity field read without asserting current state |
| **E — Silent exits** | `if (!x) return` / `x ?? fallback` / `x?.field` / swallowed `catch` |

### Step 2 — Change impact table

| Change type | Guard impact |
|:------------|:-------------|
| New parameter added | Add preconditions for the new param at function top |
| Type widened (`string` → `string \| null`) | Add nil guard on every usage site |
| New external call added | Add integration guard on the response |
| New state dependency | Add state guard before accessing it |
| `if (!x) return` removed | **Must** be replaced by `assert.notNil` — never silently deleted |
| `?? fallback` removed | **Must** be replaced by `assert.notNil` — fallbacks hide invalid inputs |

### Step 3 — Guard diff

Every assertion is annotated as `[EXISTING — promoted]` or `[NEW — added for this change]`.
`[EXISTING]` annotations explain why the original code was insufficient — not just where it was.

### Step 4 — Removed safety check flags

Every `if (!x) return` or `?? fallback` removal is documented:

```
⚠ Line 3: `if (!orderId) return` removed.
→ Replaced with: assert.string(orderId) + assert.notEmpty(orderId)
→ Why: silent return gives caller undefined with no stack trace.
  Assertion surfaces the failure immediately at its origin with full context.
```

---

## Example — adding a `currency` parameter

**Before (hidden assumptions throughout):**

```ts
async function processPayment(orderId: string, amount: number) {
  if (!orderId) return               // silent failure: caller gets undefined
  const order = await repo.findById(orderId)
  // order used directly — could be null
  const receipt = await gateway.charge(amount)
  return receipt
}
```

**After — guard diff:**

```ts
import { assert } from "assertcheck"

async function processPayment(orderId: string, amount: number, currency: string) {
  // ── guards ──────────────────────────────────────────────────────
  // [EXISTING — promoted from silent `if (!orderId) return`]
  assert.string(orderId,   "orderId must be a string")
  assert.notEmpty(orderId, "orderId must not be empty")

  // [EXISTING — amount was unvalidated]
  assert.number(amount, "amount must be a number")
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

::: info Why replace `if (!orderId) return` with an assertion?
Before: caller receives `undefined` silently → confusion propagates downstream.
After: caller receives an `AssertionError` immediately → failure is at its origin with a stack trace and a message.
:::

---

## What the skill delivers

1. **Impact table** — change type → guard required (one row per change)
2. **Guard diff** — `[EXISTING]` and `[NEW]` annotations, with `WHY` on every `[EXISTING]`
3. **Removed safety flags** — `⚠` block for every `if (!x) return` or `?? fallback` removed
4. **Caller note** — flags that callers must now pass valid inputs if the function has multiple call sites
