---
name: assertcheck-existing
description: Find and fix silent failures in existing TypeScript code with assertcheck, on a file, a folder, the whole project, or only the lines you changed. Replaces silent `if (!x) return`, swallowed catch, `||`/`??` defaults, unguarded env vars, `x!`, unchecked casts, `NaN` from `Number()`, silent switch/ternary defaults and unchecked `record[key]` with assertions. Use when the user asks to audit, review or harden code, asks why something fails silently, or is modifying a function (adding a parameter, changing logic, refactoring).
---

# assertcheck-existing

The bar: a reader who knows the code opens the diff and sees that every way the function can go wrong now stops loudly, in one assertcheck call, and nothing else changed.

The scanner finds patterns; you judge intent. It is syntactic, so it also hands you a list of functions to analyse yourself (step 3). Do not hunt for patterns by hand, and do not trust a finding you have not traced.

## 1. Find the twin

Before writing any guard, see how the project already asserts: `grep -rn "from \"assertcheck\"\|from \"@thonymg/assertcheck\"" src`. Copy the import specifier, the message wording and the `check()` vs `assert.*` habit of the nearest file that does it well. If two files disagree, say so instead of picking one.

## 2. Scan

Run the scanner shipped next to this file (needs `typescript` in the project):

```bash
node ${CLAUDE_SKILL_DIR}/scripts/scan.mjs src/order.ts        # a file
node ${CLAUDE_SKILL_DIR}/scripts/scan.mjs src                 # a folder
node ${CLAUDE_SKILL_DIR}/scripts/scan.mjs .                   # the whole project
node ${CLAUDE_SKILL_DIR}/scripts/scan.mjs src --diff          # only lines changed since HEAD
node ${CLAUDE_SKILL_DIR}/scripts/scan.mjs src --diff main     # only lines changed vs a branch
```

If `${CLAUDE_SKILL_DIR}` is not expanded by your agent, use the `scripts/` folder next to this SKILL.md. Scope by what the user gave you: a file, a folder, "the project" (`.`), or "what I just changed" (`--diff`).

Each finding prints `file:line:col severity rule code` then a ready `fix:` line. `--min low` also shows debatable findings (hidden by default: `??`, `.filter(Boolean)`, `?.`, `new Set` dedupe, `Math.max/min/abs` clamps, literal default params, invariant comments, `Number(s)`, `record[key]`, empty in → empty out). Low findings are information, not work: do not fix them unless the user asked for `--min low`, or step 3 proves them.

Findings listed in `.assertcheck/decisions.md` are already settled and do not show up (the summary counts them).

## 3. Second analysis: prove before you assert

The scan ends with a `second analysis:` list (built from low and debatable findings, even hidden ones). For **every** function in it, and for every function you modify, read the whole function, then:

1. **Contract**: what does it take and promise? Which inputs are valid, which are bugs?
2. **Bad value**: name one concrete input that goes wrong (`"1.0"` into `.map(Number)`, a missing key, an unknown `level`, a rebase in progress). Follow it: where does it end up (written to a file or DB, returned, compared, thrown on)?
3. **Proof**: run it when it is cheap (a throwaway script or test, deleted after) and note what the function did. Writes `"1.0.NaN"`? Returns `false` for "could not read"? Takes the last branch? That is **proven**. If you cannot name an input that reaches a bad outcome, it is **suspected**: do not assert on a suspicion, list it.
4. **Decision**: proven and the input can only come from a bug or corrupt data → **assert**. Proven and it comes from outside → **validate**. The silent outcome is the documented behaviour (a hook that must never block, an optional field, "nothing to do") → **keep**, with the reason.

The scanner misses what it has no rule for. If reading the function reveals a proven bad-value path nothing flagged, assert it too and report it as `found by reading`.

## 4. Decide each finding: one decision, no essay

Decide from **where the value comes from**, not from how the line looks. Trace it (`grep` the callers):

| Value comes from | Decision |
|:--|:--|
| Our own code, a validated model, a typed API result | **Assert.** The case can only happen through a bug upstream: apply the `fix:` |
| Outside (user input, form field, URL, file, third-party payload) and this function is the first to see it | **Validate here, explicitly.** Use `assert.*` / `check()` (they throw a readable `AssertionError`), or return a typed result the caller must handle (`{ ok: false, reason }`), never a sentinel like `""`, `null`, `"***"` |
| Outside, but already validated earlier in the flow | **Assert.** Revalidating is noise; asserting proves the boundary did its job |
| Expected by the business (optional field, empty list, skip by design) | **Keep, unchanged.** Report it, and settle it (step 7) |

**What goes**, and what replaces it:

