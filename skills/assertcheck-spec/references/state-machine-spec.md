# State Machine Spec

How to specify a state machine using Negative Space Programming.
The NSP perspective: a state machine is defined by its **forbidden transitions** — not its valid ones.

---

## State declaration

List every state, its meaning, and what must be true for an entity to be in it:

```
## States — Order

| State | Meaning | Entry condition |
|:------|:--------|:----------------|
| `pending` | Order created, not yet paid | `items.length > 0`, `customerId` exists |
| `paid` | Payment successfully processed | `transactionId` exists, `amount > 0` |
| `shipped` | Order dispatched to carrier | `trackingId` exists |
| `delivered` | Order received by customer | `deliveredAt` timestamp exists |
| `cancelled` | Order voided | can be entered from `pending` only |
| `refunded` | Payment reversed | can be entered from `paid` or `delivered` only |
```

---

## Transition table

List every valid transition. Every row that is NOT in this table is **forbidden**:

```
## Valid transitions — Order

| From | Event | To | Guard assertion |
|:-----|:------|:---|:----------------|
| `pending` | `processPayment` | `paid` | `assert.equal(order.status, "pending")` |
| `paid` | `shipOrder` | `shipped` | `assert.equal(order.status, "paid")` |
| `shipped` | `confirmDelivery` | `delivered` | `assert.equal(order.status, "shipped")` |
| `pending` | `cancelOrder` | `cancelled` | `assert.equal(order.status, "pending")` |
| `paid` | `refundOrder` | `refunded` | `assert.equal(order.status, "paid")` |
| `delivered` | `refundOrder` | `refunded` | `assert.equal(order.status, "delivered")` |
```

---

## Forbidden transition assertions

For high-risk invalid transitions, add explicit `notEqual` guards:

```
## Forbidden transition guards

// Cannot ship a cancelled order
assert.notEqual(order.status, "cancelled", {
  msg:  "cannot ship a cancelled order",
  note: "create a new order instead",
})

// Cannot pay a cancelled order
assert.notEqual(order.status, "cancelled", {
  msg:  "cannot process payment for a cancelled order",
  note: "create a new order instead",
})

// Cannot cancel a shipped order
assert.notEqual(order.status, "shipped", {
  msg:  "cannot cancel an order that has already shipped",
  note: "use refundOrder() after delivery instead",
})
```

---

## Implementation pattern

```ts
// In the service method:
function shipOrder(order: Order): ShipmentResult {
  // ── state machine guard ────────────────────────────────────────
  assert.equal(order.status, "paid", {
    msg:  "order must be paid before shipping",
    note: "call processPayment() first",
  })
  // Optionally add the most critical forbidden transition:
  assert.notEqual(order.status, "cancelled", {
    msg:  "cannot ship a cancelled order",
    note: "create a new order instead",
  })

  // ── logic ─────────────────────────────────────────────────────
  // … runs here with guaranteed preconditions
}
```

---

## Diagram notation (for the spec document)

Use a simple text diagram to show the state graph:

```
pending ──[processPayment]──► paid ──[shipOrder]──► shipped ──[confirmDelivery]──► delivered
   │                           │                                                      │
   └──[cancelOrder]──► cancelled   └──[refundOrder]──► refunded ◄──[refundOrder]──────┘
```
