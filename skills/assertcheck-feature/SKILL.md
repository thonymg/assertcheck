---
name: assertcheck-feature
description: Guide a developer building a new TypeScript feature to design it with Negative Space Programming from the start. Trigger when the user says "I'm building a new feature", "create a new function/class/service", "scaffold a new module", or starts writing a new function signature without assertions.
---

# assertcheck-feature

## References — load before starting

- [references/contract-questions.md](references/contract-questions.md)
- [references/guard-templates.md](references/guard-templates.md)

---

## LAWS

**LAW 1 — Interview before any code.**
Never produce a contract table, guard block, or implementation until Q1, Q2, and Q3 are answered.
Skip questions the user already answered — ask only what's missing.

**LAW 2 — Contract table before guard block.**
Phase 1 (contract table) must be complete before Phase 2 (guard block) is written.
Every row in the contract table must have a non-empty "Assert with" column.
Unsure? Load `assertcheck-selector`.

**LAW 3 — Guard block before logic. Always.**
The `// ── guards ──` block is the first thing in every function body.
No logic before the last assertion. No exceptions.

**LAW 4 — No `?.`, `??`, or `if (!x) return` in the logic block.**
The negative space is declared in the guard block. The logic block runs with proven invariants.
If you're tempted to add a nil check in the logic block, it belongs in the guard block.

**LAW 5 — Every guard must have `msg`. Add `note` when the fix is non-obvious.**
`msg` describes the invariant ("orderId must be a non-empty string").
`note` gives the actionable fix ("check that the caller passes a valid order id").

**LAW 6 — Deliver in order: contract table → implementation → rejected states summary.**
Never skip the rejected states summary. One sentence per assertion.

---

## Triggers

- "I'm creating a new function that…"
- "New service / class / module for…"
- "How do I write this feature with NSP?"
- User shares a function signature or empty function body

---

## Interview — ask before any output

```
1. What is the entry point? (function / HTTP handler / class method / constructor)
2. What are the inputs and where do they come from?
   (user input / HTTP body / database / env var / another service)
3. For each input: what makes it invalid? (null, empty, wrong type, out of range…)
4. Does the feature depend on a prior state? (e.g. order must be pending)
5. Does it call an external service / DB? What must be true about the response?
6. What must the output guarantee? (non-null id, positive total, specific status…)
```

See `references/contract-questions.md` for the extended checklist by feature type.

---

## Protocol — 3 phases

### Phase 1 — Contract table

Fill from interview answers. Every row must have "Assert with".

```
| Boundary          | Invalid state                     | Assert with                     |
|:------------------|:----------------------------------|:--------------------------------|
| param `X`         | null, empty string, wrong type    | assert.string + assert.notEmpty |
| prior state       | entity not in expected status     | assert.equal(entity.status, …)  |
| external response | missing required field            | assert.notNil(res.field, {…})   |
| output            | computed value out of valid range | assert.greater(total, 0)        |
```

### Phase 2 — Guard block first

```ts
import { assert, check } from "assertcheck"
// docs: https://thonymg.github.io/assertcheck/

function featureName(param1: Type, param2: Type): ReturnType {
  // ── guards — declare what must never enter ───────────────────
  // one assertion per contract table row, in order

  // ── logic — runs with proven invariants ──────────────────────
  // no ?., no ??, no if (!x) return
}
```

Use `references/guard-templates.md` for common patterns.
Load `assertcheck-selector` to pick the right assertion.

### Phase 3 — Logic block

No defensive checks. The negative space is already declared above.

---

## Canonical examples

**❌ BEFORE — TypeScript + optional chaining + silent returns:**

```ts
function filterProductsByCategory(
  products?: Product[] | null,
  category?: ProductCategories
) {
  return products?.filter(product => product?.category === category)
  // null products → returns undefined silently. Caller has no idea.
}
```

**✅ AFTER — guard block declares the negative space:**

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

## SELF-CHECK — run before delivering

- [ ] Interview: Q1, Q2, Q3 answered before any code was produced
- [ ] Contract table: every row has a non-empty "Assert with" column
- [ ] Guard block: appears before the first line of logic in every function
- [ ] Logic block: contains no `?.`, `??`, or `if (!x) return`
- [ ] Every assertion has `msg` with domain context (not "value is null")
- [ ] Output delivered in order: contract table → implementation → rejected states summary
- [ ] Rejected states summary: one sentence per assertion

If any item fails → fix before delivering.
