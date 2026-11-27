---
type: llm
---

PASS if the final answer contains a TypeScript `applyDiscount` where:
- the assertcheck guards (for example `assert.positive(price, ...)` and `assert.withinRange(pct, 0, 1, ...)`) come first in the function body, before any computation;
- every assertion has a message that states the invariant (such as "discount must be a fraction between 0 and 1"), not a generic "invalid value";
- the logic after the guards contains no `?.`, no `??`, and no `if (!x) return` style silent exit;
- it does not add redundant type assertions such as `assert.number(price)` on parameters already typed `number`.

FAIL if guards are missing, come after logic, use silent returns or defaults for invalid input, or use vague messages.
