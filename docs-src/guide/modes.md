# Assertion modes

::: warning This page is no longer applicable
The mode system (`modeAssertIn`, `setAssertMode`, `getAssertMode`, `withMode`) has been removed.

**Assertions in assertcheck are always enabled.** Every failure always outputs and throws — in every environment, with no configuration.

There is no `"warn"`, `"disabled"`, or `"enabled"` mode. There is no `NODE_ENV` detection. Import and use.
:::

```ts
import { assert } from "assertcheck"

// Always throws on failure — no setup required
assert.notNil(userId, "userId is required")
```
