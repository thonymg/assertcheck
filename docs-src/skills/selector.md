# assertcheck-selector

Instant lookup: which `assert.*` call for which invariant?
Used internally by all other skills. Also available directly when you're unsure which assertion to reach for.

> "The main weapons for negative programming are: strong typing, linear types, formal verification, tests — and runtime assertions."
> — Andrei Marinica, *Negative programming*

---

## When to use it

- "Which assert function should I use for…?"
- "What is the assertcheck equivalent of…?"
- Called automatically by the other skills when selecting an assertion

---

## The rule: always pick the most specific assertion

`assert.string` beats `assert.notNil` when a value must be a string.
`assert.notEmpty` beats `assert.notNil` when a value must be non-empty — it covers nil AND empty in one call.

The more specific the assertion, the more useful the error at runtime.

---

## Decision tree

### Existence

```
must not be null/undefined          → assert.notNil(v, opts)
must not be empty (string or array) → assert.notEmpty(v, opts)   ← covers nil too
must be null/undefined (rare)       → assert.nil(v, opts)
```

### Type

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

### Value / equality

```
must strictly equal expected   → assert.equal(a, b, opts)
must NOT equal                 → assert.not(assert.equal, a, b)   (not() takes no opts)
must deep equal                → assert.deepEqual(a, b, opts)
must be > b                    → assert.greater(a, b, opts)
must be >= b                   → assert.greaterOrEqual(a, b, opts)
must be < b                    → assert.less(a, b, opts)
must be <= b                   → assert.lessOrEqual(a, b, opts)
must be within ± delta of b    → assert.inDelta(a, b, delta, opts)
```

### Object shape

```
must have key "k"               → assert.hasKey(obj, "k", opts)
must have all of keys           → assert.hasKeys(obj, keys, opts)
must have EXACTLY these keys    → assert.hasExactKeys(obj, keys, opts)
nested path must equal value    → assert.dig(obj, "a.b.c", expected, opts)
must match shape of reference   → assert.homomorphic(obj, ref, opts)
```

### Collection

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

---

## `assert.*` vs `check()` — the rule

| Situation | Use |
|:----------|:----|
| 2 or fewer assertions on the same value | `assert.*` — one per line |
| 3 or more assertions on the same value | `check()` — chain them |

```ts
// ❌ 3 separate assert.* on the same value
assert.array(users)
assert.notEmpty(users)
assert.all(users, u => u.active)

// ✅ check() chain
check(users)
  .notEmpty("users must not be empty")
  .all(u => u.active, "all users must be active")
```

---

## Writing `AssertOptions` — `msg` and `note`

Every assertion should include `msg`. Add `note` when the fix is non-obvious.

```ts
// ❌ No context — useless during an incident
assert.notNil(order)

// ✅ Domain context — invariant + fix in one place
assert.notNil(order, {
  msg:    "order must exist before processing payment",
  actual: "orderId",
  note:   "verify the orderId comes from a valid creation flow",
})
```

**`msg` — describe the invariant, not the violation:**

| ❌ Violation | ✅ Invariant |
|:------------|:------------|
| `"Not a string"` | `"userId must be a string"` |
| `"Invalid order status"` | `"order must be in pending state before payment"` |
| `"Failed"` | `"payment gateway must return a transactionId"` |
| `"value is null"` | `"orderId must be a non-empty string"` |

**`note` — point to the actionable fix:**

| ❌ Restates the problem | ✅ Points to the fix |
|:------------------------|:--------------------|
| `"value was null"` | `"call authenticate() before accessing protected routes"` |
| `"wrong status"` | `"call resetOrder() to return to pending state"` |

---

## Common mistakes

| ❌ Wrong | ✅ Correct | Why |
|:---------|:----------|:----|
| `assert.notNil(x)` when x must be a string | `assert.string(x)` | `notNil` allows numbers, booleans, arrays |
| `assert.notNil(x)` when x must be non-empty | `assert.notEmpty(x)` | `notEmpty` covers nil AND empty |
| `assert.equal(x, true)` | `assert.boolean(x)` then use `x` | `equal(x, true)` doesn't enforce type |
| `assert.array(x)` when x must have elements | `check(x).notEmpty()` | `array` allows `[]` |
| 3+ `assert.*` on the same value | `check(x).method1().method2().method3()` | chains are cleaner |

---

## Full API reference

- [assertcheck docs](https://thonymg.github.io/assertcheck/)
- [`check()` namespace](https://thonymg.github.io/assertcheck/functions/check.html)
- [`assert.*` functions](https://thonymg.github.io/assertcheck/variables/assert.html)
