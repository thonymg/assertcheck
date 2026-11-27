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
| promise resolves / resolves to a value / resolves and satisfies | `await assert.resolves(p)` (returns the value), `resolvesWith(p, expected)`, `resolvesSatisfying(p, pred)`, `resolvesNotNil(p)` |
| promise rejects (any / class / message / pattern / predicate) | `await assert.rejects(p, ErrorClass)`, `rejectsWithMessage(p, msg)`, `rejectsMatching(p, /re/)`, `rejectsSatisfying(p, pred)` |
| exactly n elements satisfy / array order / first / last | `assert.count(arr, pred, n)`, `assert.increasing(nums)` (strict), `assert.nonDecreasing(nums)`, `assert.first(arr, x)`, `assert.last(arr, x)` |
| same elements any order / is a subset / contains all of | `assert.elementsMatch(a, b)`, `assert.subset(arr, required)` (all of `required` is in `arr`), `assert.containsAll(arr, items)` |
| array is flat / all instances of T / pairwise predicate | `assert.flat(arr)`, `assert.allInstanceOf(arr, T)`, `assert.zippedWith(a, b, (x, y) => …)` |
| sum / group keys / partition sizes | `assert.sumBy(arr, "totalCents", expected)`, `assert.groupedBy(arr, "type", ["a", "b"])`, `assert.partition(arr, pred, nMatch, nRest)` |
| object key equals / contains pairs / all values match / no nil values | `assert.hasValue(o, "k", v)`, `assert.containsSubset(o, { role: "admin" })`, `assert.allValuesMatch(o, pred)`, `assert.noNilValues(o)` |
| function returns / arity / pure / idempotent / distinct / homomorphic | `assert.returns(fn, args, expected)`, `arity(fn, n)`, `pure`, `idempotent`, `mapsDistinct(fn, a, b)`, `homomorphic(fn, combine, a, b)` (tests, not production code) |
| null or undefined / empty | `assert.nil(v)`, `assert.empty(v)` |
| function is pure / idempotent | `assert.pure(fn, ...)` `assert.idempotent(fn, arg)` (tests, not production code) |

## `assert.*` or `check()`

2 or fewer assertions on the same value: `assert.*`, one per line. 3 or more: a `check()` chain, **only for an array or a plain object** (`check(scalar)` has no assertion methods: keep `assert.*` lines for a string, number or boolean).

Chain methods: `ArrayChecker` has `notEmpty len longerThan shorterThan includes all any none one count unique uniqueBy noNils sortedBy increasing nonDecreasing first last subset elementsMatch containsAll containsNone flat groupedBy sumBy allInstanceOf zippedWith partition`; `ObjectChecker` has `notEmpty hasKey hasKeys hasExactKeys hasOnlyKeys deepEqual containsSubset noNilValues allValuesMatch dig`. Anything else (types, numbers, equality, async): `assert.*`.

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

## From hand-written code to assertion (existing code)

What to replace each hand-rolled check with. The condition shown is the one that triggers the failure.

| Hand-written (fails when…) | Assertion |
|:--|:--|
| `x == null`, `x === undefined` | `assert.notNil(x)` |
| `!x`, `x === ""`, `x.length === 0`, `Object.keys(o).length === 0` | `assert.notEmpty(x)` |
| `typeof x !== "string"` / `"number"` / `"boolean"` / `"function"` / `"object"` | `assert.string` `number` `boolean` `func` `object` |
| `!Number.isFinite(x)`, `Number.isNaN(x)` | `assert.finite(x)` |
| `!Number.isInteger(x)`, `!Number.isSafeInteger(x)` | `assert.integer(x)` |
| `!Array.isArray(x)` | `assert.array(x)` |
| `!(x instanceof T)` | `assert.instanceOf(x, T)` |
| `a !== b` | `assert.equal(a, b)` |
| `JSON.stringify(a) !== JSON.stringify(b)`, `!isDeepStrictEqual` | `assert.deepEqual(a, b)` |
| `n <= 0`, `n >= 0`, `n !== 0` | `assert.positive(n)`, `assert.negative(n)`, `assert.zero(n)` |
| `n < min \|\| n > max` | `assert.withinRange(n, min, max)` |
| `Math.abs(a - b) > d` | `assert.inDelta(a, b, d)` |
| `arr.length !== n`, `< n`, `> n` | `assert.len(arr, n)`, `assert.longerThan(arr, n - 1)`, `assert.shorterThan(arr, n + 1)` |
| `!arr.includes(x)` | `assert.includes(arr, x)` |
| `!arr.every(f)`, `!arr.some(f)`, `arr.some(f)`, `arr.filter(f).length !== 1` | `assert.all(arr, f)`, `assert.any(arr, f)`, `assert.none(arr, f)`, `assert.one(arr, f)` |
| `arr.filter(f).length !== n` | `assert.count(arr, f, n)` |
| `new Set(arr).size !== arr.length`, `[...new Set(arr)]` that hides duplicates | `assert.unique(arr)` |
| duplicate ids / unsorted by a field | `assert.uniqueBy(arr, "id")`, `assert.sortedBy(arr, "createdAt")` |
| `arr.some((v) => v == null)`, `.filter(Boolean)` that hides nils | `assert.noNils(arr)` |
| `!(k in o)`, `!Object.hasOwn(o, k)`, `!o.hasOwnProperty(k)`, `o[k] === undefined` | `assert.hasKey(o, k)` |
| `o.status !== "pending"` | `assert.hasValue(o, "status", "pending")` or `assert.equal(o.status, "pending")` |
| value not in a closed set (`switch` default, `ternary` fallthrough) | `assert.includes(["a", "b"], x)` |
| `try { await p } catch { return null }`, `.catch(() => null)` | `await assert.resolves(p)` or `await assert.resolvesNotNil(p)` |
| `try { await p; fail() } catch {}` (expects a rejection) | `await assert.rejects(p, ErrorClass)` |
| `x!` | `assert.notNil(x)` (narrows the type) |
| `x ?? (() => { throw … })()`, `if (!x) throw …` | the assertion of the row above that matches the condition |

