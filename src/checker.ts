/**
 * @module checker
 *
 * Fluent, chainable wrapper around {@link assert}.
 * Lets you write assertion chains in a style reminiscent of Ruby or Jest's
 * `expect()`, without modifying any prototype.
 *
 * @remarks
 * Use the {@link check} factory function as the entry point. TypeScript
 * overloads dispatch the correct subclass (`ArrayChecker` or `ObjectChecker`)
 * based on the value type.
 *
 * @example
 * ```ts
 * import { check } from "assertcheck"
 *
 * // Array chain
 * check(users)
 *   .notEmpty()
 *   .noNils()
 *   .uniqueBy("id")
 *   .all(u => u.active)
 *   .sortedBy("createdAt")
 *   .len(10)
 *
 * // Object chain
 * check(config)
 *   .hasKeys(["host", "port"])
 *   .noNilValues()
 *   .dig("database.pool.max", 10)
 * ```
 */

import { isPlainObject } from "lodash"
import type { ValueIteratee } from "lodash"
import { assert } from "./assert.ts"
import type { AssertOptions } from "./types.ts"

type Opts = string | AssertOptions | undefined

// TS2775: TypeScript requires an explicit type annotation on any variable used
// as a call target when the function signature contains `asserts`. Since the
// checker methods carry their own type narrowing via return types, we strip
// the `asserts` clause from these specific calls using a cast helper.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _call = (fn: (...args: any[]) => void, ...args: unknown[]): void => fn(...args)

// ─────────────────────────────────────────────────────────────────────────────
// BASE CHECKER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Base class holding the wrapped value.
 * Exposes {@link tap} for inline side-effects without breaking the chain.
 *
 * @typeParam T - The type of the wrapped value.
 */
export class Checker<T> {
  constructor(public readonly value: T) {}

