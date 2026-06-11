# Hidden Assumption Scanner

A systematic way to read existing TypeScript code and surface every implicit assumption
the author made but never made explicit. Each assumption is a candidate for an assertion.

---

## Scan pass 1 — Parameter access

For every function parameter, check how it is first used:

| Usage | Implicit assumption | Assert with |
|:------|:--------------------|:------------|
| `param.field` | `param` is not null/undefined | `assert.notNil(param)` |
| `param.length` | `param` is an array/string | `assert.array(param)` or `assert.string(param)` |
| `param.toLowerCase()` | `param` is a string | `assert.string(param)` |
| `param * 2` | `param` is a number | `assert.number(param)` |
| `param > 0` (not guarded) | `param` is a valid number | `assert.number + assert.greater` |
| `param[0]` | `param` is a non-empty array | `assert.array + assert.notEmpty` |

---

## Scan pass 2 — External data access

For every value that comes from outside the function (DB, API, env, config):

| Pattern | Implicit assumption | Assert with |
|:--------|:--------------------|:------------|
| `const x = await repo.find(id)` then `x.field` | `x` is not null | `assert.notNil(x, { actual: "id" })` |
| `process.env.VAR` used directly | env var exists | `assert.notNil(process.env.VAR)` |
| `config.db.host` accessed | `config.db` exists | `assert.hasKeys(config, ["db"])` |
| `response.data.items` used | `response.data` and `items` exist | `assert.notNil + assert.hasKey` |

---

## Scan pass 3 — State dependencies

For every field access on a shared/passed object that implies a lifecycle:

| Pattern | Implicit assumption | Assert with |
|:--------|:--------------------|:------------|
| `order.total` computed | `order` was created, not cancelled | `assert.notEqual(order.status, "cancelled")` |
| `user.session.token` accessed | user is authenticated | `assert.notNil(user.session)` |
| `this.connection.query(…)` | connection is open/established | `assert.notNil(this.connection)` |

---

## Scan pass 4 — Silent exits

Every `if (!x) return` or `x ?? fallback` is a hidden failure path:

| Pattern | Risk | Replacement |
|:--------|:-----|:------------|
| `if (!x) return` | caller never knows the function did nothing | `assert.notNil(x, "…")` |
| `x ?? "default"` | invalid input silently becomes a valid-looking default | `assert.notNil(x, "…"); use x` |
| `x?.field` without fallback | undefined propagates downstream | `assert.notNil(x); x.field` |
| `try { … } catch { return null }` | error swallowed, no trace | let it throw with context |

---

## Scan pass 5 — Collection operations

| Pattern | Implicit assumption | Assert with |
|:--------|:--------------------|:------------|
| `.map(fn)` | array is not empty (if empty → silent no-op) | `assert.notEmpty(arr)` |
| `.find(fn)` result used directly | element was found | `assert.notNil(result, "…")` |
| `.filter(fn)` result used | filtered result is meaningful | `assert.notEmpty(filtered, "…")` |
| `arr[0]` accessed | array has at least one element | `assert.notEmpty(arr)` |
