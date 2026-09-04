[**assertcheck v0.5.15**](../_generated.md)

***

[assertcheck](../_generated.md) / check

# Function: check()

## Call Signature

```ts
function check<T>(value): ArrayChecker<T>;
```

Defined in: [src/checker.ts:390](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L390)

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

Defined in: [src/checker.ts:391](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L391)

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

Defined in: [src/checker.ts:392](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L392)

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