  /**
   * Runs a side-effect function with the wrapped value and returns `this`
   * to allow chaining. Useful for logging or debugging mid-chain.
   *
   * @param fn - A function that receives the wrapped value.
   * @returns The current checker instance for chaining.
   *
   * @example
   * ```ts
   * check(orders)
   *   .tap(v => console.log("orders:", v))
   *   .all(o => o.status === "paid")
   * ```
   */
  tap(fn: (v: T) => void): this {
    fn(this.value)
    return this
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ARRAY CHECKER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Chainable assertion wrapper for arrays.
 * Returned by {@link check} when the value is an array.
 *
 * @typeParam T - The element type of the wrapped array.
 *
 * @example
 * ```ts
 * check(users)
 *   .len(5)
 *   .uniqueBy("id")
 *   .all(u => u.verified)
 *   .sortedBy("name")
 * ```
 */
export class ArrayChecker<T> extends Checker<T[]> {
  /** @see {@link assert.notEmpty} */
  notEmpty(opts?: Opts): this {
    _call(assert.notEmpty, this.value, opts)
    return this
  }

  /** @see {@link assert.len} */
  len(n: number, opts?: Opts): this {
    assert.len(this.value, n, opts)
    return this
  }

  /** @see {@link assert.longerThan} */
  longerThan(n: number, opts?: Opts): this {
    assert.longerThan(this.value, n, opts)
    return this
  }

  /** @see {@link assert.shorterThan} */
  shorterThan(n: number, opts?: Opts): this {
    assert.shorterThan(this.value, n, opts)
    return this
  }

  /** @see {@link assert.includes} */
  includes(item: T, opts?: Opts): this {
    assert.includes(this.value, item, opts)
    return this
  }

  /** @see {@link assert.all} */
  all(predicate: (v: T) => boolean, opts?: Opts): this {
    _call(assert.all, this.value, predicate as (v: unknown) => boolean, opts)
    return this
  }

  /** @see {@link assert.any} */
  any(predicate: (v: T) => boolean, opts?: Opts): this {
    assert.any(this.value, predicate, opts)
    return this
  }

  /** @see {@link assert.none} */
  none(predicate: (v: T) => boolean, opts?: Opts): this {
    assert.none(this.value, predicate, opts)
    return this
  }

  /** @see {@link assert.one} */
  one(predicate: (v: T) => boolean, opts?: Opts): this {
    assert.one(this.value, predicate, opts)
    return this
  }

  /** @see {@link assert.unique} */
  unique(opts?: Opts): this {
    assert.unique(this.value, opts)
    return this
  }

  /** @see {@link assert.uniqueBy} */
  uniqueBy(iteratee: ValueIteratee<T>, opts?: Opts): this {
    assert.uniqueBy(this.value, iteratee, opts)
    return this
  }

  /** @see {@link assert.noNils} */
  noNils(opts?: Opts): ArrayChecker<NonNullable<T>> {
    _call(assert.noNils, this.value as (T | null | undefined)[], opts)
    return this as unknown as ArrayChecker<NonNullable<T>>
  }

  /** @see {@link assert.sortedBy} */
  sortedBy(iteratee: ValueIteratee<T>, opts?: Opts): this {
    assert.sortedBy(this.value, iteratee, opts)
    return this
  }

  /** @see {@link assert.first} */
  first(expected: T, opts?: Opts): this {
    assert.first(this.value, expected, opts)
    return this
  }

  /** @see {@link assert.last} */
  last(expected: T, opts?: Opts): this {
    assert.last(this.value, expected, opts)
    return this
  }

  /** @see {@link assert.subset} */
  subset(sub: T[], opts?: Opts): this {
    assert.subset(this.value, sub, opts)
    return this
  }

  /** @see {@link assert.elementsMatch} */
  elementsMatch(expected: T[], opts?: Opts): this {
    assert.elementsMatch(this.value, expected, opts)
    return this
  }

  /** @see {@link assert.containsAll} */
  containsAll(items: T[], opts?: Opts): this {
    assert.containsAll(this.value, items, opts)
    return this
  }

  /** @see {@link assert.containsNone} */
  containsNone(items: T[], opts?: Opts): this {
    assert.containsNone(this.value, items, opts)
    return this
  }

  /** @see {@link assert.flat} */
  flat(opts?: Opts): this {
    assert.flat(this.value as unknown[], opts)
    return this
  }

  /** @see {@link assert.groupedBy} */
  groupedBy(iteratee: ValueIteratee<T>, expectedGroups: string[], opts?: Opts): this {
    assert.groupedBy(this.value, iteratee, expectedGroups, opts)
    return this
  }

  /** @see {@link assert.count} */
  count(predicate: (v: T) => boolean, n: number, opts?: Opts): this {
    assert.count(this.value, predicate, n, opts)
    return this
  }

  /** @see {@link assert.increasing} */
  increasing(this: ArrayChecker<number>, opts?: Opts): ArrayChecker<number> {
    assert.increasing(this.value, opts)
    return this
  }

  /** @see {@link assert.nonDecreasing} */
  nonDecreasing(this: ArrayChecker<number>, opts?: Opts): ArrayChecker<number> {
    assert.nonDecreasing(this.value, opts)
    return this
  }

  /** @see {@link assert.sumBy} */
  sumBy(iteratee: string | ((value: T) => number), expected: number, opts?: Opts): this {
    assert.sumBy(this.value, iteratee, expected, opts)
    return this
  }

  /** @see {@link assert.allInstanceOf} */
  allInstanceOf<U, TArgs extends unknown[]>(
    ctor: new (...args: TArgs) => U,
    opts?: Opts
  ): ArrayChecker<U> {
    _call(assert.allInstanceOf, this.value, ctor, opts)
    return this as unknown as ArrayChecker<U>
  }

  /** @see {@link assert.zippedWith} */
  zippedWith<B>(other: B[], predicate: (a: T, b: B) => boolean, opts?: Opts): this {
    assert.zippedWith(this.value, other, predicate, opts)
    return this
  }

  /** @see {@link assert.partition} */
  partition(
    predicate: (v: T) => boolean,
    expectedMatch: number,
    expectedRest: number,
    opts?: Opts
  ): this {
    assert.partition(this.value, predicate, expectedMatch, expectedRest, opts)
    return this
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// OBJECT CHECKER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Chainable assertion wrapper for plain objects.
 * Returned by {@link check} when the value is a plain object.
 *
 * @remarks
 * Key assertions like {@link hasKey} and {@link hasKeys} narrow the type
 * of the wrapped value, propagating the narrowing through the chain.
 *
 * @typeParam T - The type of the wrapped object.
 *
 * @example
 * ```ts
 * check(config)
 *   .hasKeys(["host", "port"])
 *   .noNilValues()
 *   .dig("database.pool.max", 10)
 * ```
 */
export class ObjectChecker<T extends object> extends Checker<T> {
  /** @see {@link assert.notEmpty} */
  notEmpty(opts?: Opts): this {
    _call(assert.notEmpty, this.value, opts)
    return this
  }

  /** @see {@link assert.hasKey} */
  hasKey<K extends string>(key: K, opts?: Opts): ObjectChecker<T & Record<K, unknown>> {
    _call(assert.hasKey, this.value, key, opts)
    return this as unknown as ObjectChecker<T & Record<K, unknown>>
  }

  /** @see {@link assert.hasKeys} */
  hasKeys<K extends string>(keys: K[], opts?: Opts): ObjectChecker<T & Record<K, unknown>> {
    _call(assert.hasKeys, this.value, keys, opts)
    return this as unknown as ObjectChecker<T & Record<K, unknown>>
  }

  /** @see {@link assert.hasExactKeys} */
  hasExactKeys<K extends string>(keys: K[], opts?: Opts): ObjectChecker<Record<K, unknown>> {
    _call(assert.hasExactKeys, this.value, keys, opts)
    return this as unknown as ObjectChecker<Record<K, unknown>>
  }

  /** @see {@link assert.hasOnlyKeys} */
  hasOnlyKeys(allowed: string[], opts?: Opts): this {
    assert.hasOnlyKeys(this.value, allowed, opts)
    return this
  }

  /** @see {@link assert.deepEqual} */
  deepEqual(expected: T, opts?: Opts): this {
    assert.deepEqual(this.value, expected, opts)
    return this
  }

  /** @see {@link assert.containsSubset} */
  containsSubset(subset: Partial<T>, opts?: Opts): this {
    assert.containsSubset(this.value, subset, opts)
    return this
  }

  /** @see {@link assert.noNilValues} */
  noNilValues(opts?: Opts): this {
    assert.noNilValues(this.value, opts)
    return this
  }

  /** @see {@link assert.allValuesMatch} */
  allValuesMatch(predicate: (v: T[keyof T], k: keyof T) => boolean, opts?: Opts): this {
    assert.allValuesMatch(this.value, predicate, opts)
    return this
  }

  /** @see {@link assert.dig} */
  dig(path: string | string[], expected: unknown, opts?: Opts): this {
    assert.dig(this.value, path, expected, opts)
    return this
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// FACTORY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates a typed chainable checker for the given value.
 *
 * @remarks
 * TypeScript overloads dispatch the correct checker:
 * - Arrays → {@link ArrayChecker}
 * - Plain objects → {@link ObjectChecker}
 * - Anything else → {@link Checker}
 *
 * @param value - The value to wrap.
 * @returns A chainable checker instance.
 *
 * @example
 * ```ts
 * import { check } from "assertcheck"
 *
 * // Array
 * check(users)
 *   .noNils()
 *   .uniqueBy("id")
 *   .all(u => u.active)
 *
 * // Object
 * check(config)
 *   .hasKeys(["host", "port"])
 *   .dig("database.pool.max", 10)
 *
 * // Scalar
 * check(amountCents).tap(v => assert.integer(v))
 * ```
 */
export function check<T>(value: T[]): ArrayChecker<T>
export function check<T extends object>(value: T): ObjectChecker<T>
export function check<T>(value: T): Checker<T>
export function check(value: unknown): unknown {
  if (Array.isArray(value)) return new ArrayChecker(value)
  if (isPlainObject(value)) return new ObjectChecker(value as object)
  return new Checker(value)
}
