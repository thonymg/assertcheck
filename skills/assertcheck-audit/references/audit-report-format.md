# Audit Report Format

The output structure for assertcheck-audit. Every audit delivers these four blocks in order.

---

## Block 1 — Audit score

A one-line guard coverage summary:

```
## Audit — `OrderService.processPayment`

Guard coverage: 1 / 5 boundaries protected — 4 gaps found (1 critical, 2 high, 1 medium)
```

---

## Block 2 — Findings table

Sorted by risk (🔴 first), one row per gap:

```
| # | Line | Boundary type | Risk | Implicit assumption | Fix |
|:--|:-----|:-------------|:-----|:--------------------|:----|
| 1 | 14 | Integration | 🔴 Critical | `order` could be null — `.status` accessed on line 18 | `assert.notNil(order, {…})` |
| 2 | 8 | Function entry | 🟠 High | `if (!orderId) return` hides failure from caller | replace with `assert.notNil` |
| 3 | 8 | Function entry | 🟡 Medium | `amount` not type-checked — could be NaN or string | `assert.number + assert.greater` |
| 4 | 22 | State machine | 🟡 Medium | `order.status` read without asserting expected state | `assert.equal(order.status, "pending")` |
```

---

## Block 3 — Proposed assertions

Exact code blocks with line anchors. No full rewrite — targeted insertions only
(unless the function is short enough to show fully):

````
## Proposed assertions

```ts
// ➕ line 7 — replace `if (!orderId) return`
assert.notNil(orderId, {
  msg:  "orderId is required to process a payment",
  note: "check that the caller passes a valid order id",
})
assert.string(orderId,   "orderId must be a string")
assert.notEmpty(orderId, "orderId must not be empty")

// ➕ line 8 — add after existing string checks
assert.number(amount,   "amount must be a number")
assert.greater(amount, 0, {
  msg:  "payment amount must be positive",
  note: "use refundPayment() for negative adjustments",
})
```

```ts
// ➕ line 16 — after `const order = await repo.findById(orderId)`
assert.notNil(order, {
  msg:    "order must exist before processing payment",
  actual: "orderId",
  note:   "verify the orderId comes from a valid order creation flow",
})
```

```ts
// ➕ line 17 — state machine guard
assert.equal(order.status, "pending", {
  msg:  "payment can only be processed for pending orders",
  note: "call resetOrder() to return to pending state",
})
```
````

---

## Block 4 — Mindset note

One paragraph. Focus on the most impactful finding. Use plain language, no jargon:

```
> **Key finding:** line 14 is the highest risk — `order` is fetched from the database
> and used immediately without checking if it exists. If the order was deleted between
> the ID being issued and this call, `order.status` on line 18 will throw a cryptic
> `Cannot read properties of null` error with no hint of which order ID was invalid
> or which caller triggered the operation. Adding `assert.notNil` here turns that
> opaque crash into a precise, traceable failure with full context.
```

---

## Audit score interpretation

| Coverage | Meaning |
|:---------|:--------|
| 0–2 / N | Unprotected — any external input can cause silent corruption |
| 3–5 / N | Partially guarded — critical paths covered, edges exposed |
| 6–8 / N | Well-guarded — most boundaries covered, minor gaps |
| N / N | Fully guarded — all boundaries declared |
