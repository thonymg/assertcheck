# Chainable API — check()

`check()` wraps a value and lets you chain multiple assertions in a fluent, readable style. Every method calls the corresponding `assert.*` function internally and throws on the first failure.

::: info When to use `check()` vs `assert.*`
Use `check()` when you're validating **three or more invariants on the same value**. Use `assert.*` directly for independent checks on different values. Both are equivalent at runtime — `check()` is purely a readability choice.
:::

---

## Basic usage

```ts
import { check } from "assertcheck"

check(users)
  .noNils("no null users allowed")
  .uniqueBy("id", "duplicate user IDs")
  .all(u => u.active, "all users must be active")
  .sortedBy("createdAt")
```

If any assertion fails, it throws immediately with a formatted error — the chain stops at the first violated invariant.

---

## Real-world patterns

### Validating a batch before processing

```ts
function processBatch(orders: Order[]) {
  check(orders)
    .notEmpty("batch must not be empty")
    .noNils("all orders must be non-null")
    .all(o => o.amount > 0, {
      msg:  "all orders must have a positive amount",
      note: "filter zero-amount orders before building the batch",
    })
    .uniqueBy("id", "duplicate order IDs in batch")
    .len(orders.length, "batch size must match the declared count")
}
```

### Validating a config object at startup

```ts
function initDb(config: unknown) {
  check(config)
    .notEmpty("database config must not be empty")
    .hasKeys(["host", "port", "database"], "missing required database config keys")
    .dig("pool.max", v => v > 0, {
      msg:  "pool.max must be a positive number",
      note: "set DATABASE_POOL_MAX in your environment",
    })
}
```

### Validating a response from an external service

```ts
async function fetchUserProfile(id: string) {
  const user = await api.getUser(id)

  check(user)
    .notEmpty("user profile must not be empty")
    .hasKeys(["id", "email", "role"], "user profile is missing required fields")
    .dig("role", r => ["admin", "user", "viewer"].includes(r), {
      msg:  "user role must be a known value",
      note: "the API may have returned a new role type — update the allowlist",
    })

  return user
}
```

---

## Type narrowing through the chain

`check()` methods that call narrowing assertions propagate the narrowed type through subsequent steps in the chain:

```ts
declare const users: (User | null)[]

check(users)
  .noNils()           // narrows to User[] — subsequent steps know this
  .uniqueBy("id")     // TypeScript sees User[], u.id is safe
  .all(u => u.active) // u is typed as User, not User | null
```

::: info Narrowing scope
Type narrowing applies **within the chain only**. After the chain, TypeScript still sees the original type at the outer scope. If you need the narrowed type outside the chain, use `assert.*` directly — those narrow the variable in the enclosing scope.
:::

---

## Array methods

| Method | Assertion |
|---|---|
| `.notEmpty(opts?)` | Array must not be empty |
| `.len(n, opts?)` | Exact length must equal `n` |
| `.noNils(opts?)` | No null or undefined elements |
| `.all(predicate, opts?)` | Every element satisfies predicate |
| `.any(predicate, opts?)` | At least one element satisfies predicate |
| `.none(predicate, opts?)` | No elements satisfy predicate |
| `.unique(opts?)` | All elements are strictly unique |
| `.uniqueBy(key, opts?)` | Unique by property key |
| `.sortedBy(key, opts?)` | Sorted ascending by property key |
| `.containsAll(values, opts?)` | Must include all given values |
| `.first(predicate?, opts?)` | First element must satisfy predicate |
| `.last(predicate?, opts?)` | Last element must satisfy predicate |
| `.flat(opts?)` | Must not contain nested arrays |
| `.allInstanceOf(Ctor, opts?)` | All elements are instances of constructor |

## Object methods

| Method | Assertion |
|---|---|
| `.notEmpty(opts?)` | Object must not be empty (no own keys) |
| `.hasKey(key, opts?)` | Must have the given property |
| `.hasKeys(keys, opts?)` | Must have all given properties |
| `.hasExactKeys(keys, opts?)` | Exactly these properties — no extras, no missing |
| `.hasOnlyKeys(keys, opts?)` | Only these properties allowed (subset allowed) |
| `.dig(path, expected, opts?)` | Nested path must equal expected value |
| `.allValuesMatch(predicate, opts?)` | All values must satisfy predicate |
| `.noNilValues(opts?)` | No null or undefined values |

---

## Chaining after `assert.*`

`check()` and `assert.*` can be combined freely. Use `assert.*` for conditions that belong at the top of a function boundary and `check()` for validating a specific complex value:

```ts
function createOrder(customerId: string, items: CartItem[]): Order {
  // Single-value guards at the boundary
  assert.string(customerId, "customerId must be a non-empty string")
  assert.notEmpty(customerId, "customerId must not be empty")

  // Complex collection validation with check()
  check(items)
    .notEmpty("cart must contain at least one item")
    .noNils("no null items allowed in cart")
    .all(i => i.quantity > 0, {
      msg:  "all items must have positive quantity",
      note: "remove items with quantity ≤ 0 before calling createOrder()",
    })
    .all(i => i.price > 0, "all items must have a positive price")

  // ... logic
}
```
