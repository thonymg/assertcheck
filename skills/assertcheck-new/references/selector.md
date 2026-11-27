# Which assertion for which invariant

API reference: https://thonymg.github.io/assertcheck/

Always pick the **most specific** assertion: `assert.string` over `assert.notNil` for a string, `assert.notEmpty` over `assert.notNil` for a non-empty value (it covers nil too). Return one recommendation per invariant, not a list.

| Invariant | Assertion |
|:--|:--|
| not null / undefined | `assert.notNil(v)` |
| not empty (string, array, object) | `assert.notEmpty(v)` |
| string / number / boolean / integer / finite / array / function | `assert.string` `number` `boolean` `integer` `finite` `array` `func` |
| plain object | `assert.object(v)` |
| instance of T | `assert.instanceOf(v, T)` |
| equals expected | `assert.equal(a, b)`; deep: `assert.deepEqual(a, b)` |
| must NOT equal / must NOT have | `assert.not(assert.equal, a, b)`, `assert.not(assert.hasKey, o, "id")` (takes no opts) |
| `>` `>=` `<` `<=` | `assert.greater` `greaterOrEqual` `less` `lessOrEqual` |
| positive / negative / zero | `assert.positive` `negative` `zero` |
| within range / within delta | `assert.withinRange(v, min, max)`, `assert.inDelta(a, b, delta)` |
| has key / all keys / exactly these keys / only these keys | `assert.hasKey` `hasKeys` `hasExactKeys` `hasOnlyKeys` |
| nested path equals | `assert.dig(obj, "a.b.c", expected)` |
| array length | `assert.len(arr, n)` `longerThan` `shorterThan` |
| array includes / contains all / contains none | `assert.includes` `containsAll` `containsNone` |
| every / some / none / exactly one element satisfies | `assert.all` `any` `none` `one` |
| no nil elements / unique / unique by key / sorted by key | `assert.noNils` `unique` `uniqueBy(arr, "id")` `sortedBy(arr, "createdAt")` |
| promise result | `await assert.resolvesNotNil(p)`, `await assert.rejects(() => p, ErrorClass)` |
| function is pure / idempotent | `assert.pure(fn, ...)` `assert.idempotent(fn, arg)` (tests, not production code) |

## `assert.*` or `check()`

2 or fewer assertions on the same value: `assert.*`, one per line. 3 or more: a `check()` chain.

```ts
check(users)
  .notEmpty("users must not be empty")
  .noNils("no null users")
  .uniqueBy("id", "duplicate user ids")
```

## `msg`, `note`, `actual`

- `msg`: the invariant. `"payment gateway must return a transactionId"`, not `"Failed"`.
- `note`: the recovery path. `"call resetOrder() before retrying"`, not `"wrong status"`.
- `actual`: label for the received value (`actual: "order.status"`).

```ts
assert.notNil(order, {
  msg:    "order must exist before processing payment",
  actual: "orderId",
  note:   "verify the orderId comes from a valid creation flow",
})
```

## Mistakes

| Wrong | Right | Why |
|:--|:--|:--|
| `assert.notNil(x)` when x must be a string | `assert.string(x)` | `notNil` lets numbers and arrays through |
| `assert.equal(x, true)` | `assert.boolean(x)` | `equal` does not enforce the type |
| `assert.array(x)` when x needs elements | `check(x).notEmpty()` | `array` accepts `[]` |
