---
name: assertcheck-refactor
description: Help a developer add Negative Space Programming assertions to existing code being modified. Trigger when the user says "I'm changing this function", "I'm adding a parameter to…", "I need to update this service", "I'm extending this class", or shares existing code they are about to modify.
---

# assertcheck-refactor

> "When reading code, looking at what a program does (and how it does it) is instructive.
> But figuring out what it doesn't do (and why) can be positively enlightening."
> — Fabian Giesen, *Negative space in programming*

You are modifying existing code. Every change potentially invalidates assumptions the
original author had in mind but never wrote down.

**The TypeScript trap:** Static types gave the impression the code was safe. At runtime, they are gone.
Every `??`, `?.`, and `if (!x) return` is a hidden contract that silently breaks.
assertcheck makes those hidden contracts visible and enforceable.

---

## When this skill activates

- "I'm adding a new parameter to this function"
- "I'm changing the behavior of this method"
- "I need to extend this class with a new method"
- "I'm refactoring this service"
- User shares code they are about to change (not brand new)

---

## Step 0 — Interview the developer first

Ask these questions before scanning the code:

```
1. What are you changing? (adding a param / changing logic / extracting / replacing a call)
2. Are you removing or replacing any safety check? (if (!x) return / ?? / try-catch)
3. Does the change add a new external dependency? (DB call / API / env var)
4. Does the change affect the valid states the entity can be in?
5. Is this function called from multiple places?
   (if yes: will all callers satisfy the new preconditions?)
```

Do **not** produce a diff until questions 1–2 are answered.

---

## Protocol — 4 steps

### Step 1 — Read for hidden contracts

Before touching anything, run the **hidden assumption scanner** on the existing code.
Load [references/hidden-assumption-scanner.md](references/hidden-assumption-scanner.md) for the full scan.

The 5 scan passes:

| Pass | What to look for |
|:-----|:----------------|
| **A — Parameters** | accessed without nil/type check before first use |
| **B — External data** | `await result` used directly without nil check |
| **C — Environment** | `process.env.X` or `config.x.y` accessed without guard |
| **D — State** | entity field read without asserting current state |
| **E — Silent exits** | `if (!x) return` / `x ?? fallback` / `x?.field` / swallowed `catch` |

Each pattern found = one potential `assert.*` to add.

---

### Step 2 — Assess the change impact

Map what you are changing to what guard it requires:

| Change type | Guard impact |
|:------------|:-------------|
| **New parameter added** | Add preconditions for the new param at the top |
| **Type widened** (`string` → `string \| null`) | Add nil guard on every usage site |
| **New external call added** | Add integration guard on the response |
| **New state dependency** | Add state guard before accessing it |
| **`if (!x) return` removed** | **Must** be replaced by `assert.notNil` — never silently deleted |
| **`?? fallback` removed** | **Must** be replaced by `assert.notNil` — fallbacks hide invalid inputs |

---

### Step 3 — Build the guard diff

**Few-shot example — adding a `currency` parameter to an existing service method:**

```ts
// ❌ BEFORE — existing code with hidden assumptions
async function processPayment(orderId: string, amount: number) {
  if (!orderId) return               // ← silent failure: caller gets undefined
  const order = await repo.findById(orderId)
  // order used directly below — could be null if deleted between calls
  const receipt = await gateway.charge(amount)
  return receipt
}
```

```ts
// After interview: user is adding `currency: string` param
// Hidden assumptions found: orderId silent exit, order nil, amount untyped

// ✅ AFTER — guard diff to apply
import { assert } from "assertcheck"
// docs: https://thonymg.github.io/assertcheck/

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

  const receipt = await gateway.charge(amount, currency)
  return receipt
}
```

**Why the change from `if (!orderId) return` to `assert.notNil`:**
```
Before: caller receives `undefined` silently → confusion propagates downstream
After:  caller receives an AssertionError immediately → failure is at its origin
```

Load [references/refactor-diff-format.md](references/refactor-diff-format.md) for the full output format.
Load skill `assertcheck-selector` to pick the right assertion for each gap.

---

### Step 4 — Flag removed safety checks

Every `if (!x) return` or `?? fallback` removal must be explicitly documented:

```
⚠ Line 5: `if (!orderId) return` removed.
→ Replaced with: assert.notNil(orderId, { msg: "orderId is required", … })
→ Why this matters: a silent return is invisible to the caller and hides the failure
  at its origin. An assertion surfaces it immediately with context and a stack trace.
  This is the difference between "crash early with signal" and "corrupt silently".
```

---

## Output format

1. **Impact table** — what changes and what guard each change requires
2. **Guard diff** — the assertions to add, with line anchors in the original code
3. **Removed safety flags** — explicit warning for every silent check removed
4. **Caller note** — if the function is called from multiple places, flag that callers must now pass valid inputs

---

## Theoretical foundation

| Principle | Source |
|:----------|:-------|
| Silent returns hide failures | *Defensive Programming and TypeScript* — "crash early, crash often" |
| `??` and `?.` abuse hides invalid state | *Defensive Programming and TypeScript* — optional chaining section |
| Unknown assumptions are the hardest bugs | *Negative space in programming* (fgiesen) — "the unspoken assumptions surrounding it" |
| Make invalid states impossible | *Negative programming* (Marinica) |

---

## Reference files

- [references/hidden-assumption-scanner.md](references/hidden-assumption-scanner.md) — 5-pass scan for implicit assumptions
- [references/refactor-diff-format.md](references/refactor-diff-format.md) — output format for guard diffs
- assertcheck docs: https://thonymg.github.io/assertcheck/
