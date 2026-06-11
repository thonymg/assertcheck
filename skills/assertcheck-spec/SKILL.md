---
name: assertcheck-spec
description: Write or review a technical spec for a feature using Negative Space Programming. Trigger when the user says "write a spec for…", "document the invariants of…", "I need a technical spec", "define the contract for this function/service/module", or wants to formalize what a feature must and must never do before implementing it.
---

# assertcheck-spec

> "Positive, or additive programming is about adding features, what the program can do.
> Negative, or subtractive programming is about what a program cannot do, what is impossible.
> We are terrible at negative programming: it's easier to keep adding features
> than to prevent bugs and hacks."
> — Andrei Marinica, *Negative programming*

A technical spec written with Negative Space Programming defines a feature by
what it **must never accept**, what states it **must never enter**, and what
outputs it **must never produce** — before a single line of implementation.

Like Michelangelo chiseling away everything that isn't David: you declare the
impossible first, and the implementation is what remains in the space that's left.

This skill produces a spec that is **directly traceable to assertcheck assertions**.
Every invariant in the spec maps to one `assert.*` call in the implementation.

---

## When this skill activates

- "Write a spec for this feature"
- "Document the contract for this function"
- "I need to define invariants before implementing"
- "What are the pre/postconditions for this?"
- "Formalize what this service must and must never do"

---

## Step 0 — Interview the developer first

Before writing any spec, ask:

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

Question 6 is the most important. If the developer hasn't thought about it,
ask: "What would a catastrophic misuse of this feature look like?"

---

## Spec protocol — 4 sections

### Section 1 — Feature identity

```
## Feature: <name>

**Purpose:** one sentence — what this feature does for the domain.
**Entry points:** list of functions / methods / routes that implement it.
**Dependencies:** external services, repos, or state it reads.
**Hard NOs:** what this feature must NEVER do (domain-level prohibitions).
```

---

### Section 2 — Preconditions (the negative space)

For each entry point, declare every invariant that must hold **before** the feature runs.
Write them as **assertions-to-be** — not validation rules, but facts that must be true.

Load [references/invariant-vocabulary.md](references/invariant-vocabulary.md) for standard phrases.

```
### Preconditions — `processPayment(orderId, amount)`

| # | Invariant | Violated by | Assert with |
|:--|:----------|:-----------|:------------|
| P1 | `orderId` must be a non-empty string | null, empty string, number | `assert.string + assert.notEmpty` |
| P2 | `amount` must be a positive number | zero, negative, NaN, string | `assert.number + assert.greater(amount, 0)` |
| P3 | Order identified by `orderId` must exist | deleted order, wrong id | `assert.notNil(order, { actual: "orderId" })` |
| P4 | Order must be in `pending` state | cancelled, shipped, already paid | `assert.equal(order.status, "pending")` |
```

---

### Section 3 — Postconditions

What must be true about the output when the feature completes successfully.

```
### Postconditions — `processPayment`

| # | Invariant | Assert with |
|:--|:----------|:------------|
| Q1 | Returned `receipt` must have a `transactionId` | `assert.notNil(receipt.transactionId)` |
| Q2 | `receipt.amount` must equal the requested `amount` | `assert.equal(receipt.amount, amount)` |
```

---

### Section 4 — State machine (if applicable)

Load [references/state-machine-spec.md](references/state-machine-spec.md) for complex multi-entity state machines.

---

## Few-shot example — full spec for `createOrder`

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

**Resulting implementation:**

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

  // ── logic ───────────────────────────────────────────────
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const order = { id: crypto.randomUUID(), customerId, items, total, status: "pending" }

  // ── postconditions ──────────────────────────────────────────
  assert.notEmpty(order.id,            "order must have a generated id")   // Q1
  assert.greater(order.total, 0,       "order total must be positive")      // Q2
  assert.equal(order.status, "pending","order must start in pending state") // Q3

  return order
}
```

---

## Theoretical foundation

| Principle | Source |
|:----------|:-------|
| Define what is IMPOSSIBLE, not just what is possible | *Negative programming* (Marinica) |
| Every precondition is a door that must stay closed | *Negative Space in AI Development* (handshakefyi) |
| Specs define negative space; implementation fills what remains | *Negative space in programming* (fgiesen) |
| Runtime assertions enforce what TypeScript cannot | *Defensive Programming and TypeScript* |
| Explicit boundaries improve bug detection and maintainability | *Negative Space* (alissonsteffens.com) |

---

## Reference files

- [references/invariant-vocabulary.md](references/invariant-vocabulary.md) — standard phrases → direct translation to assert.*
- [references/state-machine-spec.md](references/state-machine-spec.md) — how to spec state machines with NSP
- assertcheck docs: https://thonymg.github.io/assertcheck/
