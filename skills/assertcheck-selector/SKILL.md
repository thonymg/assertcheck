---
name: assertcheck-selector
description: Internal utility skill — maps an invariant or code pattern to the correct assertcheck function. Loaded on demand by assertcheck-feature, assertcheck-refactor, assertcheck-audit, and assertcheck-spec. Also triggers directly when the user asks "which assert function should I use for…" or "what is the assertcheck equivalent of…".
---

# assertcheck-selector

> "The main weapons for negative programming are: strong typing, linear types,
> formal verification, tests \u2014 and runtime assertions."
> \u2014 Andrei Marinica, *Negative programming*

Given an invariant to express, this skill returns the **most precise assertcheck call**.

Precision matters: `assert.string` is better than `assert.notNil` when a value must be
a string. The more specific the assertion, the more useful the error message at runtime,
and the more clearly the negative space is declared.

**Full API reference:** https://thonymg.github.io/assertcheck/

---

## Decision tree — pick the most specific match

### 1. Existence

```
must not be null/undefined          → assert.notNil(v, opts)
must not be empty (string or array) → assert.notEmpty(v, opts)
must be null/undefined (rare)       → assert.nil(v, opts)
```

---

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

---

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

---

### 4. Object shape

```
must have key "k"               → assert.hasKey(obj, "k", opts)
must have all of keys           → assert.hasKeys(obj, keys, opts)
must have EXACTLY these keys    → assert.hasExactKeys(obj, keys, opts)
nested path must equal value    → assert.dig(obj, "a.b.c", expected, opts)
must match shape of reference   → assert.homomorphic(obj, ref, opts)
```

---

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

---

### 6. assert.\* vs check() — when to use which

**Use `check()` chains** when 3 or more assertions target the **same value**:

```ts
// ❌ Repetitive
assert.array(users)
assert.notEmpty(users)
assert.all(users, u => u.active)

// ✅ Chain
check(users)
  .notEmpty("users must not be empty")
  .all(u => u.active, "all users must be active")
```

**Use `assert.*` directly** for independent single checks on different values (one assertion per line).

---

### 7. AssertOptions — always provide `msg`, add `note` when the fix is non-obvious

Every assertion should include `msg` with domain context.
`msg` describes the **invariant** (what must be true), not the violation.
`note` gives the developer a concrete fix to apply.

```ts
// ❌ No context — useless at 3am during an incident
assert.notNil(order)

// ✅ Domain context — points directly to the invariant and the fix
assert.notNil(order, {
  msg:    "order must exist before processing payment",
  actual: "orderId",                                        // labels the source in the error output
  note:   "verify the orderId comes from a valid creation flow",
})
```

**`msg` rule — describe the invariant, not the violation:**

| ❌ Describes the violation | ✅ Describes the invariant |
|:--------------------------|:--------------------------|
| `"Not a string"` | `"userId must be a string"` |
| `"Invalid order status"` | `"order must be in pending state before payment"` |
| `"Failed"` | `"payment gateway must return a transactionId"` |

**`note` rule — give the actionable fix:**

| ❌ Restates the problem | ✅ Points to the fix |
|:------------------------|:--------------------|
| `"value was null"` | `"call authenticate() before accessing protected routes"` |
| `"wrong status"` | `"call resetOrder() to return to pending state"` |

---

## Full API reference

- https://thonymg.github.io/assertcheck/
- Namespace: https://thonymg.github.io/assertcheck/functions/check.html
- assert.* functions: https://thonymg.github.io/assertcheck/variables/assert.html

