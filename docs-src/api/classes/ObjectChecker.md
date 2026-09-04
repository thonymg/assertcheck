[**assertcheck v0.5.15**](../_generated.md)

***

[assertcheck](../_generated.md) / ObjectChecker

# Class: ObjectChecker\<T\>

Defined in: [src/checker.ts:293](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L293)

Chainable assertion wrapper for plain objects.
Returned by [check](../functions/check.md) when the value is a plain object.

## Remarks

Key assertions like [hasKey](#haskey) and [hasKeys](#haskeys) narrow the type
of the wrapped value, propagating the narrowing through the chain.

## Example

```ts
check(config)
  .hasKeys(["host", "port"])
  .noNilValues()
  .dig("database.pool.max", 10)
```

## Extends

- [`Checker`](Checker.md)\<`T`\>

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` *extends* `object` | The type of the wrapped object. |

## Constructors

### Constructor

```ts
new ObjectChecker<T>(value): ObjectChecker<T>;
```

Defined in: [src/checker.ts:52](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L52)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `T` |

#### Returns

`ObjectChecker`\<`T`\>

#### Inherited from

[`Checker`](Checker.md).[`constructor`](Checker.md#constructor)

## Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="value"></a> `value` | `readonly` | `T` | [`Checker`](Checker.md).[`value`](Checker.md#value) | [src/checker.ts:52](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L52) |

## Methods

### allValuesMatch()

```ts
allValuesMatch(predicate, opts?): this;
```

Defined in: [src/checker.ts:343](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L343)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `predicate` | (`v`, `k`) => `boolean` |
| `opts?` | `Opts` |

#### Returns

`this`

#### See

[assert.allValuesMatch](../assertcheck/namespaces/assert/functions/allValuesMatch.md)

***

### containsSubset()

```ts
containsSubset(subset, opts?): this;
```

Defined in: [src/checker.ts:331](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L331)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `subset` | `Partial`\<`T`\> |
| `opts?` | `Opts` |

#### Returns

`this`

#### See

[assert.containsSubset](../assertcheck/namespaces/assert/functions/containsSubset.md)

***

### deepEqual()

```ts
deepEqual(expected, opts?): this;
```

Defined in: [src/checker.ts:325](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L325)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `expected` | `T` |
| `opts?` | `Opts` |

#### Returns

`this`

#### See

[assert.deepEqual](../assertcheck/namespaces/assert/functions/deepEqual.md)

***

### dig()

```ts
dig(
   path, 
   expected, 
   opts?): this;
```

Defined in: [src/checker.ts:349](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L349)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `path` | `string` \| `string`[] |
| `expected` | `unknown` |
| `opts?` | `Opts` |

#### Returns

`this`

#### See

[assert.dig](../assertcheck/namespaces/assert/functions/dig.md)

***

### hasExactKeys()

```ts
hasExactKeys<K>(keys, opts?): ObjectChecker<Record<K, unknown>>;
```

Defined in: [src/checker.ts:313](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L313)

#### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* `string` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `keys` | `K`[] |
| `opts?` | `Opts` |

#### Returns

`ObjectChecker`\<`Record`\<`K`, `unknown`\>\>

#### See

[assert.hasExactKeys](../assertcheck/namespaces/assert/functions/hasExactKeys.md)

***

### hasKey()

```ts
hasKey<K>(key, opts?): ObjectChecker<T & Record<K, unknown>>;
```

Defined in: [src/checker.ts:301](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L301)

#### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* `string` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `K` |
| `opts?` | `Opts` |

#### Returns

`ObjectChecker`\<`T` & `Record`\<`K`, `unknown`\>\>

#### See

[assert.hasKey](../assertcheck/namespaces/assert/functions/hasKey.md)

***

### hasKeys()

```ts
hasKeys<K>(keys, opts?): ObjectChecker<T & Record<K, unknown>>;
```

Defined in: [src/checker.ts:307](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L307)

#### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* `string` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `keys` | `K`[] |
| `opts?` | `Opts` |

#### Returns

`ObjectChecker`\<`T` & `Record`\<`K`, `unknown`\>\>

#### See

[assert.hasKeys](../assertcheck/namespaces/assert/functions/hasKeys.md)

***

### hasOnlyKeys()

```ts
hasOnlyKeys(allowed, opts?): this;
```

Defined in: [src/checker.ts:319](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L319)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `allowed` | `string`[] |
| `opts?` | `Opts` |

#### Returns

`this`

#### See

[assert.hasOnlyKeys](../assertcheck/namespaces/assert/functions/hasOnlyKeys.md)

***

### noNilValues()

```ts
noNilValues(opts?): this;
```

Defined in: [src/checker.ts:337](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L337)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts?` | `Opts` |

#### Returns

`this`

#### See

[assert.noNilValues](../assertcheck/namespaces/assert/functions/noNilValues.md)

***

### notEmpty()

```ts
notEmpty(opts?): this;
```

Defined in: [src/checker.ts:295](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L295)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts?` | `Opts` |

#### Returns

`this`

#### See

[assert.notEmpty](../assertcheck/namespaces/assert/functions/notEmpty.md)

***

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

#### Inherited from

[`Checker`](Checker.md).[`tap`](Checker.md#tap)
