# Assertion modes

assertcheck has three modes that control what happens when an assertion fails. Understanding modes is the key to using assertcheck effectively across all environments.

::: info Negative Space Programming
Modes let you choose how strictly the **negative space** of your program is enforced per environment — from crashing on any violation in development, to logging-only observability in production, to zero overhead when contracts are trusted. [Read the principle →](/guide/negative-space)
:::

## The three modes

| Mode | On failure | Use case |
|---|---|---|
| `"enabled"` | Log + throw `AssertionError` | Development, testing, strict production |
| `"warn"` | Log only — no throw | Observability in production without crashing |
| `"disabled"` | No-op — zero overhead | High-performance production paths |

::: info Mode is global
Mode is a single global value. One call to `modeAssertIn()` or `setAssertMode()` affects every assertion in the process. This is intentional — you configure once, at the entry point, and every module inherits the setting.
:::

## Default: always enabled

`"enabled"` is the unconditional default in every environment. You do not need to configure anything to start using assertions.

```ts
import { assert } from "assertcheck"

// This just works — no setup needed
assert.notNil(userId, "userId is required")
```

## Changing mode per environment

Call `modeAssertIn()` **once** at your application entry point, before any assertions are evaluated:

```ts
import { modeAssertIn } from "assertcheck"

modeAssertIn("prod", "warn")    // log in production without crashing
modeAssertIn("staging", "warn") // same for staging
modeAssertIn("ci", "disabled")  // CI runs fast with no output
```

`modeAssertIn` checks the current value of `NODE_ENV` at the time it is called. It only applies when `NODE_ENV` matches the given environment label. You can call it multiple times for different environments — only the matching ones take effect.

::: warning Call order
If you call `modeAssertIn("prod", "warn")` and then `modeAssertIn("prod", "disabled")` in the same process, the last one wins (for the same environment label).
:::

**Supported environment labels:**

| Label | Matches `NODE_ENV` |
|---|---|
| `"prod"` | `"production"`, `"prod"` |
| `"dev"` | `"development"`, `"dev"` |
| `"test"` | `"test"` |
| `"staging"` | `"staging"`, `"stage"` |
| `"ci"` | `"ci"` |

## Changing mode manually

For tests or dynamic control:

```ts
import { setAssertMode, getAssertMode } from "assertcheck"

const saved = getAssertMode()
setAssertMode("disabled")

// ... run some code that should not assert ...

setAssertMode(saved) // restore
```

## Recommended setup for a web API

```ts
// app.ts — entry point
import { modeAssertIn } from "assertcheck"

modeAssertIn("prod", "warn") // log to your observability platform, don't crash
```

## Recommended setup for a CLI

```ts
// bin/cli.ts — entry point
import { modeAssertIn } from "assertcheck"

modeAssertIn("prod", "disabled") // no output in production binaries
```
