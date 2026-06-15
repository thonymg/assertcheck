---
name: assertcheck-selector
description: Internal utility skill — maps an invariant or code pattern to the correct assertcheck function. Loaded on demand by assertcheck-feature, assertcheck-refactor, assertcheck-audit, and assertcheck-spec. Also triggers directly when the user asks "which assert function should I use for…" or "what is the assertcheck equivalent of…".
---

# assertcheck-selector

**Full API reference:** https://thonymg.github.io/assertcheck/

---

## LAWS

**LAW 1 — Always pick the most specific assertion.**
`assert.string` beats `assert.notNil` when a value must be a string.
`assert.notEmpty` beats `assert.notNil` when a value must be non-empty.
The more specific the assertion, the more useful the error at runtime.

**LAW 2 — Use `check()` chains when 3+ assertions target the same value.**
Never write 3+ `assert.*` calls on the same variable when a chain is available.

**LAW 3 — Every assertion must have `msg`. Add `note` when the fix is non-obvious.**
`msg` describes the invariant ("orderId must be a non-empty string").
`note` gives the actionable fix ("check that the caller passes a valid order id").
`msg: "value is null"` is a violation of this law.

**LAW 4 — Return exactly one assertion recommendation per invariant.**
Do not return a list of options. Pick the most specific. Explain if alternatives exist.

---

## Triggers

- "Which assert function should I use for…"
- "What is the assertcheck equivalent of…"
- Called by `assertcheck-spec`, `assertcheck-feature`, `assertcheck-audit`, `assertcheck-refactor`

---

## Decision tree

### 1. Existence

```
value must not be null/undefined          → assert.notNil(v, opts)
value must not be empty (string or array) → assert.notEmpty(v, opts)   ← covers nil too
value must be null/undefined (rare)       → assert.nil(v, opts)
```

### 2. Type

```
must be a string       → assert.string(v, opts)
must be a number       → assert.number(v, opts)
must be a boolean      → assert.boolean(v, opts)
must be an integer     → assert.integer(v, opts)
must be finite         → assert.finite(v, opts)
must be an array       → assert.array(v, opts)
must be a function     → assert.func(v, opts)
must be instance of T  → assert.instanceOf(v, T, opts)
```

### 3. Value / equality

```
must strictly equal expected   → assert.equal(a, b, opts)
must NOT equal                 → assert.notEqual(a, b, opts)
must deep equal                → assert.deepEqual(a, b, opts)
must be > b                    → assert.greater(a, b, opts)
must be >= b                   → assert.greaterOrEqual(a, b, opts)
must be < b                    → assert.less(a, b, opts)
must be <= b                   → assert.lessOrEqual(a, b, opts)
must be within ± delta of b    → assert.inDelta(a, b, delta, opts)
```

### 4. Object shape

```
must have key "k"               → assert.hasKey(obj, "k", opts)
must have all of keys           → assert.hasKeys(obj, keys, opts)
must have EXACTLY these keys    → assert.hasExactKeys(obj, keys, opts)
nested path must equal value    → assert.dig(obj, "a.b.c", expected, opts)
must match shape of reference   → assert.homomorphic(obj, ref, opts)
```

### 5. Collection

```
must not be empty               → assert.notEmpty(arr, opts)
must have exactly N elements    → assert.len(arr, n, opts)
must include element            → assert.includes(arr, el, opts)
must contain all of elements    → assert.containsAll(arr, els, opts)
must contain none of elements   → assert.containsNone(arr, els, opts)
every element satisfies P       → assert.all(arr, p, opts)
at least one element satisfies  → assert.any(arr, p, opts)
all elements are instance of T  → assert.allInstanceOf(arr, T, opts)
elements match expected array   → assert.elementsMatch(arr, expected, opts)
```

### 6. `assert.*` vs `check()` — the rule

```
2 or fewer assertions on the same value → assert.*  (one per line)
3 or more assertions on the same value  → check()   (chain)
```

```ts
// ❌ 3 assert.* on the same value — use check() instead
assert.array(users)
assert.notEmpty(users)
assert.all(users, u => u.active)

// ✅ chain
check(users)
  .notEmpty("users must not be empty")
  .all(u => u.active, "all users must be active")
```

### 7. AssertOptions — exact rules

**`msg` — describes the invariant, not the violation:**

| ❌ Violation | ✅ Invariant |
|:------------|:------------|
| `"Not a string"` | `"userId must be a string"` |
| `"Invalid order status"` | `"order must be in pending state before payment"` |
| `"Failed"` | `"payment gateway must return a transactionId"` |
| `"value is null"` | `"orderId must be a non-empty string"` |

**`note` — gives the actionable fix:**

| ❌ Restates the problem | ✅ Points to the fix |
|:------------------------|:--------------------|
| `"value was null"` | `"call authenticate() before accessing protected routes"` |
| `"wrong status"` | `"call resetOrder() to return to pending state"` |

**Full example:**

```ts
// ❌ No context
assert.notNil(order)

// ✅ Domain context
assert.notNil(order, {
  msg:    "order must exist before processing payment",
  actual: "orderId",
  note:   "verify the orderId comes from a valid creation flow",
})
```

---

## Anti-patterns

| ❌ Wrong | ✅ Correct | Why |
|:---------|:----------|:----|
| `assert.notNil(x)` when x must be a string | `assert.string(x)` | `notNil` is too permissive — allows numbers, booleans, arrays |
| `assert.notNil(x)` when x must be non-empty | `assert.notEmpty(x)` | `notEmpty` covers nil AND empty — one call |
| `assert.equal(x, true)` | `assert.boolean(x)` then use `x` | `equal(x, true)` doesn't enforce type |
| `assert.array(x)` when x must have elements | `check(x).notEmpty()` | `array` allows `[]` |
| 3+ `assert.*` on the same value | `check(x).method1().method2().method3()` | Chains are cleaner and less repetitive |
| `msg: "value is null"` | `msg: "orderId must be a non-empty string"` | `msg` describes invariant, not violation |
| No `note` when the fix is non-obvious | `note: "call authenticate() before accessing this"` | `note` is the developer's recovery path |

---

## SELF-CHECK — run before delivering

- [ ] Recommendation is a single, most-specific assertion (not a list of options)
- [ ] `check()` used when 3+ assertions on the same value
- [ ] `msg` describes the invariant, not the violation
- [ ] `note` included when the fix is non-obvious
- [ ] No `assert.notNil` where `assert.string` or `assert.notEmpty` is more precise

If any item fails → fix before delivering.
