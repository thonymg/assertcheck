---
name: assertcheck-existing
description: Find and fix silent failures in existing TypeScript code with assertcheck, on a file, a folder, the whole project, or only the lines you changed. Replaces silent `if (!x) return`, swallowed catch, `||`/`??` defaults, unguarded env vars, `x!`, unchecked casts and silent switch defaults with assertions. Use when the user asks to audit, review or harden code, asks why something fails silently, or is modifying a function (adding a parameter, changing logic, refactoring).
---

# assertcheck-existing

Detection is done by a script, not by reading code: do not hunt for patterns by hand. The script is syntactic, though. It cannot know what a function is *for*, so it also hands you a list of functions to analyse yourself (step 2).

## 1. Scan

Run the scanner shipped next to this file (needs `typescript` in the project):

```bash
node ${CLAUDE_SKILL_DIR}/scripts/scan.mjs src/order.ts        # a file
node ${CLAUDE_SKILL_DIR}/scripts/scan.mjs src                 # a folder
node ${CLAUDE_SKILL_DIR}/scripts/scan.mjs .                   # the whole project
node ${CLAUDE_SKILL_DIR}/scripts/scan.mjs src --diff          # only lines changed since HEAD
node ${CLAUDE_SKILL_DIR}/scripts/scan.mjs src --diff main     # only lines changed vs a branch
```

If `${CLAUDE_SKILL_DIR}` is not expanded by your agent, use the `scripts/` folder next to this SKILL.md.

Each finding prints `file:line:col severity rule code` then a ready `fix:` line. Scope by what the user gave you: a file, a folder, "the project" (`.`), or "what I just changed" (`--diff`).
`--min low` also shows debatable findings (hidden by default: `??`, `.filter(Boolean)`, `?.`, `new Set` dedupe, `Math.max/min/abs` clamps, literal default params, invariant comments, empty in → empty out such as `if (!s) return ""`). Low findings are information, not work: do not fix them unless the user asked for `--min low`.

## 2. Second analysis: the functions the scanner cannot settle

The scan ends with a `second analysis:` list (also built from findings hidden below `--min`). Each entry is a function holding a low or debatable finding. For **every** function in that list, and for every function you modify, do not triage by the finding line alone. Read the whole function and answer, in your head, these four questions:

1. **Contract**: what does it take and promise? Which inputs are valid, which are bugs?
2. **Bad value path**: follow a value that can be `NaN`, `undefined`, `""`, out of range or an unknown literal (`parse`, `Number()`, `x[key]`, `?.`, ternary on a string, optional field). Where does it end up: written to a file or DB, returned, compared, thrown on?
3. **Silent outcome**: does the function then do something plausible-looking with it (writes `"1.0.NaN"`, takes the last branch, returns `false` for "could not read", skips a project)?
4. **Decision**: if the answer to 3 is yes and the bad value can only come from a bug or corrupt data, **assert** (or validate if it comes from outside). If the silent outcome is the documented behaviour (hook that must never block, optional field, "nothing to do"), **keep** and say why.

The scanner also misses what it has no rule for. While you read the function, assert any bad-value path you find even if nothing flagged it, and say so in the report (`found by reading: …`).

## 3. Triage each finding: one decision, no essay

Decide from **where the value comes from**, not from how the line looks. Trace it (`grep` the callers) before choosing:

| Value comes from | Decision |
|:--|:--|
| Our own code, a validated model, a typed API result | **Assert.** The case can only happen through a bug upstream: apply the `fix:` |
| Outside (user input, form field, URL, file, third-party payload) and this function is the first to see it | **Validate here, explicitly.** Throw a domain error or return a typed result the caller must handle (`{ ok: false, reason }`), never a sentinel like `""`, `null`, `"***"` |
| Outside, but already validated earlier in the flow | **Assert.** Revalidating is noise; asserting proves the boundary did its job |
| Expected by the business (optional field, empty list, skip by design) | **Keep, unchanged.** List it in the report |

Rules:

1. **Never delete a guard without a replacement.** Removing `if (!x) return`, `?? fallback` or a `try/catch` means adding the matching assertion or explicit validation.
2. **A caller relying on the silent value is not a reason to keep it.** Fix the caller too (it gets an error or a typed result), in the same change. Keep the guard only if the silent value is the documented contract.
3. **Guard what a change adds.** New parameter: precondition. New external call: check its result. New state dependency: `assert.equal(entity.status, …)`. Skip what the TypeScript type already guarantees (`assert.string` on a `string` param is noise).
4. **Never write a code comment** (`//`, `/* */`, JSDoc, `// assertcheck-ignore`) unless the user explicitly asks for one. A kept finding is listed in the report, not annotated in the code; it shows up again on the next scan and that is expected. If the user asks to silence it, add `// assertcheck-ignore: <reason>` on the line above, with a reason the code does not already say. If the scanner flags code that already handles the case (a throw right after, an explicit branch), that is a scanner bug: say so in the report.

Rewrite each `fix:` message in domain language (`"order must be pending before charge"`, not `"order.status must be 'pending'"`). Add `note:` only when the caller needs to know what to do. For a whole-project scan, go file by file, highest severity first, and run the tests between files.

## 4. Report

One line per finding: `file:line: applied <assert call>`, `validated: <what the caller now handles>` or `kept: <reason>`. One line per function of the second-analysis list: `file:line fn: reviewed, asserted <x>` or `reviewed, nothing to add: <why the silent path is the contract>`. A function from that list with no line in the report was not analysed. Rerun the scan: every finding left at the default level is one you listed as `kept`, and the second-analysis list only contains functions you reviewed. If more than a third of the findings are `kept`, say so and list them: the triage is probably wrong.

## Beyond the script (only if asked for a deep review)

The script sees syntax and types, not intent. Read the function and check only:
- **State**: a field like `status` is used as if in one state: `assert.equal(order.status, "pending", …)`
- **Postcondition**: an external call's result is trusted: `assert.notNil(res.id, …)` right after it
- **Collection invariant**: duplicates or ordering matter: `assert.uniqueBy` / `assert.sortedBy`

To pick the exact assertion, see `assertcheck-new` (references/selector.md).
