# assertcheck-audit

Analyze existing TypeScript code to find every unguarded boundary — and propose the assertions that close each gap.

> "Figuring out what code doesn't do (and why) can be positively enlightening."
> — Fabian Giesen, *Negative space in programming*

---

## When to use it

- "Review this code for unguarded inputs"
- "Find where I should add assertions"
- "Why does this fail silently?"
- "Audit this service before the release"
- "Is this code well-protected?"

---

## The TypeScript illusion

Squiggly-free code is not safe code. TypeScript types vanish at runtime.
Every `??`, `?.`, `if (!x) return`, and absorbed `catch` is a silent failure
hiding in plain sight.

The goal of an audit is not to add assertions everywhere — it is to find the
**highest-risk gaps** where a silent failure would cause the hardest bugs to trace.

---

## What the skill does

The skill runs a **3-pass audit protocol**.

### Pass 1 — Boundary scan (systematic, line by line)

Six boundary categories, worked through in order:

| Category | Signal to look for |
|:---------|:------------------|
| **A — Function entry** | parameters accessed without nil/type check |
| **B — External data** | `await` result used without nil check |
| **C — State machine** | entity field read without asserting current state |
| **D — Collection** | `.map / .filter / .find / [0]` on unchecked value |
| **E — Silent exits** | `if (!x) return` / `x ?? fallback` / `x?.field` / absorbed `catch` |
| **F — Config/env** | `process.env.X` or `config.x.y` accessed directly |

Each finding is annotated: `// ⚠ [Category] unguarded: <what the code assumes>`

### Pass 2 — Risk scoring

| Risk | Condition |
|:-----|:----------|
| 🔴 **Critical** | Unguarded nil dereferenced — will throw `Cannot read properties of null` |
| 🟠 **High** | Silent exit — caller receives `undefined` with no trace |
| 🟡 **Medium** | Wrong type assumed — may corrupt silently |
| 🟢 **Low** | Missing postcondition — type system mostly covers it |

### Pass 3 — Prioritized report

Findings sorted by risk — 🔴 first. For each finding: location, category, risk, assumption broken, assertion to add.

---

## Example

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
Guard coverage: 0 / 3 boundaries protected — 3 gaps (1 high, 1 high, 1 low)

| # | Line | Category | Risk    | Assumption              | Fix                            |
|:--|:-----|:---------|:--------|:------------------------|:-------------------------------|
| 1 | 3    | E        | 🟠 High  | user present, no trace  | assert.notNil(user, {msg:…})   |
| 2 | 7    | E        | 🟠 High  | error absorbed silently | let it throw — remove try/catch |
| 3 | 10   | output   | 🟢 Low   | tasks non-empty         | assert.notEmpty(tasks) if needed |
```

**Proposed fix:**

```ts
import { assert } from "@assertcheck/core"

async function getUserTasks(user: User): Promise<Task[]> {
  // ── guards ───────────────────────────────────────────────────────
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

::: warning The most dangerous pattern
`catch (e) { console.log(e); return tasks }` absorbs any failure — network error, DB error,
a thrown assertion — and returns an empty array silently. The caller has no idea whether
the empty array means "no tasks" or "the service crashed". Removing the try/catch lets the
error propagate with its full context intact.
:::

---

## What NOT to flag

- TypeScript annotations that already enforce the invariant at compile time
- Assertions that already exist and are correct
- Optional parameters that are intentionally optional and never dereferenced without a check
- `try/catch` blocks that handle *recoverable* errors with domain-specific fallback logic

---

## What the skill delivers

1. **Boundary scan** — annotated code with every gap identified
2. **Risk-sorted report** — findings table with category, risk, assumption, and proposed assertion
3. **Proposed guards** — ready-to-paste guard block for each finding
