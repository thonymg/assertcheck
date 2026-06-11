[**@assertcheck/core v1.0.0**](../_generated.md)

***

[@assertcheck/core](../_generated.md) / AssertMode

# Type Alias: AssertMode

```ts
type AssertMode = "disabled" | "warn" | "enabled";
```

Defined in: src/types.ts:36

Controls how assertion failures are handled at runtime.

## Remarks

`"enabled"` is the **unconditional default** — in every environment,
including production. Assertions are a safety net that should always be
active. A clean crash with a precise message is always preferable to
silent data corruption.

Use [modeAssertIn](../functions/modeAssertIn.md) at your application entry point if you want to
override this default for a specific environment:

```ts
modeAssertIn("prod",    "warn")     // observe in production, don't crash
modeAssertIn("dev",     "disabled") // silence during heavy local iteration
modeAssertIn("staging", "enabled")  // explicit — same as default
```

| Mode         | On failure                 | When to use                      |
|--------------|----------------------------|----------------------------------|
| `"enabled"`  | Formatted output + throw   | **Always** — default everywhere  |
| `"warn"`     | Formatted output, no throw | Soft rollout in production       |
| `"disabled"` | No-op — zero overhead      | Explicit opt-out only            |
