# Refactor Diff Format

The output format for assertcheck-refactor proposals.
Always show a minimal, targeted diff — not a full rewrite unless the function is short (< 20 lines).

---

## Impact table

First, a table summarizing what changes and why a guard is needed:

```
## Refactor impact — `processPayment`

| Change | Type | Guard required |
|:-------|:-----|:---------------|
| New param `currency: string` added | New parameter | `assert.string + assert.notEmpty` |
| `order` now fetched inside function | Integration point | `assert.notNil` after fetch |
| `if (!order) return` removed | Silent exit removed | Replace with `assert.notNil` |
| New call to `taxService.compute()` | New external call | `assert.notNil` on result |
```

---

## Guard diff blocks

Then, targeted code snippets showing exactly what to add, with line anchors:

````
## Guards to add

```ts
// ➕ ADD — top of function, after existing param guards (~line 8)
assert.string(currency,   "currency must be a string")
assert.notEmpty(currency, "currency code must not be empty")
```

```ts
// ➕ ADD — after `const order = await repo.findById(orderId)` (~line 15)
assert.notNil(order, {
  msg:    "order must exist before processing payment",
  actual: "orderId",
  note:   "verify the orderId comes from a valid creation flow",
})
```

```ts
// ➕ ADD — after `const tax = await taxService.compute(order)` (~line 22)
assert.notNil(tax.amount, {
  msg:  "tax service must return a computed amount",
  note: "check taxService configuration if this fires",
})
```
````

---

## Removed safety flags

For every removed `if (!x) return` or `?? fallback`:

```
## ⚠ Removed safety checks

Line 14: `if (!order) return` was removed.
→ The caller will no longer receive a silent `undefined` return.
→ Replaced with: `assert.notNil(order, { msg: "order must exist", … })`
→ Why: silent returns hide failures. The assertion surfaces the problem immediately
   with context, instead of letting undefined propagate to the caller.
```

---

## When to show a full rewrite

Show the complete rewritten function when:
- The function is fewer than 25 lines
- Guards need to be interleaved with the logic (not just at the top)
- The diff alone would be harder to read than the full version

Format the full rewrite the same way as `assertcheck-feature`:
guard block + logic block, with a `// ── guards ───` separator.
