[**assertcheck v0.5.15**](../_generated.md)

***

[assertcheck](../_generated.md) / ArrayChecker

# Class: ArrayChecker\<T\>

Defined in: [src/checker.ts:93](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L93)

Chainable assertion wrapper for arrays.
Returned by [check](../functions/check.md) when the value is an array.

## Example

```ts
check(users)
  .len(5)
  .uniqueBy("id")
  .all(u => u.verified)
  .sortedBy("name")
```

## Extends

- [`Checker`](Checker.md)\<`T`[]\>

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The element type of the wrapped array. |

## Constructors

### Constructor

```ts
new ArrayChecker<T>(value): ArrayChecker<T>;
```

Defined in: [src/checker.ts:52](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L52)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `T`[] |

#### Returns

`ArrayChecker`\<`T`\>

#### Inherited from

[`Checker`](Checker.md).[`constructor`](Checker.md#constructor)

## Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="value"></a> `value` | `readonly` | `T`[] | [`Checker`](Checker.md).[`value`](Checker.md#value) | [src/checker.ts:52](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L52) |

## Methods

### all()

```ts
all(predicate, opts?): this;
```

Defined in: [src/checker.ts:125](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L125)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `predicate` | (`v`) => `boolean` |
| `opts?` | `Opts` |

#### Returns

`this`

#### See

[assert.all](../assertcheck/namespaces/assert/functions/all.md)

***

### allInstanceOf()

```ts
allInstanceOf<U, TArgs>(ctor, opts?): ArrayChecker<U>;
```

Defined in: [src/checker.ts:245](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L245)

#### Type Parameters

| Type Parameter |
| ------ |
| `U` |
| `TArgs` *extends* `unknown`[] |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctor` | (...`args`) => `U` |
| `opts?` | `Opts` |

#### Returns

`ArrayChecker`\<`U`\>

#### See

[assert.allInstanceOf](../assertcheck/namespaces/assert/functions/allInstanceOf.md)

***

### any()

```ts
any(predicate, opts?): this;
```

Defined in: [src/checker.ts:131](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L131)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `predicate` | (`v`) => `boolean` |
| `opts?` | `Opts` |

#### Returns

`this`

#### See

[assert.any](../assertcheck/namespaces/assert/functions/any.md)

***

### containsAll()

```ts
containsAll(items, opts?): this;
```

Defined in: [src/checker.ts:197](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L197)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `items` | `T`[] |
| `opts?` | `Opts` |

#### Returns

`this`

#### See

[assert.containsAll](../assertcheck/namespaces/assert/functions/containsAll.md)

***

### containsNone()

```ts
containsNone(items, opts?): this;
```

Defined in: [src/checker.ts:203](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L203)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `items` | `T`[] |
| `opts?` | `Opts` |

#### Returns

`this`

#### See

[assert.containsNone](../assertcheck/namespaces/assert/functions/containsNone.md)

***

### count()

```ts
count(
   predicate, 
   n, 
   opts?): this;
```

Defined in: [src/checker.ts:221](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L221)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `predicate` | (`v`) => `boolean` |
| `n` | `number` |
| `opts?` | `Opts` |

#### Returns

`this`

#### See

[assert.count](../assertcheck/namespaces/assert/functions/count.md)

***

### elementsMatch()

```ts
elementsMatch(expected, opts?): this;
```

Defined in: [src/checker.ts:191](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L191)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `expected` | `T`[] |
| `opts?` | `Opts` |

#### Returns

`this`

#### See

[assert.elementsMatch](../assertcheck/namespaces/assert/functions/elementsMatch.md)

***

### first()

```ts
first(expected, opts?): this;
```

Defined in: [src/checker.ts:173](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L173)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `expected` | `T` |
| `opts?` | `Opts` |

#### Returns

`this`

#### See

[assert.first](../assertcheck/namespaces/assert/functions/first.md)

***

### flat()

```ts
flat(opts?): this;
```

Defined in: [src/checker.ts:209](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L209)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts?` | `Opts` |

#### Returns

`this`

#### See

[assert.flat](../assertcheck/namespaces/assert/functions/flat.md)

***

### groupedBy()

```ts
groupedBy(
   iteratee, 
   expectedGroups, 
   opts?): this;
```

Defined in: [src/checker.ts:215](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L215)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `iteratee` | `ValueIteratee`\<`T`\> |
| `expectedGroups` | `string`[] |
| `opts?` | `Opts` |

#### Returns

`this`

#### See

[assert.groupedBy](../assertcheck/namespaces/assert/functions/groupedBy.md)

***

### includes()

```ts
includes(item, opts?): this;
```

Defined in: [src/checker.ts:119](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L119)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `item` | `T` |
| `opts?` | `Opts` |

#### Returns

`this`

#### See

[assert.includes](../assertcheck/namespaces/assert/functions/includes.md)

***

### increasing()

```ts
increasing(this, opts?): ArrayChecker<number>;
```

Defined in: [src/checker.ts:227](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L227)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `this` | `ArrayChecker`\<`number`\> |
| `opts?` | `Opts` |

#### Returns

`ArrayChecker`\<`number`\>

#### See

[assert.increasing](../assertcheck/namespaces/assert/functions/increasing.md)

***

### last()

```ts
last(expected, opts?): this;
```

Defined in: [src/checker.ts:179](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L179)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `expected` | `T` |
| `opts?` | `Opts` |

#### Returns

`this`

#### See

[assert.last](../assertcheck/namespaces/assert/functions/last.md)

***

### len()

```ts
len(n, opts?): this;
```

Defined in: [src/checker.ts:101](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L101)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `n` | `number` |
| `opts?` | `Opts` |

#### Returns

`this`

#### See

[assert.len](../assertcheck/namespaces/assert/functions/len.md)

***

### longerThan()

```ts
longerThan(n, opts?): this;
```

Defined in: [src/checker.ts:107](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L107)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `n` | `number` |
| `opts?` | `Opts` |

#### Returns

`this`

#### See

[assert.longerThan](../assertcheck/namespaces/assert/functions/longerThan.md)

***

### nonDecreasing()

```ts
nonDecreasing(this, opts?): ArrayChecker<number>;
```

Defined in: [src/checker.ts:233](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L233)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `this` | `ArrayChecker`\<`number`\> |
| `opts?` | `Opts` |

#### Returns

`ArrayChecker`\<`number`\>

#### See

[assert.nonDecreasing](../assertcheck/namespaces/assert/functions/nonDecreasing.md)

***

### none()

```ts
none(predicate, opts?): this;
```

Defined in: [src/checker.ts:137](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L137)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `predicate` | (`v`) => `boolean` |
| `opts?` | `Opts` |

#### Returns

`this`

#### See

[assert.none](../assertcheck/namespaces/assert/functions/none.md)

***

### noNils()

```ts
noNils(opts?): ArrayChecker<NonNullable<T>>;
```

Defined in: [src/checker.ts:161](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L161)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts?` | `Opts` |

#### Returns

`ArrayChecker`\<`NonNullable`\<`T`\>\>

#### See

[assert.noNils](../assertcheck/namespaces/assert/functions/noNils.md)

***

### notEmpty()

```ts
notEmpty(opts?): this;
```

Defined in: [src/checker.ts:95](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L95)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts?` | `Opts` |

#### Returns

`this`

#### See

[assert.notEmpty](../assertcheck/namespaces/assert/functions/notEmpty.md)

***

### one()

```ts
one(predicate, opts?): this;
```

Defined in: [src/checker.ts:143](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L143)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `predicate` | (`v`) => `boolean` |
| `opts?` | `Opts` |

#### Returns

`this`

#### See

[assert.one](../assertcheck/namespaces/assert/functions/one.md)

***

### partition()

```ts
partition(
   predicate, 
   expectedMatch, 
   expectedRest, 
   opts?): this;
```

Defined in: [src/checker.ts:260](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L260)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `predicate` | (`v`) => `boolean` |
| `expectedMatch` | `number` |
| `expectedRest` | `number` |
| `opts?` | `Opts` |

#### Returns

`this`

#### See

[assert.partition](../assertcheck/namespaces/assert/functions/partition.md)

***

### shorterThan()

```ts
shorterThan(n, opts?): this;
```

Defined in: [src/checker.ts:113](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L113)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `n` | `number` |
| `opts?` | `Opts` |

#### Returns

`this`

#### See

[assert.shorterThan](../assertcheck/namespaces/assert/functions/shorterThan.md)

***

### sortedBy()

```ts
sortedBy(iteratee, opts?): this;
```

Defined in: [src/checker.ts:167](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L167)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `iteratee` | `ValueIteratee`\<`T`\> |
| `opts?` | `Opts` |

#### Returns

`this`

#### See

[assert.sortedBy](../assertcheck/namespaces/assert/functions/sortedBy.md)

***

### subset()

```ts
subset(sub, opts?): this;
```

Defined in: [src/checker.ts:185](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L185)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `sub` | `T`[] |
| `opts?` | `Opts` |

#### Returns

`this`

#### See

[assert.subset](../assertcheck/namespaces/assert/functions/subset.md)

***

### sumBy()

```ts
sumBy(
   iteratee, 
   expected, 
   opts?): this;
```

Defined in: [src/checker.ts:239](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L239)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `iteratee` | `string` \| ((`value`) => `number`) |
| `expected` | `number` |
| `opts?` | `Opts` |

#### Returns

`this`

#### See

[assert.sumBy](../assertcheck/namespaces/assert/functions/sumBy.md)

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

***

### unique()

```ts
unique(opts?): this;
```

Defined in: [src/checker.ts:149](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L149)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts?` | `Opts` |

#### Returns

`this`

#### See

[assert.unique](../assertcheck/namespaces/assert/functions/unique.md)

***

### uniqueBy()

```ts
uniqueBy(iteratee, opts?): this;
```

Defined in: [src/checker.ts:155](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L155)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `iteratee` | `ValueIteratee`\<`T`\> |
| `opts?` | `Opts` |

#### Returns

`this`

#### See

[assert.uniqueBy](../assertcheck/namespaces/assert/functions/uniqueBy.md)

***

### zippedWith()

```ts
zippedWith<B>(
   other, 
   predicate, 
   opts?): this;
```

Defined in: [src/checker.ts:254](https://github.com/thonymg/assertcheck/blob/a4f674791ee66694604d65e54a1ef37326d7e87a/src/checker.ts#L254)

#### Type Parameters

| Type Parameter |
| ------ |
| `B` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `other` | `B`[] |
| `predicate` | (`a`, `b`) => `boolean` |
| `opts?` | `Opts` |

#### Returns

`this`

#### See

[assert.zippedWith](../assertcheck/namespaces/assert/functions/zippedWith.md)
