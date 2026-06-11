# assertcheck-refactor

Modify existing code without breaking contracts — and surface the hidden assumptions
every change puts at risk.

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

## The TypeScript trap

Static types gave the impression the code was safe. At runtime, they are gone.
Every `??`, `?.`, and `if (!x) return` is a hidden contract that silently breaks
the moment a caller changes.

---

## What the skill does

The skill runs a **4-step protocol** on your change.

### Interview first

Before producing anything, the skill asks:
1. What are you changing? (adding a param / changing logic / extracting / replacing a call)
2. Are you removing or replacing any safety check?
3. Does the change add a new external dependency?
4. Does the change affect valid entity states?
5. Is this function called from multiple places?

### Step 1 — Hidden assumption scanner

A 5-pass scan of the existing code before any change is made:

| Pass | What to look for |
|:-----|:----------------|
| **A — Parameters** | accessed without nil/type check before first use |
| **B — External data** | `await` result used directly without nil check |
| **C — Environment** | `process.env.X` or `config.x.y` accessed without guard |
| **D — State** | entity field read without asserting current state |
| **E — Silent exits** | `if (!x) return` / `x ?? fallback` / `x?.field` / swallowed `catch` |

### Step 2 — Change impact assessment

| Change type | Guard impact |
|:------------|:-------------|
| New parameter added | Add preconditions for the new param at the top |
| Type widened (`string` → `string \| null`) | Add nil guard on every usage site |
| New external call added | Add integration guard on the response |
| New state dependency | Add state guard before accessing it |
| `if (!x) return` removed | **Must** be replaced by `assert.notNil` — never silently deleted |
| `?? fallback` removed | **Must** be replaced by `assert.notNil` — fallbacks hide invalid inputs |

### Step 3 — Guard diff

A precise before/after diff with inline comments identifying each assertion as
`[EXISTING — promoted]` or `[NEW — added for this change]`.

### Step 4 — Removed safety check flags

Every `if (!x) return` or `?? fallback` removal is explicitly documented:

```
⚠ Line 5: `if (!orderId) return` removed.
→ Replaced with: assert.notNil(orderId, { msg: "orderId is required", … })
→ Why this matters: a silent return is invisible to the caller and hides the failure
  at its origin. An assertion surfaces it immediately with context and a stack trace.
```

---

## Example — adding a currency parameter

**Before:**

```ts
// Hidden assumptions: orderId silent exit, order nil, amount unvalidated
async function processPayment(orderId: string, amount: number) {
  if (!orderId) return               // silent failure: caller gets undefined
  const order = await repo.findById(orderId)
  // order used directly — could be null
  const receipt = await gateway.charge(amount)
  return receipt
}
```

**After — guard diff for adding `currency: string`:**

```ts
import { assert } from "assertcheck"

async function processPayment(orderId: string, amount: number, currency: string) {
  // ── guards ──────────────────────────────────────────────────────
  // [EXISTING — promoted from silent `if (!orderId) return`]
  assert.notNil(orderId, {
    msg:  "orderId is required to process a payment",
    note: "check that the caller passes a valid order id",
  })
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

  const receipt = await gateway.charge(amount, currency)
  return receipt
}
```

::: info Why replace `if (!orderId) return` with an assertion?
Before: caller receives `undefined` silently → confusion propagates downstream.  
After: caller receives an `AssertionError` immediately → failure is at its origin with a stack trace and a message.
:::

---

## What the skill delivers

1. **Impact table** — what changes and what guard each change requires
2. **Guard diff** — assertions to add, with line anchors in the original code
3. **Removed safety flags** — explicit warning for every silent check removed
4. **Caller note** — if the function is called from multiple places, flags that callers must now pass valid inputs
