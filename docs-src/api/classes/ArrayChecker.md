[**assertcheck v0.5.15**](../_generated.md)

***

[assertcheck](../_generated.md) / ArrayChecker

# Class: ArrayChecker\<T\>

Defined in: [src/checker.ts:104](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L104)

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

Defined in: [src/checker.ts:52](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L52)

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
| <a id="value"></a> `value` | `readonly` | `T`[] | [`Checker`](Checker.md).[`value`](Checker.md#value) | [src/checker.ts:52](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L52) |

## Methods

### all()

```ts
all(predicate, opts?): this;
```

Defined in: [src/checker.ts:131](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L131)

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

Defined in: [src/checker.ts:231](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L231)

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

Defined in: [src/checker.ts:136](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L136)

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

Defined in: [src/checker.ts:191](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L191)

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

Defined in: [src/checker.ts:196](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L196)

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

Defined in: [src/checker.ts:211](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L211)

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

Defined in: [src/checker.ts:186](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L186)

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

Defined in: [src/checker.ts:171](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L171)

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

Defined in: [src/checker.ts:201](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L201)

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

Defined in: [src/checker.ts:206](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L206)

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

Defined in: [src/checker.ts:126](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L126)

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

Defined in: [src/checker.ts:216](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L216)

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

Defined in: [src/checker.ts:176](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L176)

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

Defined in: [src/checker.ts:111](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L111)

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

Defined in: [src/checker.ts:116](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L116)

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

#### Inherited from

[`Checker`](Checker.md).[`narrow`](Checker.md#narrow)

***

### nonDecreasing()

```ts
nonDecreasing(this, opts?): ArrayChecker<number>;
```

Defined in: [src/checker.ts:221](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L221)

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

Defined in: [src/checker.ts:141](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L141)

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

Defined in: [src/checker.ts:161](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L161)

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

Defined in: [src/checker.ts:106](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L106)

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

Defined in: [src/checker.ts:146](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L146)

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

Defined in: [src/checker.ts:244](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L244)

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

#### Inherited from

[`Checker`](Checker.md).[`run`](Checker.md#run)

***

### shorterThan()

```ts
shorterThan(n, opts?): this;
```

Defined in: [src/checker.ts:121](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L121)

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

Defined in: [src/checker.ts:166](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L166)

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

Defined in: [src/checker.ts:181](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L181)

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

Defined in: [src/checker.ts:226](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L226)

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

#### Inherited from

[`Checker`](Checker.md).[`tap`](Checker.md#tap)

***

### unique()

```ts
unique(opts?): this;
```

Defined in: [src/checker.ts:151](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L151)

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

Defined in: [src/checker.ts:156](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L156)

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

Defined in: [src/checker.ts:239](https://github.com/thonymg/assertcheck/blob/d10e4dd99a64cd5c4ba04c3147d48ef32bb74c99/src/checker.ts#L239)

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
