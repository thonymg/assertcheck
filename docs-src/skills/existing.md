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
| `unchecked-number` | `s.split(".").map(Number)`, `parseInt(s)` with no `Number.isFinite` / `isNaN` / `assert` | medium for `.map(Number)`, else low |
| `silent-ternary` | `level === "minor" ? a : b`: any other value silently takes the last branch | medium on `any`/`unknown`, else low |
| `unchecked-index` | `record[key]` typed as always present (`Record<string, T>` without `noUncheckedIndexedAccess`) | low |
| `default-param`, `comment-invariant` | `function f(limit = 10)`, `// price must be positive here` inside a function | low |

### Second analysis

A script reads syntax and types, not intent. After the findings it prints the functions that need a logical read: every function holding a low or debatable finding, including those hidden by `--min`.

```
second analysis: 2 function(s) the scanner cannot settle (low or debatable findings).
Read each one in full, trace its inputs, and decide: assert, validate, or keep (say why).
  src/version.ts:1 bump  [silent-ternary]
  src/version.ts:46 check  [optional-chain]
```

The agent reads each listed function, follows the values that can be `NaN`, `undefined` or unknown, and decides between assert, validate and keep. The report has one line per listed function. `--json` keeps the findings array and adds an `fn` field (`name`, `line`) to each finding, so tooling can group them.

The `fix:` line can name 45 of the 75 assertions (`notNil`, `notEmpty`, type guards, comparisons, `withinRange`, `inDelta`, `len`, `longerThan`, `includes`, `all`/`any`/`none`/`one`/`count`, `containsAll`/`containsNone`, `unique`/`uniqueBy`, `noNils`, `allInstanceOf`, `first`/`last`, `hasKey`/`hasKeys`, `allValuesMatch`, `noNilValues`, `resolves`/`resolvesNotNil`…). The other 30 state an invariant that no single guard condition reveals (`sortedBy`, `sumBy`, `groupedBy`, `partition`, `hasOnlyKeys`, `dig`, `subset`…) or belong to tests (`pure`, `idempotent`, `returns`, `rejects*`…): they come from the second analysis, with the selector table.

Each rule maps the condition to the assertion that states its opposite: `typeof x !== "string"` gives `assert.string(x)`, `items.length === 0` gives `assert.notEmpty(items)`, `amount <= 0` gives `assert.positive(amount)`. Low rules are often legitimate (padding, distances, optional arguments), so they are hidden by default.

### Settled decisions

A finding you proved is the contract (a post-commit hook that must never block, an optional field) comes back on every scan. Record it once in `.assertcheck/decisions.md`:

```
- src/version.ts auto silent-exit, nil-filter — a post-commit hook must never block a commit
```

The line is `- <file> <function> <rule>[, <rule>] — <reason>`. It is keyed on the function, not the line, so an edit above does not bring the finding back, and a line without a reason is ignored with a warning. `*` stands for every rule of the function. The summary counts what was hidden: `(+2 settled in .assertcheck/decisions.md)`.

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
1b. **Find the twin**: copy the import and message style of the nearest file that already uses assertcheck.
2. **Prove, then assert**: read each function of the second-analysis list whole, name an input that goes wrong and run it when cheap. Proven: assert or validate. Suspected: list it, do not assert.
3. **Triage** each finding: apply the fix if the condition can only be true because of a bug upstream; otherwise keep it and mark it `// assertcheck-ignore: <reason>`.
4. **Write every verification with assertcheck, not by hand**: not `if (...) throw`, nor `typeof` / `Array.isArray` / `Number.isFinite` checks, `.every(...)` + throw, a throwing `switch` default or a `Set` size comparison. Use `assert.*` or `check()` (pick one in the selector table), and import it if the file does not.
5. **Never delete a guard without a replacement.** Removing `if (!x) return`, a `?? fallback` or a `try/catch` means adding the matching assertion.
6. **Check the callers** before turning a silent exit into an assertion: the function now throws where it used to return.
7. **Guard what a change adds**: new parameter, new external call, new state dependency. Skip what the type already guarantees.
8. **Rescan**: 0 findings at the default level.

For a deep review, the agent then checks the three things a scanner cannot see: entity state (`assert.equal(order.status, …)`), postconditions after external calls, and collection invariants (`uniqueBy`, `sortedBy`).
