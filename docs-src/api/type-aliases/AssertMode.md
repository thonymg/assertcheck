[**assertcheck v0.2.152**](../_generated.md)

***

[assertcheck](../_generated.md) / AssertMode

# Type Alias: AssertMode

```ts
type AssertMode = "disabled" | "warn" | "enabled";
```

Defined in: [src/types.ts:36](https://github.com/thonymg/assertcheck/blob/fb514a0b33c45a051bb86cba2282fd5e4dfae3f9/src/types.ts#L36)

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
