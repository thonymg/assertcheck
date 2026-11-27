# assertcheck-existing

For code that already exists. Find every place where it fails silently and replace it with an assertion, on a file, a folder, the whole project, or only the lines you changed.

> "Figuring out what code doesn't do (and why) can be positively enlightening."
> — Fabian Giesen, *Negative space in programming*

---

## When to use it

- "Audit this folder" / "Harden this service before the release"
- "Why does this fail silently?"
- "I'm adding a parameter to this function" / "I'm refactoring this method"
- "Review this PR for swallowed errors"

---

## The scanner

Detection is done by a script that uses the TypeScript AST and type checker, so the agent decides what to do with each finding instead of reading the code line by line.

```bash
node scripts/scan.mjs src/order.ts       # a file
node scripts/scan.mjs src                # a folder
node scripts/scan.mjs .                  # the whole project
node scripts/scan.mjs src --diff         # only lines changed since HEAD
node scripts/scan.mjs src --diff main    # only lines changed vs a branch
node scripts/scan.mjs src --min low      # include debatable findings
node scripts/scan.mjs src --json         # for tooling
```

Run from the skill folder (`node_modules/assertcheck/skills/assertcheck-existing/` once installed). It needs `typescript` in the scanned project and exits with code 1 when there are findings, so it also works in CI with no agent.

```
src/order.ts:12:3 high silent-exit  if (!order) return
  fix: assert.notNil(order, "order is required")
src/order.ts:40:5 high swallowed-catch  catch (e) { … }
  fix: remove the try/catch and let it throw, or rethrow with context: throw new Error("…", { cause: e })
2 findings (2 high, 0 medium, 0 low) in 1 files (+3 hidden below --min medium)
```

In CI, scan only what a pull request changes:

```yaml
- run: node node_modules/assertcheck/skills/assertcheck-existing/scripts/scan.mjs src --diff origin/main
```

### What it detects

| Rule | Pattern | Default severity |
|:--|:--|:--|
| `silent-exit` | `if (!x) return`, `if (x <= 0) return null`, `if (s.status !== "pending") return` | high (medium if it returns `[]`, `0`, `""`…) |
| `silent-skip` | `if (!x) continue` in a loop | medium |
| `swallowed-catch` | `catch` that only logs or returns nothing | high |
| `swallowed-promise` | `.catch(() => null)` | high |
| `falsy-fallback` | `x \|\| 0`, `Number(s) \|\| 3000` | medium |
| `unguarded-env` | `process.env.X` read without assertion | medium |
| `non-null-bang` | `user!.name` | medium |
| `unchecked-cast` | `JSON.parse(raw) as User`, `await res.json() as T` | medium |
| `silent-default` | `switch` `default:` that breaks or returns nothing | medium |
| `nullish-fallback`, `nil-filter`, `optional-chain` | `x ?? "default"`, `.filter(Boolean)`, `u?.email` | low (shown with `--min low`) |
| `dedupe`, `clamp` | `[...new Set(ids)]`, `Math.max(0, qty)`, `Math.abs(delta)` | low |
| `default-param`, `comment-invariant` | `function f(limit = 10)`, `// price must be positive here` inside a function | low |

Each rule maps the condition to the assertion that states its opposite: `typeof x !== "string"` gives `assert.string(x)`, `items.length === 0` gives `assert.notEmpty(items)`, `amount <= 0` gives `assert.positive(amount)`. Low rules are often legitimate (padding, distances, optional arguments), so they are hidden by default.

### What it ignores on purpose

- `if (ok) return` followed by a throw or a `never` call: a success exit, not a silent one.
- `if (a === b) return`: usually a business shortcut.
- Returns of a real value (`if (cached) return cached`).
- `x as unknown as T`: a deliberate escape hatch.
- Test files (`*.test.ts`, `tests/`), unless `--include-tests`.
- Any line marked `// assertcheck-ignore: <reason>` (same or previous line).

---

## The workflow

1. **Scan** the scope you were given.
2. **Triage** each finding: apply the fix if the condition can only be true because of a bug upstream; otherwise keep it and mark it `// assertcheck-ignore: <reason>`.
3. **Never delete a guard without a replacement.** Removing `if (!x) return`, a `?? fallback` or a `try/catch` means adding the matching assertion.
4. **Check the callers** before turning a silent exit into an assertion: the function now throws where it used to return.
5. **Guard what a change adds**: new parameter, new external call, new state dependency. Skip what the type already guarantees.
6. **Rescan**: 0 findings at the default level.

For a deep review, the agent then checks the three things a scanner cannot see: entity state (`assert.equal(order.status, …)`), postconditions after external calls, and collection invariants (`uniqueBy`, `sortedBy`).
