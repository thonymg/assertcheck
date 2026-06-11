---
name: assertcheck-audit
description: Analyze existing TypeScript code (function, file, or class) to find unguarded boundaries and propose assertcheck assertions. Trigger when the user says "review this code", "audit this", "find where I should add assertions", "why does this fail silently", "debug this", or shares code asking "is this well-protected?".
---

# assertcheck-audit

> "The main way we actually give our programs shape is not by putting things in,
> but by leaving them out. Figuring out what code doesn't do (and why)
> can be positively enlightening."
> — Fabian Giesen, *Negative space in programming*

You are reviewing existing code. This skill reads the code as a whole,
finds every boundary where an invalid state can pass through undetected,
and delivers a prioritized, actionable audit report.

**The TypeScript illusion:** Squiggly-free code is not safe code. TypeScript types
vanish at runtime. Every `??`, `?.`, `if (!x) return`, and absorbed `catch`
is a silent failure hiding in plain sight.

The goal is not to add assertions everywhere — it is to find the **highest-risk gaps**
where a silent failure would cause the hardest bugs to trace.

---

## Step 0 — Interview the developer first

Before running the audit, ask:

```
1. Is this a recent bug, a pre-emptive review, or a code review on a PR?
2. Has this code caused production issues? If so, what failed?
3. What is the most critical invariant this code must maintain?
   (e.g. "orders must never be charged twice", "userId must always be present")
4. Are there known callers that sometimes pass unexpected values?
```

Questions 1–2 focus the audit on the highest-risk areas first.
Question 3 is the North Star assertion you should find or add.

---

## Audit protocol — 3 passes

### Pass 1 — Boundary scan (systematic, line by line)

Work through the 6 boundary categories in order.
Load [references/boundary-scan-checklist.md](references/boundary-scan-checklist.md) for the complete signal list.

| Category | Signal to look for |
|:---------|:------------------|
| **A — Function entry** | parameters accessed without nil/type check |
| **B — External data** | `await` result used without nil check |
| **C — State machine** | entity field read without asserting current state |
| **D — Collection** | `.map / .filter / .find / [0]` on unchecked value |
| **E — Silent exits** | `if (!x) return` / `x ?? fallback` / `x?.field` / absorbed `catch` |
| **F — Config/env** | `process.env.X` or `config.x.y` accessed directly |

Annotate each finding: `// ⚠ [Category] unguarded: <what the code assumes>`

---

### Pass 2 — Risk scoring

For each finding, assign a risk level:

| Risk | Condition |
|:-----|:----------|
| 🔴 **Critical** | Unguarded nil that is dereferenced — will throw a cryptic `Cannot read properties of null` |
| 🟠 **High** | Silent exit (`if (!x) return`) — caller receives `undefined` with no trace |
| 🟡 **Medium** | Wrong type assumed — may corrupt silently (e.g. `string` used as `number`) |
| 🟢 **Low** | Missing postcondition — type system mostly covers it, low corruption risk |

---

### Pass 3 — Prioritized report

Deliver findings sorted by risk — 🔴 first.
For each finding: location, category, risk, what the code assumes, what assertion to add.

Load [references/audit-report-format.md](references/audit-report-format.md) for the full output template.
Load skill `assertcheck-selector` to select the right assertion for each gap.

---

## Few-shot example

**Code under audit — `getUserTasks` service method:**

```ts
// Before audit annotations
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
  return tasks                          // ⚠ — could be []: empty not checked, caller may assume non-empty
}
```

**Audit report:**

```
Audit — `getUserTasks`
Guard coverage: 0 / 3 boundaries protected — 3 gaps (1 high, 1 high, 1 low)

| # | Line | Category | Risk    | Assumption               | Fix                             |
|:--|:-----|:---------|:--------|:-------------------------|:--------------------------------|
| 1 | 3    | E        | 🟠 High  | user present, no trace   | assert.notNil(user, {msg:…})    |
| 2 | 7    | E        | 🟠 High  | error absorbed silently  | let it throw — remove try/catch  |
| 3 | 10   | output   | 🟢 Low   | tasks non-empty          | assert.notEmpty(tasks) if needed |
```

**Proposed assertions:**

```ts
import { assert } from "assertcheck"
// docs: https://thonymg.github.io/assertcheck/

async function getUserTasks(user: User): Promise<Task[]> {
  // ── guards ───────────────────────────────────────────────────────
  // replaces `if (!user) return tasks`
  assert.notNil(user, {
    msg:  "user must exist before fetching tasks",
    note: "check that the caller passes an authenticated user object",
  })

  // ── logic ───────────────────────────────────────────────────────
  // try/catch removed — let getTasksFor() throw with its own context
  const tasks = await getTasksFor(user)
  return tasks
}
```

**Key finding note:**
> The original `catch (e) { console.log(e); return tasks }` is the most dangerous pattern here.
> It absorbs any failure from `getTasksFor()` — network error, DB error, or a thrown assertion
> inside `getTasksFor` — and returns an empty array silently. The caller has no idea
> whether the empty array means "no tasks" or "the service crashed".
> Removing the try/catch lets the error propagate with its full context intact.

---

## What NOT to flag

- TypeScript type annotations that already enforce the invariant at compile time
- Assertions that already exist and are correct
- Optional parameters that are intentionally optional and never dereferenced without a check
- `try/catch` blocks that genuinely handle *recoverable* errors with domain-specific fallback logic
  (distinguish: swallowing vs. handling)

---

## Theoretical foundation

| Principle | Source |
|:----------|:-------|
| What code doesn't do is as important as what it does | *Negative space in programming* (fgiesen) |
| TypeScript alone is not enough at runtime | *Defensive Programming and TypeScript* |
| `if (!x) return` and `??` hide failures from callers | *Defensive Programming and TypeScript* — optional chaining abuse |
| Explicit boundaries reduce bugs and improve maintainability | *Negative Space* (alissonsteffens.com) |
| Strong typing helps, but negative programming requires runtime enforcement | *Negative programming* (Marinica) |

---

## Reference files

- [references/boundary-scan-checklist.md](references/boundary-scan-checklist.md) — 6-category scan with signal table
- [references/audit-report-format.md](references/audit-report-format.md) — output format with score + findings + proposed assertions
- assertcheck docs: https://thonymg.github.io/assertcheck/
