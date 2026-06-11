# assertcheck-feature

Build a new TypeScript feature with Negative Space Programming from the first line.

> "An elegant program is not one that checks off all the bullet points from some arbitrary
> feature list; it's one that solves the problem it's meant to solve and does so concisely."
> — Fabian Giesen, *Negative space in programming*

---

## When to use it

- "I'm creating a new function that…"
- "New service / class / module for…"
- "How do I write this feature with NSP?"
- You have a function signature but no body yet

---

## What the skill does

The skill runs a **3-phase protocol** that forces the negative space into view before
any logic is written.

### Phase 1 — Map the negative space

The skill interviews you first. It asks:

1. What is the entry point?
2. What are the inputs and where do they come from?
3. What makes each input invalid?
4. Does the feature depend on a prior state?
5. Does it call an external service or DB? What must be true about the response?
6. What must the output guarantee?

From your answers, it produces a **contract table**:

```
| Boundary          | Invalid state                  | Assert with                     |
|:------------------|:-------------------------------|:--------------------------------|
| param orderId     | null, empty string             | assert.string + assert.notEmpty |
| prior state       | order not in pending status    | assert.equal(order.status, …)   |
| external response | missing transactionId          | assert.notNil(res.id, {…})      |
| output total      | zero or negative               | assert.greater(total, 0)        |
```

### Phase 2 — Write the guard block first

Every new function is scaffolded in two sections — guards before logic:

```ts
import { assert, check } from "assertcheck"

function featureName(param1: Type, param2: Type): ReturnType {
  // ── guards — declare what must never enter ───────────────────
  // (all assertions here, before any logic)

  // ── logic — runs with proven invariants ──────────────────────
  // (no defensive checks needed here — the boundary is already clean)
}
```

### Phase 3 — Fill the logic

The logic block runs with **proven invariants**. No `?.`, no `??`, no `if (!x) return`.
The negative space was declared above.

---

## Example output

**Before NSP — typical TypeScript:**

```ts
// Silent failure: returns undefined when products is null
function filterProductsByCategory(
  products?: Product[] | null,
  category?: ProductCategories
) {
  return products?.filter(product => product?.category === category)
}
```

**After NSP with assertcheck:**

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

  // ── logic — runs with proven invariants ──────────────────────
  return products.filter(p => p.category === category)
}
```

If `products` is `null` → immediate, traceable failure at the right place.  
Before: `null` propagated silently, surfaced as a confusing downstream error.

---

## What the skill delivers

1. **Contract table** — negative space map (boundary → invalid state → assertion)
2. **Guarded implementation** — guard block + logic block, fully typed
3. **Rejected states summary** — one sentence per assertion explaining what it refuses
