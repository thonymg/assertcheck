# Invariant Vocabulary

Standard phrases for writing invariant descriptions in specs.
Use these exact formulations — they translate directly to assertion method names.

---

## Existence invariants

| Phrase | Maps to |
|:-------|:--------|
| "X must exist" | `assert.notNil(x)` |
| "X must be provided" | `assert.notNil(x)` |
| "X must not be absent" | `assert.notNil(x)` |
| "X must not be empty" | `assert.notEmpty(x)` |
| "X must have at least one element" | `assert.notEmpty(x)` |
| "X must be absent" / "X must not be set" | `assert.nil(x)` |

---

## Type invariants

| Phrase | Maps to |
|:-------|:--------|
| "X must be a string" | `assert.string(x)` |
| "X must be a number" | `assert.number(x)` |
| "X must be a boolean" | `assert.boolean(x)` |
| "X must be an integer" | `assert.integer(x)` |
| "X must be a finite number" | `assert.finite(x)` |
| "X must be an array" | `assert.array(x)` |
| "X must be an instance of T" | `assert.instanceOf(x, T)` |

---

## Value invariants

| Phrase | Maps to |
|:-------|:--------|
| "X must equal Y" | `assert.equal(x, y)` |
| "X must not equal Y" | `assert.notEqual(x, y)` |
| "X must deeply equal Y" | `assert.deepEqual(x, y)` |
| "X must be greater than Y" | `assert.greater(x, y)` |
| "X must be greater than or equal to Y" | `assert.greaterOrEqual(x, y)` |
| "X must be positive" | `assert.greater(x, 0)` |
| "X must be within ±delta of Y" | `assert.inDelta(x, y, delta)` |

---

## Shape invariants

| Phrase | Maps to |
|:-------|:--------|
| "X must have field Y" | `assert.hasKey(x, "y")` |
| "X must have fields Y, Z, …" | `assert.hasKeys(x, ["y", "z"])` |
| "X must have exactly fields Y, Z" | `assert.hasExactKeys(x, ["y", "z"])` |
| "X.path.to.field must equal Y" | `assert.dig(x, "path.to.field", y)` |

---

## State invariants

| Phrase | Maps to |
|:-------|:--------|
| "X must be in state S" | `assert.equal(x.status, "S")` |
| "X must not be in state S" | `assert.notEqual(x.status, "S")` |
| "X must have completed step S before Y" | `assert.equal(x.status, "S")` before Y |

---

## Collection invariants

| Phrase | Maps to |
|:-------|:--------|
| "All elements of X must satisfy P" | `assert.all(x, p)` |
| "At least one element of X must satisfy P" | `assert.any(x, p)` |
| "X must contain Y" | `assert.includes(x, y)` |
| "X must contain all of Y" | `assert.containsAll(x, y)` |
| "X must contain none of Y" | `assert.containsNone(x, y)` |
| "X must have exactly N elements" | `assert.len(x, n)` |
