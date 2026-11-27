---
max_turns: 8
allowed_tools: [Read, Glob, Grep, Skill]
---

I'm about to add a `currency` parameter to this function. It uses the assertcheck library. Harden it before I change it, and show me the result.

```ts
async function processPayment(orderId: string, amount: number) {
  if (!orderId) return
  const order = await repo.findById(orderId)
  if (order.vip) return gateway.charge(amount * 0.9)
  try {
    return await gateway.charge(amount)
  } catch (e) {
    console.log(e)
  }
}
```
