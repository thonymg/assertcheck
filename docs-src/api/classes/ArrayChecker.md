[**assertcheck v0.2.152**](../_generated.md)

***

[assertcheck](../_generated.md) / ArrayChecker

# Class: ArrayChecker\<T\>

Defined in: [src/checker.ts:99](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/checker.ts#L99)

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

Defined in: [src/checker.ts:58](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/checker.ts#L58)

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
| <a id="value"></a> `value` | `readonly` | `T`[] | [`Checker`](Checker.md).[`value`](Checker.md#value) | [src/checker.ts:58](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/checker.ts#L58) |

## Methods

### all()

```ts
all(predicate, opts?): this;
```

Defined in: [src/checker.ts:131](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/checker.ts#L131)

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

### any()

```ts
any(predicate, opts?): this;
```

Defined in: [src/checker.ts:137](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/checker.ts#L137)

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

Defined in: [src/checker.ts:203](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/checker.ts#L203)

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

Defined in: [src/checker.ts:209](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/checker.ts#L209)

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

### elementsMatch()

```ts
elementsMatch(expected, opts?): this;
```

Defined in: [src/checker.ts:197](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/checker.ts#L197)

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

Defined in: [src/checker.ts:179](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/checker.ts#L179)

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

Defined in: [src/checker.ts:215](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/checker.ts#L215)

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

Defined in: [src/checker.ts:221](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/checker.ts#L221)

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

Defined in: [src/checker.ts:125](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/checker.ts#L125)

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

### last()

```ts
last(expected, opts?): this;
```

Defined in: [src/checker.ts:185](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/checker.ts#L185)

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

Defined in: [src/checker.ts:107](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/checker.ts#L107)

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

Defined in: [src/checker.ts:113](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/checker.ts#L113)

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

### none()

```ts
none(predicate, opts?): this;
```

Defined in: [src/checker.ts:143](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/checker.ts#L143)

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
noNils(opts?): this;
```

Defined in: [src/checker.ts:167](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/checker.ts#L167)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts?` | `Opts` |

#### Returns

`this`

#### See

[assert.noNils](../assertcheck/namespaces/assert/functions/noNils.md)

***

### notEmpty()

```ts
notEmpty(opts?): this;
```

Defined in: [src/checker.ts:101](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/checker.ts#L101)

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

Defined in: [src/checker.ts:149](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/checker.ts#L149)

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

### shorterThan()

```ts
shorterThan(n, opts?): this;
```

Defined in: [src/checker.ts:119](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/checker.ts#L119)

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

Defined in: [src/checker.ts:173](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/checker.ts#L173)

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

Defined in: [src/checker.ts:191](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/checker.ts#L191)

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

### tap()

```ts
tap(fn): this;
```

Defined in: [src/checker.ts:74](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/checker.ts#L74)

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

Defined in: [src/checker.ts:155](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/checker.ts#L155)

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

Defined in: [src/checker.ts:161](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/checker.ts#L161)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `iteratee` | `ValueIteratee`\<`T`\> |
| `opts?` | `Opts` |

#### Returns

`this`

#### See

[assert.uniqueBy](../assertcheck/namespaces/assert/functions/uniqueBy.md)
