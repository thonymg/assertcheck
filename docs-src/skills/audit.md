# assertcheck-audit

Scan existing TypeScript code for every unguarded boundary — nil dereferences, silent exits,
absorbed errors, unchecked external responses. Risk-ranked, with ready-to-paste assertions.

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
Every `??`, `?.`, `if (!x) return`, and absorbed `catch` is a silent failure hiding in plain sight.

The goal is not to add assertions everywhere — it is to find the **highest-risk gaps**
where a silent failure causes the hardest bugs to trace.

---

## How it works

The skill enforces a 3-pass protocol. It asks 4 interview questions before scanning any code.

### Interview first

```
1. Is this a recent bug, a pre-emptive review, or a PR code review?
2. Has this code caused production issues? If so, what failed?
3. What is the most critical invariant this code must maintain?
4. Are there known callers that sometimes pass unexpected values?
```

Question 3 is the **North Star** — it determines which findings get flagged as Critical.

### Pass 1 — Boundary scan (6 categories, in order)

| Category | Signal to look for |
|:---------|:------------------|
| **A — Function entry** | parameters accessed without nil/type check |
| **B — External data** | `await` result used without nil check |
| **C — State machine** | entity field read without asserting current state |
| **D — Collection** | `.map / .filter / .find / [0]` on unchecked value |
| **E — Silent exits** | `if (!x) return` / `x ?? fallback` / `x?.field` / absorbed `catch` |
| **F — Config/env** | `process.env.X` or `config.x.y` accessed directly |

Each finding is annotated inline: `// ⚠ [Category] unguarded: <what the code assumes>`

### Pass 2 — Risk scoring

| Risk | Condition |
|:-----|:----------|
| 🔴 **Critical** | Nil dereferenced — will throw `Cannot read properties of null` |
| 🟠 **High** | Silent exit — caller gets `undefined` or `[]` with no trace |
| 🟡 **Medium** | Wrong type assumed — may corrupt silently |
| 🟢 **Low** | Missing postcondition — type system mostly covers it |

### Pass 3 — Prioritized report (4 blocks)

**Block 1 — Guard coverage score**
```
Guard coverage: 0 / 3 boundaries protected — 3 gaps (2 high, 1 low)
```

**Block 2 — Findings table** (sorted 🔴 first)
```
| # | Line | Category | Risk    | Implicit assumption        | Fix                            |
|:--|:-----|:---------|:--------|:---------------------------|:-------------------------------|
| 1 | 3    | E        | 🟠 High  | user present, caller unaware | assert.notNil(user, {msg:…})  |
| 2 | 7    | E        | 🟠 High  | error absorbed silently    | remove try/catch — let it throw |
```

**Block 3 — Proposed assertions** (exact, ready to paste)

**Block 4 — Mindset note** (one paragraph, highest-risk finding in plain language)

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
Guard coverage: 0 / 2 boundaries protected — 2 gaps (2 high)

| # | Line | Category | Risk    | Implicit assumption          | Fix                             |
|:--|:-----|:---------|:--------|:-----------------------------|:--------------------------------|
| 1 | 3    | E        | 🟠 High  | user present, caller unaware | assert.notNil(user, {msg:…})    |
| 2 | 7    | E        | 🟠 High  | error absorbed silently      | remove try/catch — let it throw |
```

**Proposed assertions:**

```ts
import { assert } from "assertcheck"

async function getUserTasks(user: User): Promise<Task[]> {
  // ── guards ───────────────────────────────────────────────────────
  assert.notNil(user, {
    msg:  "user must exist before fetching tasks",
    note: "check that the caller passes an authenticated user object",
  })

  // ── logic ────────────────────────────────────────────────────────
  // try/catch removed — let getTasksFor() throw with its own context
  return await getTasksFor(user)
}
```

::: warning The most dangerous pattern
`catch (e) { console.log(e); return tasks }` absorbs any failure silently.
The caller cannot distinguish "no tasks" from "the service crashed".
Removing the try/catch lets errors propagate with full context.
:::

---

## What NOT to flag

- TypeScript annotations that enforce the invariant at compile time
- Assertions that already exist and are correct
- Intentionally optional params never dereferenced without a check
- `try/catch` that genuinely handles recoverable errors with domain-specific fallback

---

## What the skill delivers

1. **Guard coverage score** — `X / N boundaries protected`
2. **Findings table** — risk-sorted, one row per gap, with exact assertion to add
3. **Proposed assertions** — ready-to-paste guard block for each finding
4. **Mindset note** — plain-language explanation of the highest-risk finding
