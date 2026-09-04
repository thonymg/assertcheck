[**assertcheck v0.5.15**](../_generated.md)

***

[assertcheck](../_generated.md) / Checker

# Class: Checker\<T\>

Defined in: [src/checker.ts:51](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L51)

Base class holding the wrapped value.
Exposes [tap](#tap) for inline side-effects without breaking the chain.

## Extended by

- [`ArrayChecker`](ArrayChecker.md)
- [`ObjectChecker`](ObjectChecker.md)

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The type of the wrapped value. |

## Constructors

### Constructor

```ts
new Checker<T>(value): Checker<T>;
```

Defined in: [src/checker.ts:52](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L52)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `T` |

#### Returns

`Checker`\<`T`\>

## Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="value"></a> `value` | `readonly` | `T` | [src/checker.ts:52](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L52) |

## Methods

### narrow()

```ts
protected narrow<U, A>(fn, ...args): U;
```

Defined in: [src/checker.ts:80](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L80)

Same as [run](#run), but re-types the checker after a narrowing assertion.

#### Type Parameters

| Type Parameter |
| ------ |
| `U` |
| `A` *extends* `unknown`[] |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `fn` | (`v`, ...`args`) => `void` |
| ...`args` | `A` |

#### Returns

`U`

***

### run()

```ts
protected run<A>(fn, ...args): this;
```

Defined in: [src/checker.ts:74](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L74)

Applies an `assert.*` function to the wrapped value, then returns `this` for chaining.

#### Type Parameters

| Type Parameter |
| ------ |
| `A` *extends* `unknown`[] |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `fn` | (`v`, ...`args`) => `void` |
| ...`args` | `A` |

#### Returns

`this`

***

### tap()

```ts
tap(fn): this;
```

Defined in: [src/checker.ts:68](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L68)

Runs a side-effect function with the wrapped value and returns `this`
to allow chaining. Useful for logging or debugging mid-chain.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fn` | (`v`) => `void` | A function that receives the wrapped value. |

#### Returns

`this`

The current checker instance for chaining.

#### Example

```ts
check(orders)
  .tap(v => console.log("orders:", v))
  .all(o => o.status === "paid")
```
