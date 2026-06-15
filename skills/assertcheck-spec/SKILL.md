---
name: assertcheck-spec
description: Write or review a technical spec for a feature using Negative Space Programming. Trigger when the user says "write a spec for…", "document the invariants of…", "I need a technical spec", "define the contract for this function/service/module", or wants to formalize what a feature must and must never do before implementing it.
---

# assertcheck-spec

## References — load before starting

- [references/invariant-vocabulary.md](references/invariant-vocabulary.md)
- [references/state-machine-spec.md](references/state-machine-spec.md)

---

## LAWS

**LAW 1 — Interview first, always.**
Never produce any spec section before all 6 interview questions are answered.
If Q1, Q2, or Q6 is missing: ask, wait, produce nothing.

**LAW 2 — Every invariant maps to one assertion.**
No invariant row without a filled "Assert with" column.
Use exact phrases from `references/invariant-vocabulary.md`.
If unsure: load `assertcheck-selector`.

**LAW 3 — One invariant per row. No merging.**
P1 and P2 are two rows. Always.

**LAW 4 — Hard NOs are domain-level, not technical.**
"NEVER charge a cancelled order" ✅ — "NEVER pass null" ❌ (that's a precondition, not a Hard NO).

**LAW 5 — Postconditions are assertions-to-be, not prose.**
Every Q-row must have an `Assert with` entry.

**LAW 6 — The implementation checklist is mandatory.**
One checkbox per assertion, labeled with its P/Q number. No exceptions.

---

## Triggers

- "Write a spec for this feature"
- "Document the contract for this function"
- "I need to define invariants before implementing"
- "What are the pre/postconditions for this?"
- "Formalize what this service must and must never do"

---

## Interview — ask all 6, wait for answers

```
1. What is the name and purpose of the feature? (one sentence)
2. What are the entry points? (functions / routes / class methods)
3. What are the inputs and where do they come from?
   (user input / HTTP body / DB / env var / another service)
4. Are there any entity state dependencies?
   (e.g. "this only runs on pending orders")
5. What must the output guarantee?
   (non-null id, non-empty array, specific status, matching amount…)
6. What are the forbidden states? What must NEVER happen?
   (e.g. "never charge a cancelled order", "never return an empty list silently")
```

> Q6 unanswered → ask: "What would a catastrophic misuse of this feature look like?"

---

## Output template — produce in this exact order

### Section 1 — Feature identity

```
## Feature: <name>

**Purpose:** <one sentence>
**Entry points:** <function signatures>
**Dependencies:** <external services / state / repos>
**Hard NOs:**
  - NEVER <domain-level prohibition>
  - NEVER <domain-level prohibition>
```

### Section 2 — Preconditions

```
### Preconditions — `<entryPoint(params)>`

| # | Invariant | Violated by | Assert with |
|:--|:----------|:-----------|:------------|
| P1 | `<param>` must be <phrase from vocabulary> | <concrete violations> | `<assert call>` |
| P2 | ... | ... | ... |
```

### Section 3 — Postconditions

```
### Postconditions — `<entryPoint>`

| # | Invariant | Assert with |
|:--|:----------|:------------|
| Q1 | <output guarantee> | `<assert call>` |
```

### Section 4 — State machine (if applicable)

→ See `references/state-machine-spec.md` for format.

### Section 5 — Implementation checklist

```
### Implementation checklist

- [ ] P1 — `<assert call>` at function top
- [ ] P2 — `<assert call>` at function top
- [ ] Q1 — `<assert call>` before return
```

---

## Canonical example

```
## Feature: createOrder

**Purpose:** Create a new order in pending state for a given customer and set of cart items.
**Entry points:** `createOrder(customerId: string, items: CartItem[]): Order`
**Dependencies:** crypto (UUID generation)
**Hard NOs:**
  - NEVER create an order with 0 or negative total
  - NEVER create an order for an unknown or empty customerId
  - NEVER create an order with 0 items or items with quantity ≤ 0

### Preconditions

| # | Invariant | Violated by | Assert with |
|:--|:----------|:-----------|:------------|
| P1 | `customerId` must be a non-empty string | null, empty, number | `assert.string + assert.notEmpty` |
| P2 | `items` must be a non-empty array | null, [], undefined | `check(items).notEmpty(…)` |
| P3 | Every item must have quantity > 0 | item.quantity = 0, -1 | `check(items).all(i => i.quantity > 0)` |
| P4 | Every item must have a positive price | item.price = 0 | `check(items).all(i => i.price > 0)` |

### Postconditions

| # | Invariant | Assert with |
|:--|:----------|:------------|
| Q1 | Returned order must have a non-empty `id` | `assert.notEmpty(order.id)` |
| Q2 | `order.total` must be positive | `assert.greater(order.total, 0)` |
| Q3 | `order.status` must be `"pending"` | `assert.equal(order.status, "pending")` |

### Implementation checklist

- [ ] P1 — `assert.string(customerId)` + `assert.notEmpty(customerId)` at function top
- [ ] P2 — `check(items).notEmpty(…)` at function top
- [ ] P3 — `check(items).all(i => i.quantity > 0, …)` at function top
- [ ] P4 — `check(items).all(i => i.price > 0, …)` at function top
- [ ] Q1 — `assert.notEmpty(order.id)` before return
- [ ] Q2 — `assert.greater(order.total, 0)` before return
- [ ] Q3 — `assert.equal(order.status, "pending")` before return
```

Resulting implementation:

```ts
import { assert, check } from "assertcheck"
// docs: https://thonymg.github.io/assertcheck/

function createOrder(customerId: string, items: CartItem[]): Order {
  // ── guards (preconditions) ──────────────────────────────────
  assert.string(customerId,   "customerId must be a non-empty string")  // P1
  assert.notEmpty(customerId, "customerId must not be empty")            // P1

  check(items)
    .notEmpty("cart must have at least one item")                        // P2
    .all(i => i.quantity > 0, {
      msg:  "all items must have a positive quantity",
      note: "remove items with quantity ≤ 0 before calling createOrder()",
    })                                                                   // P3
    .all(i => i.price > 0, "all items must have a positive price")       // P4

  // ── logic ────────────────────────────────────────────────────
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const order = { id: crypto.randomUUID(), customerId, items, total, status: "pending" }

  // ── postconditions ───────────────────────────────────────────
  assert.notEmpty(order.id,             "order must have a generated id")    // Q1
  assert.greater(order.total, 0,        "order total must be positive")       // Q2
  assert.equal(order.status, "pending", "order must start in pending state")  // Q3

  return order
}
```

---

## SELF-CHECK — run before delivering

Before sending the spec, verify each item:

- [ ] Interview: all 6 questions answered (at minimum Q1, Q2, Q6)
- [ ] Section 1: Hard NOs are domain-level (not technical params)
- [ ] Section 2: every P-row has a filled "Assert with" column
- [ ] Section 2: one invariant per row — none merged
- [ ] Section 2: phrases match `references/invariant-vocabulary.md`
- [ ] Section 3: every Q-row has a filled "Assert with" column
- [ ] Section 5: one checkbox per P and Q, labeled with its number
- [ ] No row has "Assert with" = empty or "TBD"

If any item fails → fix before delivering.
