---
type: llm
---

PASS only if ALL of these hold in the final answer:
- the silent `if (!orderId) return` is replaced by an assertcheck assertion (such as `assert.notEmpty(orderId, ...)`), not deleted without replacement;
- the result of `repo.findById` is checked with `assert.notNil(order, ...)` before `order.vip` is read;
- the `catch (e) { console.log(e) }` that swallows the payment error is removed (the error propagates) or rethrown with context, not left as is;
- the `if (order.vip) return gateway.charge(amount * 0.9)` branch is KEPT as business logic: it is not turned into an assertion;
- the answer mentions checking the callers of the function, because assertions now throw where the code used to return silently.

FAIL if any of these is missing, or if the vip branch is converted into an assertion.
