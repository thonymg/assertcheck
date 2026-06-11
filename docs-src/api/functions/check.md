[**assertcheck v0.2.152**](../_generated.md)

***

[assertcheck](../_generated.md) / check

# Function: check()

## Call Signature

```ts
function check<T>(value): ArrayChecker<T>;
```

Defined in: [src/checker.ts:346](https://github.com/thonymg/assertcheck/blob/fb514a0b33c45a051bb86cba2282fd5e4dfae3f9/src/checker.ts#L346)

Creates a typed chainable checker for the given value.

### Type Parameters

| Type Parameter |
| ------ |
| `T` |

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `T`[] | The value to wrap. |

### Returns

[`ArrayChecker`](../classes/ArrayChecker.md)\<`T`\>

A chainable checker instance.

### Remarks

TypeScript overloads dispatch the correct checker:
- Arrays → [ArrayChecker](../classes/ArrayChecker.md)
- Plain objects → [ObjectChecker](../classes/ObjectChecker.md)
- Anything else → [Checker](../classes/Checker.md)

### Example

```ts
import { check } from "assertcheck"

// Array
check(users)
  .noNils()
  .uniqueBy("id")
  .all(u => u.active)

// Object
check(config)
  .hasKeys(["host", "port"])
  .dig("database.pool.max", 10)

// Scalar
check(amountCents).tap(v => assert.integer(v))
```

## Call Signature

```ts
function check<T>(value): ObjectChecker<T>;
```

Defined in: [src/checker.ts:347](https://github.com/thonymg/assertcheck/blob/fb514a0b33c45a051bb86cba2282fd5e4dfae3f9/src/checker.ts#L347)

Creates a typed chainable checker for the given value.

### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `object` |

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `T` | The value to wrap. |

### Returns

[`ObjectChecker`](../classes/ObjectChecker.md)\<`T`\>

A chainable checker instance.

### Remarks

TypeScript overloads dispatch the correct checker:
- Arrays → [ArrayChecker](../classes/ArrayChecker.md)
- Plain objects → [ObjectChecker](../classes/ObjectChecker.md)
- Anything else → [Checker](../classes/Checker.md)

### Example

```ts
import { check } from "assertcheck"

// Array
check(users)
  .noNils()
  .uniqueBy("id")
  .all(u => u.active)

// Object
check(config)
  .hasKeys(["host", "port"])
  .dig("database.pool.max", 10)

// Scalar
check(amountCents).tap(v => assert.integer(v))
```

## Call Signature

```ts
function check<T>(value): Checker<T>;
```

Defined in: [src/checker.ts:348](https://github.com/thonymg/assertcheck/blob/fb514a0b33c45a051bb86cba2282fd5e4dfae3f9/src/checker.ts#L348)

Creates a typed chainable checker for the given value.

### Type Parameters

| Type Parameter |
| ------ |
| `T` |

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `T` | The value to wrap. |

### Returns

[`Checker`](../classes/Checker.md)\<`T`\>

A chainable checker instance.

### Remarks

TypeScript overloads dispatch the correct checker:
- Arrays → [ArrayChecker](../classes/ArrayChecker.md)
- Plain objects → [ObjectChecker](../classes/ObjectChecker.md)
- Anything else → [Checker](../classes/Checker.md)

### Example

```ts
import { check } from "assertcheck"

// Array
check(users)
  .noNils()
  .uniqueBy("id")
  .all(u => u.active)

// Object
check(config)
  .hasKeys(["host", "port"])
  .dig("database.pool.max", 10)

// Scalar
check(amountCents).tap(v => assert.integer(v))
```
