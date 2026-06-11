# Boundary Scan Checklist

A line-by-line scan guide. Work through each category in order.
Mark each signal found with: boundary type, line number, and implicit assumption.

---

## Category A — Function parameters

Read the function signature, then trace the first usage of each parameter.

| Signal | Boundary | Implicit assumption |
|:-------|:---------|:--------------------|
| `param.field` before any nil check | Function entry | param is not null/undefined |
| `param[0]` before any length check | Function entry | param has at least one element |
| `param.toLowerCase()` without type check | Function entry | param is a string |
| `param * multiplier` without type check | Function entry | param is a number |
| `typeof param` checked mid-function (not at top) | Function entry | type check is too late |

---

## Category B — External data (DB, API, service)

Find every `await` call that returns data used immediately after.

| Signal | Boundary | Implicit assumption |
|:-------|:---------|:--------------------|
| `const x = await repo.find(id)` → `x.field` | Integration | x is not null |
| `const res = await http.get(url)` → `res.data.items` | Integration | res.data and items exist |
| `const rows = await db.query(…)` → `rows[0]` | Integration | rows is non-empty |
| `const config = loadConfig()` → `config.db.host` | External input | config.db exists |

---

## Category C — Environment and config

Find every `process.env.X` or `config.X.Y` access.

| Signal | Boundary | Implicit assumption |
|:-------|:---------|:--------------------|
| `process.env.VAR` used without nil check | External input | VAR is set |
| `config.section.field` accessed directly | External input | section and field exist |
| `options.timeout ?? 5000` used as config | External input | should this ever be absent? |

---

## Category D — State machine fields

Find every access to a field that represents entity lifecycle state.

| Signal | Boundary | Implicit assumption |
|:-------|:---------|:--------------------|
| `entity.status` read without asserting current state | State machine | entity is in expected state |
| `this.connection.query()` called directly | State machine | connection is open |
| `user.session.token` accessed | State machine | user is authenticated |
| `order.paymentId` accessed | State machine | payment was completed |

---

## Category E — Silent exits and fallbacks

Find every place where an invalid state is swallowed.

| Signal | Risk | Real fix |
|:-------|:-----|:---------|
| `if (!x) return` | 🟠 High — caller gets undefined silently | `assert.notNil(x, "…")` |
| `x ?? "default"` | 🟡 Medium — invalid input becomes valid-looking | `assert.notNil(x, "…"); use x` |
| `x?.field` without fallback | 🟡 Medium — undefined propagates downstream | `assert.notNil(x); x.field` |
| `try { … } catch { return null }` | 🔴 Critical — error swallowed entirely | let it throw with an assertion before |
| `catch (e) { console.log(e) }` | 🟠 High — logged but not surfaced | let it throw or rethrow with context |

---

## Category F — Collection operations

| Signal | Boundary | Implicit assumption |
|:-------|:---------|:--------------------|
| `.map(fn)` on unchecked value | Collection | value is an array |
| `.filter(fn)` result used without empty check | Collection | at least one match exists |
| `.find(fn)` result used directly | Collection | element was found (not undefined) |
| `.reduce(fn)` on unchecked array | Collection | array is not empty |
| `arr[0]` accessed without length check | Collection | array has at least one element |
