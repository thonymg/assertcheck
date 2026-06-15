# assertcheck-feature

Build a new TypeScript feature with the guard block first — every invalid state declared
before a single line of logic is written.

> "An elegant program's quality is not that it does what it's supposed to; it's that it does almost nothing else."
> — Fabian Giesen, *Negative space in programming*

---

## When to use it

- "I'm creating a new function that…"
- "New service / class / module for…"
- "How do I write this feature with NSP?"
- You have a function signature but no body yet

---

## How it works

The skill enforces a 3-phase sequence. It will not produce any code until the interview is complete.

### Phase 1 — Contract table (negative space map)

After a short interview, the skill fills a contract table — one row per boundary:

```
| Boundary          | Invalid state                  | Assert with                     |
|:------------------|:-------------------------------|:--------------------------------|
| param orderId     | null, empty string             | assert.string + assert.notEmpty |
| prior state       | order not in pending status    | assert.equal(order.status, …)   |
| external response | missing transactionId          | assert.notNil(res.id, {…})      |
| output total      | zero or negative               | assert.greater(total, 0)        |
```

Every row must have a non-empty "Assert with" column before any code is written.

### Phase 2 — Guard block first

Every function is scaffolded with guards before logic — no exceptions:

```ts
import { assert, check } from "assertcheck"

function featureName(param1: Type, param2: Type): ReturnType {
  // ── guards — declare what must never enter ───────────────────
  // one assertion per contract table row

  // ── logic — runs with proven invariants ──────────────────────
  // no ?., no ??, no if (!x) return
}
```

### Phase 3 — Logic block

The logic block runs with proven invariants. No defensive checks needed — the boundary is already clean.

---

## Before and after

**❌ Before — TypeScript types + optional chaining + silent return:**

```ts
function filterProductsByCategory(
  products?: Product[] | null,
  category?: ProductCategories
) {
  return products?.filter(product => product?.category === category)
  // products is null → returns undefined silently. Caller has no idea.
}
```

**✅ After — guard block declares the negative space:**

```ts
import { assert, check } from "assertcheck"

function filterProductsByCategory(
  products: Product[],
  category: ProductCategories
): Product[] {
  // ── guards ────────────────────────────────────────────────────
  check(products)
    .notEmpty({
      msg:  "products must be a non-empty array",
      note: "check that the upstream service returned results before calling this",
    })
    .allInstanceOf(Object, "all products must be valid objects")

  assert.string(category, "category must be a string")

  // ── logic ─────────────────────────────────────────────────────
  return products.filter(p => p.category === category)
}
// null products → immediate, traceable failure at the right place.
// Before: null propagated silently, surfaced as a confusing downstream error.
```

**✅ Service method with state guard:**

```ts
function createOrder(customerId: string, items: CartItem[]): Order {
  // ── guards ────────────────────────────────────────────────────
  assert.string(customerId,   "customerId must be a non-empty string")
  assert.notEmpty(customerId, "customerId must not be empty")

  check(items)
    .notEmpty("cart must have at least one item before creating an order")
    .all(i => i.quantity > 0, {
      msg:  "all items must have a positive quantity",
      note: "remove items with quantity ≤ 0 before calling createOrder()",
    })

  // ── logic ─────────────────────────────────────────────────────
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  return { id: crypto.randomUUID(), customerId, items, total, status: "pending" }
}
```

---

## What the skill delivers

1. **Contract table** — boundary → invalid state → assertion (one row per invariant)
2. **Guarded implementation** — guard block before logic, fully typed
3. **Rejected states summary** — one sentence per assertion explaining what invalid state it refuses
