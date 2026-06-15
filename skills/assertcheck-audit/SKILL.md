---
name: assertcheck-audit
description: Analyze existing TypeScript code (function, file, or class) to find unguarded boundaries and propose assertcheck assertions. Trigger when the user says "review this code", "audit this", "find where I should add assertions", "why does this fail silently", "debug this", or shares code asking "is this well-protected?".
---

# assertcheck-audit

## References — load before starting

- [references/boundary-scan-checklist.md](references/boundary-scan-checklist.md)
- [references/audit-report-format.md](references/audit-report-format.md)

---

## LAWS

**LAW 1 — Interview before scanning.**
Ask all 4 interview questions before reading the code.
Q3 (most critical invariant) is the North Star — without it, risk scoring is arbitrary.

**LAW 2 — Scan all 6 boundary categories, in order.**
Use `references/boundary-scan-checklist.md`. Never skip a category.
Annotate every finding inline: `// ⚠ [Category] unguarded: <assumption>`

**LAW 3 — Report in the exact 4-block format from `references/audit-report-format.md`.**
Block 1 (score), Block 2 (findings table), Block 3 (proposed assertions), Block 4 (mindset note).
Never omit any block. Never rename columns.

**LAW 4 — Risk scoring is strict.**
🔴 Critical = nil dereference that will throw. 🟠 High = silent exit with no caller trace.
🟡 Medium = type assumed wrong. 🟢 Low = postcondition gap, type system mostly covers it.
Do not inflate — every 🔴 that isn't a real nil dereference dilutes the report.

**LAW 5 — Proposed assertions are exact, not vague.**
"add error handling" is not a fix. `assert.notNil(order, { msg: "…", note: "…" })` is a fix.

**LAW 6 — Do not flag what is already safe.**
TypeScript-enforced params that cannot be null, existing correct assertions, intentionally optional params — do not report these. Signal is lost in noise.

---

## Triggers

- "Review this code" / "Audit this"
- "Find where I should add assertions"
- "Why does this fail silently?"
- "Debug this" / "Is this well-protected?"

---

## Interview — ask before scanning

```
1. Is this a recent bug, a pre-emptive review, or a code review on a PR?
2. Has this code caused production issues? If so, what failed?
3. What is the most critical invariant this code must maintain?
   (e.g. "orders must never be charged twice", "userId must always be present")
4. Are there known callers that sometimes pass unexpected values?
```

---

## Protocol — 3 passes

### Pass 1 — Boundary scan (all 6 categories, in order)

| Category | Signal to look for |
|:---------|:------------------|
| **A — Function entry** | parameters accessed without nil/type check |
| **B — External data** | `await` result used without nil check |
| **C — State machine** | entity field read without asserting current state |
| **D — Collection** | `.map / .filter / .find / [0]` on unchecked value |
| **E — Silent exits** | `if (!x) return` / `x ?? fallback` / `x?.field` / absorbed `catch` |
| **F — Config/env** | `process.env.X` or `config.x.y` accessed directly |

Annotate: `// ⚠ [Category] unguarded: <assumption>`

### Pass 2 — Risk scoring

| Risk | Condition |
|:-----|:----------|
| 🔴 **Critical** | Nil dereferenced — will throw `Cannot read properties of null` |
| 🟠 **High** | Silent exit — caller gets `undefined`/`[]` with no trace |
| 🟡 **Medium** | Wrong type assumed — may corrupt silently |
| 🟢 **Low** | Missing postcondition — low corruption risk |

### Pass 3 — Report (exact format)

See `references/audit-report-format.md` — all 4 blocks mandatory.
Load `assertcheck-selector` for assertion selection.

---

## Canonical example

**Code under audit:**

```ts
async function getUserTasks(user: User): Promise<Task[]> {
  let tasks: Task[] = []
  if (!user) {
    return tasks                        // ⚠ E — silent exit: caller gets [] with no trace
  }
  try {
    tasks = await getTasksFor(user)
  } catch (e) {
    console.log(e)                      // ⚠ E — error absorbed: failure invisible to caller
    return tasks
  }
  return tasks
}
```

**Audit report:**

```
## Audit — `getUserTasks`
Guard coverage: 0 / 2 boundaries protected — 2 gaps (2 high)

| # | Line | Category | Risk    | Implicit assumption        | Fix                            |
|:--|:-----|:---------|:--------|:---------------------------|:-------------------------------|
| 1 | 3    | E        | 🟠 High  | user present, caller unaware | assert.notNil(user, {msg:…})  |
| 2 | 7    | E        | 🟠 High  | error absorbed silently    | remove try/catch — let it throw |
```

**Proposed assertions:**

```ts
import { assert } from "assertcheck"
// docs: https://thonymg.github.io/assertcheck/

async function getUserTasks(user: User): Promise<Task[]> {
  // ── guards ───────────────────────────────────────────────────
  assert.notNil(user, {
    msg:  "user must exist before fetching tasks",
    note: "check that the caller passes an authenticated user object",
  })

  // ── logic ────────────────────────────────────────────────────
  // try/catch removed — let getTasksFor() throw with its own context
  return await getTasksFor(user)
}
```

> **Key finding:** The `catch (e) { console.log(e); return tasks }` is the highest risk.
> It absorbs any failure silently — the caller cannot distinguish "no tasks" from "the service crashed".
> Removing the try/catch lets the error propagate with full context.

---

## What NOT to flag

- TypeScript-enforced params that cannot be null
- Assertions that already exist and are correct
- Intentionally optional params never dereferenced without a check
- `try/catch` that genuinely handles recoverable errors with domain-specific fallback

---

## SELF-CHECK — run before delivering

- [ ] Interview: all 4 questions answered before any scanning
- [ ] Pass 1: all 6 boundary categories checked, none skipped
- [ ] All findings annotated inline with category and assumption
- [ ] Block 1 (score): `X / N boundaries protected` computed and shown
- [ ] Block 2 (findings): sorted 🔴 first, exact columns, no merged rows
- [ ] Block 3 (assertions): exact `assert.*` calls, not vague suggestions
- [ ] Block 4 (mindset note): written, focused on the highest-risk finding
- [ ] No finding flagged that TypeScript already enforces at compile time

If any item fails → fix before delivering.
