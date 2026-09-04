[**assertcheck v0.5.15**](../_generated.md)

***

[assertcheck](../_generated.md) / Checker

# Class: Checker\<T\>

Defined in: [src/checker.ts:51](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L51)

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

Defined in: [src/checker.ts:52](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L52)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `T` |

#### Returns

`Checker`\<`T`\>

## Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="value"></a> `value` | `readonly` | `T` | [src/checker.ts:52](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L52) |

## Methods

### tap()

```ts
tap(fn): this;
```

Defined in: [src/checker.ts:68](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L68)

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
