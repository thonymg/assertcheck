# Chainable API — check()

`check()` wraps a value and lets you chain multiple assertions in a fluent, readable style. It is syntactic sugar over the `assert.*` functions — every method on a checker calls the corresponding `assert.*` function internally and throws on failure.

::: info When to use check()
Use `check()` when you are validating multiple invariants on the same value. It reads more naturally and keeps the value name in one place. For single assertions, use `assert.*` directly.
:::

## Basic usage

```ts
import { check } from "assertcheck"

check(users)
  .noNils("no null users")
  .uniqueBy("id", "duplicate user IDs")
  .all(u => u.active, "all users must be active")
  .sortedBy("createdAt")
```

If any assertion fails, it throws immediately with a formatted error.

## Array checks

```ts
check(orders)
  .notEmpty("cart must not be empty")
  .len(3, "expected exactly 3 orders")
  .all(o => o.amount > 0, "all orders must have positive amount")
  .none(o => o.status === "cancelled", "no cancelled orders")
  .unique("order IDs must be unique")
  .noNils()
```

## Object checks

```ts
check(config)
  .notEmpty("config must not be empty")
  .hasKeys(["apiUrl", "timeout"], "missing required config keys")
  .hasExactKeys(["apiUrl", "timeout"], "unexpected extra keys")
```

## Type narrowing

`check()` methods that are assertion functions narrow the TypeScript type, and the narrowing **flows through the chain**:

```ts
declare const users: (User | null)[]

check(users)
  .noNils()           // narrows to User[]
  .uniqueBy("id")     // TS now knows users is User[]
  .all(u => u.active) // u is typed as User, not User | null

// After the chain, TypeScript still sees users as (User | null)[] at this scope.
// The narrowing is local to the chain.
```

::: info Narrowing scope
Type narrowing inside a `check()` chain only applies within the chain. The narrowed type does not propagate to the outer scope. If you need the narrowed type outside the chain, use `assert.*` functions directly.
:::

## Available methods

### Array methods

| Method | Description |
|---|---|
| `.notEmpty(opts?)` | Array must not be empty |
| `.len(n, opts?)` | Exact length |
| `.noNils(opts?)` | No null/undefined elements |
| `.all(predicate, opts?)` | All elements match |
| `.any(predicate, opts?)` | At least one matches |
| `.none(predicate, opts?)` | No elements match |
| `.unique(opts?)` | All elements are unique |
| `.uniqueBy(key, opts?)` | Unique by property key |
| `.sortedBy(key, opts?)` | Sorted ascending by property key |
| `.containsAll(values, opts?)` | Must include all given values |

### Object methods

| Method | Description |
|---|---|
| `.notEmpty(opts?)` | Object must not be empty |
| `.hasKey(key, opts?)` | Must have property |
| `.hasKeys(keys, opts?)` | Must have all given properties |
| `.hasExactKeys(keys, opts?)` | Exactly these properties, nothing more |
