---
name: assertcheck-existing
description: Find and fix silent failures in existing TypeScript code with assertcheck, on a file, a folder, the whole project, or only the lines you changed. Replaces silent `if (!x) return`, swallowed catch, `||`/`??` defaults, unguarded env vars, `x!`, unchecked casts and silent switch defaults with assertions. Use when the user asks to audit, review or harden code, asks why something fails silently, or is modifying a function (adding a parameter, changing logic, refactoring).
---

# assertcheck-existing

Detection is done by a script, not by reading code. Do not scan files by hand.

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
`--min low` also shows debatable findings (hidden by default: `??`, `.filter(Boolean)`, `?.`, `new Set` dedupe, `Math.max/min/abs` clamps, literal default params, invariant comments).

## 2. Triage each finding: one decision, no essay

| Decision | When |
|:--|:--|
| **Apply the fix** | the condition can only be true because of a bug upstream |
| **Keep** | legitimate business case (optional value, expected empty list, skip by design): add `// assertcheck-ignore: <reason>` above it so it is never reported again |

Three rules:

1. **Never delete a guard without a replacement.** Removing `if (!x) return`, `?? fallback` or a `try/catch` means adding the matching assertion.
2. **Check the callers first** (`grep`). An assertion that replaces a silent return now throws for any caller that relied on it. If one does, keep the guard and mark it `assertcheck-ignore`.
3. **Guard what a change adds.** New parameter: precondition. New external call: check its result. New state dependency: `assert.equal(entity.status, …)`. Skip what the TypeScript type already guarantees (`assert.string` on a `string` param is noise).

Rewrite each `fix:` message in domain language (`"order must be pending before charge"`, not `"order.status must be 'pending'"`). Add `note:` only when the caller needs to know what to do. For a whole-project scan, go file by file, highest severity first, and run the tests between files.

## 3. Report

One line per finding: `file:line: applied <assert call>` or `kept: <reason>`. Rerun the scan: 0 findings at the default level.

## Beyond the script (only if asked for a deep review)

The script sees syntax and types, not intent. Read the function and check only:
- **State**: a field like `status` is used as if in one state: `assert.equal(order.status, "pending", …)`
- **Postcondition**: an external call's result is trusted: `assert.notNil(res.id, …)` right after it
- **Collection invariant**: duplicates or ordering matter: `assert.uniqueBy` / `assert.sortedBy`

To pick the exact assertion, see `assertcheck-new` (references/selector.md).
