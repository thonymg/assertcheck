---
name: assertcheck-feature
description: Guide a developer building a new TypeScript feature to design it with Negative Space Programming from the start. Trigger when the user says "I'm building a new feature", "create a new function/class/service", "scaffold a new module", or starts writing a new function signature without assertions.
---

# assertcheck-feature

> "An elegant program is not one that checks off all the bullet points from some arbitrary
> feature list; it's one that solves the problem it's meant to solve and does so concisely.
> Its quality is not that it does what it's supposed to; it's that it does almost nothing else."
> — Fabian Giesen, *Negative space in programming*

Negative Space Programming (NSP) starts **before** the first line of logic.
You define the **impossible** before you define the possible.
TypeScript static types are not enough: they vanish at runtime.
Every `??`, `?.`, or `if (!x) return` is a silent failure waiting to happen.
assertcheck makes your negative space **executable and observable**.

---

## When this skill activates

- "I'm creating a new function that…"
- "New service / class / module for…"
- "How do I write this feature with NSP?"
- User shares a function signature or empty function body

---

## Step 0 — Interview the developer first

Ask these questions **before producing any code**. Adapt the list to what the user already told you — skip questions already answered.

```
1. What is the entry point? (function / HTTP handler / class method / constructor)
2. What are the inputs and where do they come from?
   (user input / HTTP body / database / env var / another service)
3. For each input: what makes it invalid? (null, empty, wrong type, out of range…)
4. Does the feature depend on a prior state? (e.g. order must be pending)
5. Does it call an external service / DB? What must be true about the response?
6. What must the output guarantee? (non-null id, positive total, specific status…)
```

Do **not** generate code until you have answers to at least questions 1–3.

---

## Protocol — 3 phases

### Phase 1 — Map the negative space

From the answers above, fill this contract table:

```
| Boundary              | Invalid state                        | Assert with                  |
|:----------------------|:-------------------------------------|:-----------------------------|
| param `X`             | null, empty string, wrong type       | assert.string + assert.notEmpty |
| prior state           | entity not in expected status        | assert.equal(entity.status, …) |
| external response     | missing required field               | assert.notNil(res.field, {…})  |
| output                | computed value out of valid range    | assert.greater(total, 0)       |
```

Load [references/contract-questions.md](references/contract-questions.md) for the full question checklist by feature type.

---

### Phase 2 — Write the guard block first

Structure every new function with a guard block **before** the logic.
This is the NSP pattern: chisel away the impossible, then write only what remains.

```ts
import { assert, check } from "@assertcheck/core"
// docs: https://thonymg.github.io/assertcheck/

function featureName(param1: Type, param2: Type): ReturnType {
  // ── guards — declare what must never enter ───────────────────
  // (all assertions here, before any logic)

  // ── logic — runs with proven invariants ──────────────────────
  // (no defensive checks needed here — the boundary is already clean)
}
```

Load skill `assertcheck-selector` to pick the right assertion for each guard.

---

### Phase 3 — Fill the logic

The logic block runs with **proven invariants**. No `?.`, no `??`, no `if (!x) return`.
The negative space is already declared above.

**Few-shot example — before NSP (typical TypeScript codebase):**

```ts
// ❌ BEFORE — TypeScript types + optional chaining + silent returns
// This is what the defensive programming article calls "abusing optional chaining"
function filterProductsByCategory(
  products?: Product[] | null,
  category?: ProductCategories
) {
  return products?.filter(product => product?.category === category)
  // What happens when products is null? Returns undefined silently.
  // The caller has NO idea the filter did nothing.
}
```

**After NSP with assertcheck:**

```ts
// ✅ AFTER — guard block declares the negative space
import { assert, check } from "@assertcheck/core"

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
// Now: if products is null → immediate, traceable failure at the right place.
// Before: null propagates silently, surfaces as a confusing downstream error.
```

**Another example — service method with state guard:**

```ts
// ✅ createOrder — full guard block + logic separation
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

## Output format

Deliver the new feature in this order:
1. **Contract table** — negative space map (boundary → invalid state → assertion)
2. **Guarded implementation** — guard block + logic block, fully typed
3. **Rejected states summary** — one sentence per assertion explaining what invalid state it refuses

---

## Theoretical foundation

This skill applies four principles from NSP literature:

| Principle | Source | assertcheck translation |
|:----------|:-------|:------------------------|
| TypeScript is not enough at runtime | *Defensive Programming and TypeScript* | `assert.*` fills the runtime gap |
| Declare what is impossible, not just what is possible | *Negative programming* (Marinica) | guard block as explicit negative space |
| Crash early, crash often | *crash-early* pattern | `assert` over `if (!x) return` |
| The guard block is documentation that executes | *Negative space in programming* (fgiesen) | `msg` + `note` = machine-readable comments |

---

## Reference files

- [references/contract-questions.md](references/contract-questions.md) — question checklist per feature type
- [references/guard-templates.md](references/guard-templates.md) — ready-to-use guard blocks for common patterns
- assertcheck docs: https://thonymg.github.io/assertcheck/
