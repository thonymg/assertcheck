# Chainable API — check()

`check()` wraps a value and lets you chain assertions in a fluent style. Every method calls the matching `assert.*` function, then returns the checker so the next step can run. The chain stops at the first failure.

::: info When to use `check()` vs `assert.*`
Use `check()` when you validate **several invariants on the same value**. Use `assert.*` for independent checks on different values, or when you need the narrowed type outside the chain. Both throw the same `AssertionError` and print the same block.
:::

---

## Which checker do you get?

`check()` picks the checker from the runtime value, and TypeScript overloads give you the matching type:

| Value | Checker | Methods |
|---|---|---|
| Array | `ArrayChecker<T>` | `tap` + array methods |
| Plain object | `ObjectChecker<T>` | `tap` + object methods |
| Anything else | `Checker<T>` | `tap` only |

```ts
import { check } from "assertcheck"

check(users)   // ArrayChecker<User>
check(config)  // ObjectChecker<Config>
check(42)      // Checker<number>
```

Class instances, `Map` and `Set` are not plain objects — they get the bare `Checker`. Use `assert.*` on those.

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

Every method takes the same trailing `opts` as its `assert.*` counterpart: a string or `{ msg, actual, note }`.

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
}
```

### Validating a config object at startup

```ts
function initDb(config: DbConfig) {
  check(config)
    .notEmpty("database config must not be empty")
    .hasKeys(["host", "port", "database"], "missing required database config keys")
    .noNilValues("no database config value may be null")
    .dig("pool.max", 10, {
      msg:  "pool.max must be 10 in production",
      note: "set DATABASE_POOL_MAX=10 in the environment",
    })
}
```

`dig` compares the value at the path with an expected **value** (deep equality). For a predicate on a nested value, read it and use `assert.*`:

```ts
assert.positive(config.pool.max, "pool.max must be positive")
```

### Validating a response from an external service

```ts
async function fetchUserProfile(id: string) {
  const user = await assert.resolvesNotNil(api.getUser(id), "user profile must exist")

  check(user)
    .hasKeys(["id", "email", "role"], "user profile is missing required fields")
    .noNilValues("user profile must not contain null fields")

  assert.includes(["admin", "user", "viewer"], user.role, {
    msg:    "user role must be a known value",
    actual: "user.role",
    note:   "the API may have returned a new role type — update the allowlist",
  })

  return user
}
```

---

## Type narrowing through the chain

Methods that wrap a narrowing assertion return a narrower checker, so later steps see the refined type:

```ts
declare const users: (User | null)[]

check(users)
  .noNils()           // ArrayChecker<User> from here
  .uniqueBy("id")     // u.id is safe
  .all(u => u.active) // u is User, not User | null
```

::: info Narrowing scope
Narrowing applies **inside the chain only**. After it, TypeScript still sees the original type of `users`. When you need the narrowed variable afterwards, call `assert.noNils(users)` directly — `asserts` signatures narrow the variable in the enclosing scope.
:::

---

## `tap` — side effects mid-chain

Available on every checker. Runs a function with the wrapped value and returns the checker unchanged.

```ts
check(orders)
  .tap(v => console.log("orders:", v.length))
  .all(o => o.status === "paid")

check(amountCents).tap(v => assert.integer(v, "amount must be whole cents"))
```

---

## Array methods

| Method | Wraps |
|---|---|
| `.notEmpty(opts?)` | `assert.notEmpty` |
| `.len(n, opts?)` · `.longerThan(n, opts?)` · `.shorterThan(n, opts?)` | Length |
| `.includes(item, opts?)` · `.containsAll(items, opts?)` · `.containsNone(items, opts?)` · `.subset(sub, opts?)` | Membership |
| `.all(pred, opts?)` · `.any(pred, opts?)` · `.none(pred, opts?)` · `.one(pred, opts?)` · `.count(pred, n, opts?)` | Predicates |
| `.elementsMatch(other, opts?)` | Same elements, any order |
| `.unique(opts?)` · `.uniqueBy(key, opts?)` | Uniqueness |
| `.increasing(opts?)` · `.nonDecreasing(opts?)` · `.sortedBy(key, opts?)` | Ordering |
| `.first(expected, opts?)` · `.last(expected, opts?)` | First / last element equals `expected` |
| `.sumBy(key, expected, opts?)` | Sum of a field equals `expected` |
| `.noNils(opts?)` | No `null` / `undefined` — narrows to `NonNullable<T>` |
| `.flat(opts?)` | No nested arrays |
| `.allInstanceOf(Ctor, opts?)` | Every element is an instance — narrows |
| `.zippedWith(other, pred, opts?)` | Pairwise predicate with another array |
| `.groupedBy(key, groups, opts?)` | Grouping by key yields exactly these groups |
| `.partition(pred, nMatch, nRest, opts?)` | Predicate splits the array into the given counts |

## Object methods

| Method | Wraps |
|---|---|
| `.notEmpty(opts?)` | At least one own key |
| `.hasKey(key, opts?)` · `.hasKeys(keys, opts?)` | Required keys — narrow to `T & Record<K, unknown>` |
| `.hasExactKeys(keys, opts?)` | Exactly these keys |
| `.hasOnlyKeys(allowed, opts?)` | No key outside `allowed` |
| `.deepEqual(expected, opts?)` | Deep equality with structural diff |
| `.containsSubset(subset, opts?)` | Partial deep match |
| `.allValuesMatch(pred, opts?)` | Every value satisfies the predicate |
| `.noNilValues(opts?)` | No `null` / `undefined` value |
| `.dig(path, expected, opts?)` | Value at `"a.b.c"` (or `["a","b","c"]`) deep-equals `expected` |

Every method returns `this` except `noNils` and `allInstanceOf`, which return a narrower `ArrayChecker`.

---

## Mixing `check()` and `assert.*`

Use `assert.*` for scalar guards at the function boundary and `check()` for the collection or object that needs several invariants:

```ts
function createOrder(customerId: string, items: CartItem[]): Order {
  assert.notEmpty(customerId, "customerId must not be empty")

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
