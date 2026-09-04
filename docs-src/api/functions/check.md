[**assertcheck v0.5.15**](../_generated.md)

***

[assertcheck](../_generated.md) / check

# Function: check()

## Call Signature

```ts
function check<T>(value): ArrayChecker<T>;
```

Defined in: [src/checker.ts:363](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L363)

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

Defined in: [src/checker.ts:364](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L364)

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

Defined in: [src/checker.ts:365](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L365)

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
