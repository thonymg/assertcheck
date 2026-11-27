# assertcheck-new

For code that does not exist yet. Declare what must never happen, then write the logic.

> "Figuring out what code doesn't do (and why) can be positively enlightening."
> — Fabian Giesen, *Negative space in programming*

---

## When to use it

- "I'm building a new service for…"
- "Write a spec for the payment module"
- "Define the invariants of this function before I implement it"
- "Which `assert.*` should I use for…"

---

## The workflow

1. **Contract.** The agent asks only what is missing: entry point, inputs and their origin, what makes each input invalid, prior state, what an external call must return, what the output guarantees, what must never happen.
2. **Contract table.** One invariant per row, each with its assertion. Preconditions are `P`, postconditions are `Q`.
3. **Code.** Guards first, then the logic, then the postconditions.
4. **Delivery.** Table, code, and one sentence per assertion saying which state it rejects.

If you only want a spec, it stops after the table.

```ts
function createOrder(customerId: string, items: CartItem[]): Order {
  // ── guards ────────────────────────────────────────────────
  assert.notEmpty(customerId, "customerId must not be empty")           // P1
  check(items)
    .notEmpty("cart must have at least one item")                       // P2
    .all(i => i.quantity > 0, {
      msg:  "all items must have a positive quantity",
      note: "remove items with quantity <= 0 before calling createOrder()",
    })

  // ── logic: runs with proven invariants ────────────────────
  const order = { id: crypto.randomUUID(), customerId, items, status: "pending" as const }

  // ── postconditions ────────────────────────────────────────
  assert.notEmpty(order.id, "order must have a generated id")           // Q1
  return order
}
```

## Rules

- The guard block is the first thing in the body. No logic before the last guard.
- No `?.`, `??` or `if (!x) return` in the logic block: a nil check there belongs in the guards.
- Every assertion has a `msg` that states the invariant, never `"value is null"`. Add `note` when the fix is non-obvious.
- Skip what the TypeScript type already guarantees.
- Use `check()` when 3 or more assertions target the same value.

The skill includes a lookup of the most specific assertion for each invariant, and ready guard blocks for HTTP handlers, services with a state guard, constructors, env bootstrap and external calls.
