# assertcheck-spec

Define a feature by what it must **never** accept, never enter, and never produce —
before a single line of implementation. Every invariant maps to one `assert.*` call.

> "Negative programming is about what a program cannot do, what is impossible.
> We are terrible at it: it's easier to keep adding features than to prevent bugs."
> — Andrei Marinica, *Negative programming*

---

## When to use it

- "Write a spec for this feature"
- "Document the contract for this function"
- "I need to define invariants before implementing"
- "What are the pre/postconditions for this?"
- "Formalize what this service must and must never do"

---

## How it works

The skill enforces a strict sequence. It will not produce any output until the interview is complete.

### Step 1 — Interview (mandatory)

Six questions, answered before anything is written:

1. What is the name and purpose of the feature?
2. What are the entry points?
3. What are the inputs and where do they come from?
4. Are there entity state dependencies?
5. What must the output guarantee?
6. **What are the forbidden states? What must NEVER happen?**

Question 6 is the most important. If you haven't thought about it yet, the skill asks:
*"What would a catastrophic misuse of this feature look like?"*

### Step 2 — Spec output (5 sections, in order)

**Section 1 — Feature identity**

```
## Feature: <name>

**Purpose:** one sentence
**Entry points:** function signatures
**Dependencies:** external services / state / repos
**Hard NOs:**
  - NEVER <domain-level prohibition>
```

**Section 2 — Preconditions**

Every invariant that must hold before the feature runs, mapped to an assertion:

```
| # | Invariant                          | Violated by                      | Assert with                           |
|:--|:-----------------------------------|:---------------------------------|:--------------------------------------|
| P1 | orderId must be a non-empty string | null, empty string, number       | assert.string + assert.notEmpty       |
| P2 | amount must be a positive number   | zero, negative, NaN              | assert.number + assert.greater(…, 0)  |
| P3 | Order must exist                   | deleted order, wrong id          | assert.notNil(order, {…})             |
| P4 | Order must be in pending state     | cancelled, shipped, already paid | assert.equal(order.status, "pending") |
```

**Section 3 — Postconditions**

What must be true about the output when the feature completes:

```
| # | Invariant                        | Assert with                          |
|:--|:---------------------------------|:-------------------------------------|
| Q1 | receipt must have transactionId | assert.notNil(receipt.transactionId) |
| Q2 | receipt.amount must equal amount | assert.equal(receipt.amount, amount) |
```

**Section 4 — State machine** (if applicable)

For features with entity lifecycle transitions: valid/invalid transitions with the assertion that guards each one.

**Section 5 — Implementation checklist**

One checkbox per assertion, labeled with its P/Q number:

```
- [ ] P1 — assert.string(customerId) + assert.notEmpty(customerId) at function top
- [ ] P2 — check(items).notEmpty(…) at function top
- [ ] Q1 — assert.notEmpty(order.id) before return
```

---

## Full example — `createOrder`

**Spec:**

```
## Feature: createOrder

**Purpose:** Create a new order in pending state for a given customer and cart.
**Entry points:** createOrder(customerId: string, items: CartItem[]): Order
**Hard NOs:**
  - NEVER create an order with 0 or negative total
  - NEVER create an order for an empty customerId
  - NEVER create an order with 0 items or items with quantity ≤ 0

### Preconditions

| # | Invariant                       | Violated by           | Assert with                            |
|:--|:--------------------------------|:----------------------|:---------------------------------------|
| P1 | customerId must be non-empty   | null, empty, number   | assert.string + assert.notEmpty        |
| P2 | items must be non-empty array  | null, [], undefined   | check(items).notEmpty(…)               |
| P3 | every item: quantity > 0       | item.quantity = 0, -1 | check(items).all(i => i.quantity > 0)  |
| P4 | every item: price > 0          | item.price = 0        | check(items).all(i => i.price > 0)     |

### Postconditions

| # | Invariant                    | Assert with                           |
|:--|:-----------------------------|:--------------------------------------|
| Q1 | order.id must be non-empty  | assert.notEmpty(order.id)             |
| Q2 | order.total must be > 0     | assert.greater(order.total, 0)        |
| Q3 | order.status must be pending | assert.equal(order.status, "pending") |

### Implementation checklist

- [ ] P1 — assert.string(customerId) + assert.notEmpty(customerId) at function top
- [ ] P2 — check(items).notEmpty(…) at function top
- [ ] P3 — check(items).all(i => i.quantity > 0, …) at function top
- [ ] P4 — check(items).all(i => i.price > 0, …) at function top
- [ ] Q1 — assert.notEmpty(order.id) before return
- [ ] Q2 — assert.greater(order.total, 0) before return
- [ ] Q3 — assert.equal(order.status, "pending") before return
```

**Resulting implementation:**

```ts
import { assert, check } from "assertcheck"

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

## What the skill delivers

1. **Feature identity** — name, entry points, dependencies, Hard NOs
2. **Preconditions table** — invariant → violated by → assert with (one row per invariant)
3. **Postconditions table** — output guarantee → assert with
4. **State machine** (if applicable) — transitions with guards
5. **Implementation checklist** — one checkbox per assertion, P/Q labeled, traceable to code