```ts
// Before: "1.0" gives NaN, "1.0.NaN" is written to every manifest
const [major, minor, patch] = version.split(".").map(Number)

// After
const parts = version.split(".").map(Number)
check(parts).len(3, "version must be major.minor.patch").all(Number.isFinite, "version parts must be numbers")
const [major, minor, patch] = parts
```

```ts
// Before: any level but "minor" silently bumps a patch
return level === "minor" ? `${major}.${minor + 1}.0` : `${major}.${minor}.${patch + 1}`

// After
assert.includes(["patch", "minor", "major"], level, "unknown bump level")
```

**What stays**, even though a finding fires:
- An exit that is the contract: a hook that must never block a commit, a lookup returning `null`, empty in → empty out, a business threshold.
- A catch that rethrows with context (`throw new Error("…", { cause: e })`).
- A value the type already guarantees: `assert.string` on a `string` param, `x!` right after `assert.notNil(x)`.
- A top-level script's last handler that logs and exits.

## 5. Write it

1. **Never delete a guard without a replacement.** Removing `if (!x) return`, `?? fallback` or a `try/catch` means adding the matching assertion or explicit validation.
2. **A caller relying on the silent value is not a reason to keep it.** Fix the caller too (it gets an error or a typed result), in the same change. Keep the guard only if the silent value is the documented contract.
3. **Guard what a change adds.** New parameter: precondition. New external call: check its result. New state dependency: `assert.equal(entity.status, …)`.
4. **Every verification is an assertcheck call, never hand-written code.** Not just `if (…) throw`: also `typeof` / `Array.isArray` checks, `Number.isFinite` or `isNaN` then throw, `x ?? (() => { throw … })()`, a throwing `switch` default, `.length === 0`, `.every(…)` / `.some(…)` then throw, `new Set(xs).size !== xs.length`, `Math.min/max` as validation, a try/catch that only rethrows, `x!`. Look the invariant up in [../assertcheck-new/references/selector.md](../assertcheck-new/references/selector.md) (all 75 assertions, then a table from hand-written check to assertion) instead of guessing a name. Hand-written code is allowed only when no assertion exists for the invariant; say in the report which one had none.
5. **`assert.*` or `check()`**: three or more assertions on one array or plain object, a `check(x)…` chain; a scalar has no chain, keep `assert.*` lines. A domain error or typed result is right when the caller must handle the failure (outside input), never as a substitute for an assertion on an internal invariant.
6. **Add the import** if the file has none, with the specifier the twin uses (`"assertcheck"`, or `"@thonymg/assertcheck"` from JSR, as in Deno). One import line per module.
7. **Never write a code comment** (`//`, `/* */`, JSDoc, `// assertcheck-ignore`) unless the user explicitly asks. The assertion `msg` is the documentation; write it in domain language (`"order must be pending before charge"`, not `"order.status must be 'pending'"`), with `note:` only when the caller needs to know what to do.

For a whole-project scan, go file by file, highest severity first, and run the tests between files.

## 6. Check it

1. Before touching anything, list the changes by file (one line each).
2. After editing, run the project's typecheck, lint and the tests for what you touched. Check exit codes, not the output.
3. Rerun the scan on the same scope. Every finding left at the default level must be one you reported as `kept`, and the second-analysis list must only hold functions you reviewed.
4. Read the diff cold, as a teammate who has never seen the code. Revert any assertion the type already guarantees, and any change that does not make a failure louder.
5. If the scanner flagged code that already handles the case (a throw right after, an explicit branch), that is a scanner bug: say so in the report.

## 7. Settle what you keep

A kept finding comes back on every scan unless it is settled. Record it in `.assertcheck/decisions.md`, one line per decision, keyed on the function (not the line, so edits above do not revive it) and with a reason (no reason, no waiver):

```
- src/version.ts auto silent-exit, nil-filter — a post-commit hook must never block a commit
- src/version.ts check optional-chain — undefined is reported on the next line
```

Add lines only for findings you proved are the contract. `*` stands for every rule of that function.

If the same pattern turned up in three or more files and the scanner had no rule for it, propose one in `scripts/scan.mjs` with its fixture line, instead of fixing it by hand each time.

## 8. Report

One line per finding: `file:line: applied <assert call>`, `validated: <what the caller now handles>` or `kept: <reason>`. One line per function of the second-analysis list: `file:line fn: proven, asserted <x>`, `suspected: <what you could not reach>` or `reviewed, nothing to add: <why the silent path is the contract>`. A function from that list with no line was not analysed. If more than a third of the findings are `kept`, say so and list them: the triage is probably wrong.

## Beyond the script (only if asked for a deep review)

Read the function and check only:
- **State**: a field like `status` is used as if in one state: `assert.equal(order.status, "pending", …)`
- **Postcondition**: an external call's result is trusted: `assert.notNil(res.id, …)` right after it
- **Collection invariant**: duplicates or ordering matter: `assert.uniqueBy` / `assert.sortedBy`
