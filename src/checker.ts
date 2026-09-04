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

  /** Applies an `assert.*` function to the wrapped value, then returns `this` for chaining. */
  protected run<A extends unknown[]>(fn: (v: T, ...args: A) => void, ...args: A): this {
    fn(this.value, ...args)
    return this
  }

  /** Same as {@link run}, but re-types the checker after a narrowing assertion. */
  protected narrow<U, A extends unknown[]>(fn: (v: T, ...args: A) => void, ...args: A): U {
    return this.run(fn, ...args) as unknown as U
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
    return this.run(assert.notEmpty, opts)
  }

  /** @see {@link assert.len} */
  len(n: number, opts?: Opts): this {
    return this.run(assert.len, n, opts)
  }

  /** @see {@link assert.longerThan} */
  longerThan(n: number, opts?: Opts): this {
    return this.run(assert.longerThan, n, opts)
  }

  /** @see {@link assert.shorterThan} */
  shorterThan(n: number, opts?: Opts): this {
    return this.run(assert.shorterThan, n, opts)
  }

  /** @see {@link assert.includes} */
  includes(item: T, opts?: Opts): this {
    return this.run(assert.includes, item, opts)
  }

  /** @see {@link assert.all} */
  all(predicate: (v: T) => boolean, opts?: Opts): this {
    return this.run(assert.all, predicate, opts)
  }

  /** @see {@link assert.any} */
  any(predicate: (v: T) => boolean, opts?: Opts): this {
    return this.run(assert.any, predicate, opts)
  }

  /** @see {@link assert.none} */
  none(predicate: (v: T) => boolean, opts?: Opts): this {
    return this.run(assert.none, predicate, opts)
  }

  /** @see {@link assert.one} */
  one(predicate: (v: T) => boolean, opts?: Opts): this {
    return this.run(assert.one, predicate, opts)
  }

  /** @see {@link assert.unique} */
  unique(opts?: Opts): this {
    return this.run(assert.unique, opts)
  }

  /** @see {@link assert.uniqueBy} */
  uniqueBy(iteratee: ValueIteratee<T>, opts?: Opts): this {
    return this.run(assert.uniqueBy, iteratee, opts)
  }

  /** @see {@link assert.noNils} */
  noNils(opts?: Opts): ArrayChecker<NonNullable<T>> {
    return this.narrow(assert.noNils, opts)
  }

  /** @see {@link assert.sortedBy} */
  sortedBy(iteratee: ValueIteratee<T>, opts?: Opts): this {
    return this.run(assert.sortedBy, iteratee, opts)
  }

  /** @see {@link assert.first} */
  first(expected: T, opts?: Opts): this {
    return this.run(assert.first, expected, opts)
  }

  /** @see {@link assert.last} */
  last(expected: T, opts?: Opts): this {
    return this.run(assert.last, expected, opts)
  }

  /** @see {@link assert.subset} */
  subset(sub: T[], opts?: Opts): this {
    return this.run(assert.subset, sub, opts)
  }

  /** @see {@link assert.elementsMatch} */
  elementsMatch(expected: T[], opts?: Opts): this {
    return this.run(assert.elementsMatch, expected, opts)
  }

  /** @see {@link assert.containsAll} */
  containsAll(items: T[], opts?: Opts): this {
    return this.run(assert.containsAll, items, opts)
  }

  /** @see {@link assert.containsNone} */
  containsNone(items: T[], opts?: Opts): this {
    return this.run(assert.containsNone, items, opts)
  }

  /** @see {@link assert.flat} */
  flat(opts?: Opts): this {
    return this.run(assert.flat, opts)
  }

  /** @see {@link assert.groupedBy} */
  groupedBy(iteratee: ValueIteratee<T>, expectedGroups: string[], opts?: Opts): this {
    return this.run(assert.groupedBy, iteratee, expectedGroups, opts)
  }

  /** @see {@link assert.count} */
  count(predicate: (v: T) => boolean, n: number, opts?: Opts): this {
    return this.run(assert.count, predicate, n, opts)
  }

  /** @see {@link assert.increasing} */
  increasing(this: ArrayChecker<number>, opts?: Opts): ArrayChecker<number> {
    return this.run(assert.increasing, opts)
  }

  /** @see {@link assert.nonDecreasing} */
  nonDecreasing(this: ArrayChecker<number>, opts?: Opts): ArrayChecker<number> {
    return this.run(assert.nonDecreasing, opts)
  }

  /** @see {@link assert.sumBy} */
  sumBy(iteratee: string | ((value: T) => number), expected: number, opts?: Opts): this {
    return this.run(assert.sumBy, iteratee, expected, opts)
  }

  /** @see {@link assert.allInstanceOf} */
  allInstanceOf<U, TArgs extends unknown[]>(
    ctor: new (...args: TArgs) => U,
    opts?: Opts
  ): ArrayChecker<U> {
    return this.narrow(assert.allInstanceOf, ctor, opts)
  }

  /** @see {@link assert.zippedWith} */
  zippedWith<B>(other: B[], predicate: (a: T, b: B) => boolean, opts?: Opts): this {
    return this.run(assert.zippedWith, other, predicate, opts)
  }

  /** @see {@link assert.partition} */
  partition(
    predicate: (v: T) => boolean,
    expectedMatch: number,
    expectedRest: number,
    opts?: Opts
  ): this {
    return this.run(assert.partition, predicate, expectedMatch, expectedRest, opts)
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
    return this.run(assert.notEmpty, opts)
  }

  /** @see {@link assert.hasKey} */
  hasKey<K extends string>(key: K, opts?: Opts): ObjectChecker<T & Record<K, unknown>> {
    return this.narrow(assert.hasKey, key, opts)
  }

  /** @see {@link assert.hasKeys} */
  hasKeys<K extends string>(keys: K[], opts?: Opts): ObjectChecker<T & Record<K, unknown>> {
    return this.narrow(assert.hasKeys, keys, opts)
  }

  /** @see {@link assert.hasExactKeys} */
  hasExactKeys<K extends string>(keys: K[], opts?: Opts): ObjectChecker<Record<K, unknown>> {
    return this.narrow(assert.hasExactKeys, keys, opts)
  }

  /** @see {@link assert.hasOnlyKeys} */
  hasOnlyKeys(allowed: string[], opts?: Opts): this {
    return this.run(assert.hasOnlyKeys, allowed, opts)
  }

  /** @see {@link assert.deepEqual} */
  deepEqual(expected: T, opts?: Opts): this {
    return this.run(assert.deepEqual, expected, opts)
  }

  /** @see {@link assert.containsSubset} */
  containsSubset(subset: Partial<T>, opts?: Opts): this {
    return this.run(assert.containsSubset, subset, opts)
  }

  /** @see {@link assert.noNilValues} */
  noNilValues(opts?: Opts): this {
    return this.run(assert.noNilValues, opts)
  }

  /** @see {@link assert.allValuesMatch} */
  allValuesMatch(predicate: (v: T[keyof T], k: keyof T) => boolean, opts?: Opts): this {
    return this.run(assert.allValuesMatch, predicate, opts)
  }

  /** @see {@link assert.dig} */
  dig(path: string | string[], expected: unknown, opts?: Opts): this {
    return this.run(assert.dig, path, expected, opts)
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
