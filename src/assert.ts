/**
 * @module assert
 *
 * The core assertion module. Provides typed, richly-formatted assertions
 * for primitives, arrays, objects, and functions.
 *
 * @remarks
 * All assertions respect the global {@link AssertMode}:
 * - `"disabled"` → no-op (production default)
 * - `"warn"`     → output only
 * - `"enabled"`  → output + throw
 *
 * Every assertion accepts an optional `opts` parameter that can be either:
 * - A plain `string` — used as the error title.
 * - An {@link AssertOptions} object for richer context.
 *
 * @example
 * ```ts
 * import { assert } from "assertcheck"
 *
 * assert.equal(order.status, "pending", {
 *   msg:    "order must be pending before payment",
 *   actual: "order.status",
 *   note:   "call resetOrder() first",
 * })
 * ```
 */

import _ from "lodash"
import { isDisabled } from "./mode.ts"
import { fail } from "./fail.ts"
import { buildBlock, fmtValue, color, parseOpts, diffObjects } from "./format.ts"
import type { AssertOptions } from "./types.ts"

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL SHORTHAND
// ─────────────────────────────────────────────────────────────────────────────

type Opts = string | AssertOptions | undefined

// ─────────────────────────────────────────────────────────────────────────────
// ASSERT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Explicit type for the assertion namespace — required for JSR slow-type compliance.
 * @public
 */
export interface Assert {
  // ── Existence
  nil(v: unknown, opts?: Opts): asserts v is null | undefined
  notNil<T>(v: T | null | undefined, opts?: Opts): asserts v is NonNullable<T>
  empty(v: unknown, opts?: Opts): void
  notEmpty<T>(v: T, opts?: Opts): asserts v is NonNullable<T>
  // ── Type guards
  string(v: unknown, opts?: Opts): asserts v is string
  number(v: unknown, opts?: Opts): asserts v is number
  integer(v: unknown, opts?: Opts): asserts v is number
  finite(v: unknown, opts?: Opts): asserts v is number
  boolean(v: unknown, opts?: Opts): asserts v is boolean
  array<T = unknown>(v: unknown, opts?: Opts): asserts v is T[]
  object<T extends object = object>(v: unknown, opts?: Opts): asserts v is T
  func<T extends (...args: unknown[]) => unknown = (...args: unknown[]) => unknown>(v: unknown, opts?: Opts): asserts v is T
  instanceOf<T>(v: unknown, ctor: new (...args: unknown[]) => T, opts?: Opts): asserts v is T
  // ── Equality
  equal<T>(actual: T, expected: T, opts?: Opts): void
  deepEqual<T>(actual: T, expected: T, opts?: Opts): void
  // ── Numerics
  positive(n: number, opts?: Opts): void
  negative(n: number, opts?: Opts): void
  zero(n: number, opts?: Opts): void
  greater(a: number, b: number, opts?: Opts): void
  greaterOrEqual(a: number, b: number, opts?: Opts): void
  less(a: number, b: number, opts?: Opts): void
  lessOrEqual(a: number, b: number, opts?: Opts): void
  withinRange(v: number, min: number, max: number, opts?: Opts): void
  inDelta(actual: number, expected: number, delta: number, opts?: Opts): void
  // ── Arrays
  len<T>(arr: T[], n: number, opts?: Opts): void
  longerThan<T>(arr: T[], n: number, opts?: Opts): void
  shorterThan<T>(arr: T[], n: number, opts?: Opts): void
  includes<T>(arr: T[], item: T, opts?: Opts): void
  all<T, U extends T>(arr: T[], predicate: ((v: T) => v is U) | ((v: T) => boolean), opts?: Opts): asserts arr is U[]
  any<T>(arr: T[], predicate: (v: T) => boolean, opts?: Opts): void
  none<T>(arr: T[], predicate: (v: T) => boolean, opts?: Opts): void
  one<T>(arr: T[], predicate: (v: T) => boolean, opts?: Opts): void
  count<T>(arr: T[], predicate: (v: T) => boolean, n: number, opts?: Opts): void
  containsAll<T>(arr: T[], items: T[], opts?: Opts): void
  containsNone<T>(arr: T[], items: T[], opts?: Opts): void
  elementsMatch<T>(a: T[], b: T[], opts?: Opts): void
  subset<T>(arr: T[], sub: T[], opts?: Opts): void
  unique<T>(arr: T[], opts?: Opts): void
  uniqueBy<T>(arr: T[], iteratee: _.ValueIteratee<T>, opts?: Opts): void
  increasing(arr: number[], opts?: Opts): void
  nonDecreasing(arr: number[], opts?: Opts): void
  sortedBy<T>(arr: T[], iteratee: _.ValueIteratee<T>, opts?: Opts): void
  first<T>(arr: T[], expected: T, opts?: Opts): void
  last<T>(arr: T[], expected: T, opts?: Opts): void
  sumBy<T>(arr: T[], iteratee: string | ((value: T) => number), expected: number, opts?: Opts): void
  noNils<T>(arr: (T | null | undefined)[], opts?: Opts): asserts arr is T[]
  flat(arr: unknown[], opts?: Opts): void
  allInstanceOf<T>(arr: unknown[], ctor: new (...args: unknown[]) => T, opts?: Opts): asserts arr is T[]
  zippedWith<A, B>(a: A[], b: B[], predicate: (a: A, b: B) => boolean, opts?: Opts): void
  groupedBy<T>(arr: T[], iteratee: _.ValueIteratee<T>, expectedGroups: string[], opts?: Opts): void
  partition<T>(arr: T[], predicate: (v: T) => boolean, expectedMatch: number, expectedRest: number, opts?: Opts): void
  // ── Objects
  hasKey<T extends object, K extends string>(obj: T, key: K, opts?: Opts): asserts obj is T & Record<K, unknown>
  hasKeys<T extends object, K extends string>(obj: T, keys: K[], opts?: Opts): asserts obj is T & Record<K, unknown>
  hasExactKeys<K extends string>(obj: object, keys: K[], opts?: Opts): asserts obj is Record<K, unknown>
  hasOnlyKeys(obj: object, allowed: string[], opts?: Opts): void
  hasValue<T extends object, K extends keyof T>(obj: T, key: K, expected: T[K], opts?: Opts): void
  containsSubset<T extends object>(obj: T, subset: Partial<T>, opts?: Opts): void
  allValuesMatch<T extends object>(obj: T, predicate: (v: T[keyof T], k: keyof T) => boolean, opts?: Opts): void
  noNilValues<T extends object>(obj: T, opts?: Opts): void
  dig<T>(obj: T, path: string | string[], expected: unknown, opts?: Opts): void
  // ── Functions
  returns<TArgs extends unknown[], TReturn>(fn: (...args: TArgs) => TReturn, args: TArgs, expected: TReturn, opts?: Opts): void
  pure<TArgs extends unknown[], TReturn>(fn: (...args: TArgs) => TReturn, args: TArgs, opts?: Opts): void
  idempotent<T>(fn: (v: T) => T, arg: T, opts?: Opts): void
  arity(fn: (...args: unknown[]) => unknown, n: number, opts?: Opts): void
  mapsDistinct<T, U>(fn: (v: T) => U, a: T, b: T, opts?: Opts): void
  homomorphic<T>(fn: (v: T) => T, combine: (a: T, b: T) => T, a: T, b: T, opts?: Opts): void
  // ── Negation
  not(fn: (...args: unknown[]) => void, ...args: unknown[]): void
}

/**
 * The main assertion namespace.
 * @namespace
 */
export const assert: Assert = {
  // ═══════════════════════════════════════════════════════════════════════════
  // EXISTENCE
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Asserts that a value is `null` or `undefined`.
   *
   * @param v    - The value to check.
   * @param opts - Optional message / context.
   *
   * @example
   * ```ts
   * assert.nil(response.error, "no error expected")
   * ```
   */
  nil(v: unknown, opts?: Opts): asserts v is null | undefined {
    if (isDisabled()) return
    if (_.isNil(v)) return
    const o = parseOpts(opts)
    fail({
      assertion: "nil",
      message: buildBlock({
        assertion: "nil",
        title: o.msg ?? "Expected null or undefined",
        rows: [
          { label: o.actual ?? "actual", value: fmtValue(v), indicator: color.removed("✗") },
          {
            label: "expected",
            value: color.added("null | undefined"),
            indicator: color.added("+"),
          },
        ],
        note: o.note,
      }),
      actual: v,
      expected: null,
    })
  },

  /**
   * Asserts that a value is **not** `null` or `undefined`.
   * Narrows the type to `NonNullable<T>` after the call.
   *
   * @param v    - The value to check.
   * @param opts - Optional message / context.
   *
   * @example
   * ```ts
   * assert.notNil(user, "user must exist")
   * user.name // TypeScript now knows user is not null/undefined
   * ```
   */
  notNil<T>(v: T | null | undefined, opts?: Opts): asserts v is NonNullable<T> {
    if (isDisabled()) return
    if (!_.isNil(v)) return
    const o = parseOpts(opts)
    fail({
      assertion: "notNil",
      message: buildBlock({
        assertion: "notNil",
        title: o.msg ?? "Unexpected null or undefined",
        rows: [
          { label: "received", value: fmtValue(v), indicator: color.removed("✗") },
          { label: "expected", value: color.added("non-null value"), indicator: color.added("+") },
        ],
        note: o.note,
      }),
      actual: v,
      expected: "non-null",
    })
  },

  /**
   * Asserts that a value is empty.
   * Uses `_.isEmpty`, which handles strings, arrays, objects, Map, and Set.
   *
   * @param v    - The value to check.
   * @param opts - Optional message / context.
   *
   * @example
   * ```ts
   * assert.empty(errors, "no errors expected")
   * ```
   */
  empty(v: unknown, opts?: Opts): void {
    if (isDisabled()) return
    if (_.isEmpty(v)) return
    const o = parseOpts(opts)
    fail({
      assertion: "empty",
      message: buildBlock({
        assertion: "empty",
        title: o.msg ?? "Expected empty value",
        rows: [{ label: "received", value: fmtValue(v), indicator: color.removed("✗") }],
        note: o.note,
      }),
      actual: v,
      expected: "empty",
    })
  },

  /**
   * Asserts that a value is **not** empty.
   * Uses `_.isEmpty`, which handles strings, arrays, objects, Map, and Set.
   *
   * @param v    - The value to check.
   * @param opts - Optional message / context.
   *
   * @example
   * ```ts
   * assert.notEmpty(users, "users list must not be empty")
   * ```
   */
  notEmpty<T>(v: T, opts?: Opts): asserts v is NonNullable<T> {
    if (isDisabled()) return
    if (!_.isEmpty(v as unknown)) return
    const o = parseOpts(opts)
    fail({
      assertion: "notEmpty",
      message: buildBlock({
        assertion: "notEmpty",
        title: o.msg ?? "Unexpected empty value",
        rows: [{ label: "received", value: fmtValue(v), indicator: color.removed("✗") }],
        note: o.note,
      }),
      actual: v,
      expected: "non-empty",
    })
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TYPE GUARDS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Asserts that `v` is a `string`. Narrows the type after the call.
   * @example `assert.string(name, "name must be a string")`
   */
  string(v: unknown, opts?: Opts): asserts v is string {
    if (isDisabled()) return
    if (_.isString(v)) return
    const o = parseOpts(opts)
    fail({
      assertion: "string",
      message: buildBlock({
        assertion: "string",
        title: o.msg ?? "Expected string",
        rows: [
          {
            label: "received",
            value: `${fmtValue(v)} ${color.label(`(${typeof v})`)}`,
            indicator: color.removed("✗"),
          },
        ],
        note: o.note,
      }),
      actual: v,
      expected: "string",
    })
  },

  /**
   * Asserts that `v` is a `number`. Narrows the type after the call.
   * @example `assert.number(price, "price must be a number")`
   */
  number(v: unknown, opts?: Opts): asserts v is number {
    if (isDisabled()) return
    if (_.isNumber(v)) return
    const o = parseOpts(opts)
    fail({
      assertion: "number",
      message: buildBlock({
        assertion: "number",
        title: o.msg ?? "Expected number",
        rows: [
          {
            label: "received",
            value: `${fmtValue(v)} ${color.label(`(${typeof v})`)}`,
            indicator: color.removed("✗"),
          },
        ],
        note: o.note,
      }),
      actual: v,
      expected: "number",
    })
  },

  /**
   * Asserts that `v` is a finite integer (no floats, no NaN, no Infinity).
   * @example `assert.integer(amountCents, "amount must be integer cents")`
   */
  integer(v: unknown, opts?: Opts): asserts v is number {
    if (isDisabled()) return
    if (_.isInteger(v)) return
    const o = parseOpts(opts)
    fail({
      assertion: "integer",
      message: buildBlock({
        assertion: "integer",
        title: o.msg ?? "Expected integer",
        rows: [{ label: "received", value: fmtValue(v), indicator: color.removed("✗") }],
        note: o.note,
      }),
      actual: v,
      expected: "integer",
    })
  },

  /**
   * Asserts that `v` is a finite number (excludes NaN and ±Infinity).
   * @example `assert.finite(ratio, "ratio must be finite")`
   */
  finite(v: unknown, opts?: Opts): asserts v is number {
    if (isDisabled()) return
    if (_.isFinite(v)) return
    const o = parseOpts(opts)
    fail({
      assertion: "finite",
      message: buildBlock({
        assertion: "finite",
        title: o.msg ?? "Expected finite number",
        rows: [{ label: "received", value: fmtValue(v), indicator: color.removed("✗") }],
        note: o.note,
      }),
      actual: v,
      expected: "finite number",
    })
  },

  /**
   * Asserts that `v` is a `boolean`. Narrows the type after the call.
   * @example `assert.boolean(flag, "flag must be boolean")`
   */
  boolean(v: unknown, opts?: Opts): asserts v is boolean {
    if (isDisabled()) return
    if (_.isBoolean(v)) return
    const o = parseOpts(opts)
    fail({
      assertion: "boolean",
      message: buildBlock({
        assertion: "boolean",
        title: o.msg ?? "Expected boolean",
        rows: [{ label: "received", value: fmtValue(v), indicator: color.removed("✗") }],
        note: o.note,
      }),
      actual: v,
      expected: "boolean",
    })
  },

  /**
   * Asserts that `v` is an array. Narrows the type to `T[]` after the call.
   *
   * @typeParam T - The expected element type (defaults to `unknown`).
   * @example `assert.array<User>(users, "users must be an array")`
   */
  array<T = unknown>(v: unknown, opts?: Opts): asserts v is T[] {
    if (isDisabled()) return
    if (_.isArray(v)) return
    const o = parseOpts(opts)
    fail({
      assertion: "array",
      message: buildBlock({
        assertion: "array",
        title: o.msg ?? "Expected array",
        rows: [
          {
            label: "received",
            value: `${fmtValue(v)} ${color.label(`(${typeof v})`)}`,
            indicator: color.removed("✗"),
          },
        ],
        note: o.note,
      }),
      actual: v,
      expected: "array",
    })
  },

  /**
   * Asserts that `v` is a plain object (not a class instance, not an array).
   * Narrows the type to `T` after the call.
   *
   * @typeParam T - The expected object type (defaults to `object`).
   * @example `assert.object<Config>(raw, "raw must be a plain object")`
   */
  object<T extends object = object>(v: unknown, opts?: Opts): asserts v is T {
    if (isDisabled()) return
    if (_.isPlainObject(v)) return
    const o = parseOpts(opts)
    fail({
      assertion: "object",
      message: buildBlock({
        assertion: "object",
        title: o.msg ?? "Expected plain object",
        rows: [
          {
            label: "received",
            value: `${fmtValue(v)} ${color.label(`(${typeof v})`)}`,
            indicator: color.removed("✗"),
          },
        ],
        note: o.note,
      }),
      actual: v,
      expected: "object",
    })
  },

  /**
   * Asserts that `v` is a function. Narrows the type to `T` after the call.
   * @example `assert.func(handler, "handler must be a function")`
   */
  func<T extends (...args: unknown[]) => unknown = (...args: unknown[]) => unknown>(
    v: unknown,
    opts?: Opts
  ): asserts v is T {
    if (isDisabled()) return
    if (_.isFunction(v)) return
    const o = parseOpts(opts)
    fail({
      assertion: "func",
      message: buildBlock({
        assertion: "func",
        title: o.msg ?? "Expected function",
        rows: [
          {
            label: "received",
            value: `${fmtValue(v)} ${color.label(`(${typeof v})`)}`,
            indicator: color.removed("✗"),
          },
        ],
        note: o.note,
      }),
      actual: v,
      expected: "function",
    })
  },

  /**
   * Asserts that `v` is an instance of the given constructor.
   * Narrows the type to `T` after the call.
   *
   * @param v    - The value to check.
   * @param ctor - The constructor to test against.
   * @param opts - Optional message / context.
   *
   * @example
   * ```ts
   * assert.instanceOf(err, ValidationError, "must be a ValidationError")
   * err.field // TypeScript knows err is ValidationError
   * ```
   */
  instanceOf<T>(v: unknown, ctor: new (...args: unknown[]) => T, opts?: Opts): asserts v is T {
    if (isDisabled()) return
    if (v instanceof ctor) return
    const o = parseOpts(opts)
    fail({
      assertion: "instanceOf",
      message: buildBlock({
        assertion: "instanceOf",
        title: o.msg ?? `Expected instance of ${ctor.name}`,
        rows: [
          { label: "expected", value: color.added(ctor.name), indicator: color.added("+") },
          { label: "received", value: color.removed(typeof v), indicator: color.removed("✗") },
        ],
        note: o.note,
      }),
      actual: v,
      expected: ctor.name,
    })
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // EQUALITY
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Asserts strict equality (`===`).
   *
   * @param actual   - The value under test.
   * @param expected - The expected value.
   * @param opts     - Optional message / context.
   *
   * @example
   * ```ts
   * assert.equal(order.status, "pending", {
   *   msg:    "order must be pending before payment",
   *   actual: "order.status",
   * })
   * ```
   */
  equal<T>(actual: T, expected: T, opts?: Opts): void {
    if (isDisabled()) return
    if (actual === expected) return
    const o = parseOpts(opts)
    fail({
      assertion: "equal",
      message: buildBlock({
        assertion: "equal",
        title: o.msg ?? "Values are not strictly equal",
        rows: [
          { label: "expected", value: fmtValue(expected), indicator: color.added("+") },
          { label: o.actual ?? "actual", value: fmtValue(actual), indicator: color.removed("✗") },
        ],
        note: o.note,
      }),
      actual,
      expected,
    })
  },

  /**
   * Asserts deep equality using `_.isEqual`.
   * Works on objects, arrays, and nested structures.
   *
   * @param actual   - The value under test.
   * @param expected - The expected value.
   * @param opts     - Optional message / context.
   *
   * @example
   * ```ts
   * assert.deepEqual(parsed, { id: 1, name: "Alice" }, "parsed user mismatch")
   * ```
   */
  deepEqual<T>(actual: T, expected: T, opts?: Opts): void {
    if (isDisabled()) return
    if (_.isEqual(actual, expected)) return
    const o = parseOpts(opts)
    fail({
      assertion: "deepEqual",
      message: buildBlock({
        assertion: "deepEqual",
        title: o.msg ?? "Deep equality failed",
        diff: { actual, expected },
        note: o.note,
      }),
      actual,
      expected,
    })
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // NUMERICS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Asserts that `n` is a positive finite number (> 0).
   * @example `assert.positive(amountCents, "amount must be positive")`
   */
  positive(n: number, opts?: Opts): void {
    if (isDisabled()) return
    if (_.isFinite(n) && n > 0) return
    const o = parseOpts(opts)
    fail({
      assertion: "positive",
      message: buildBlock({
        assertion: "positive",
        title: o.msg ?? "Expected positive number",
        rows: [
          { label: "expected", value: color.added("> 0"), indicator: color.added("+") },
          { label: o.actual ?? "actual", value: fmtValue(n), indicator: color.removed("✗") },
        ],
        note: o.note,
      }),
      actual: n,
      expected: "> 0",
    })
  },

  /**
   * Asserts that `n` is a negative finite number (< 0).
   * @example `assert.negative(delta, "delta must be negative")`
   */
  negative(n: number, opts?: Opts): void {
    if (isDisabled()) return
    if (_.isFinite(n) && n < 0) return
    const o = parseOpts(opts)
    fail({
      assertion: "negative",
      message: buildBlock({
        assertion: "negative",
        title: o.msg ?? "Expected negative number",
        rows: [
          { label: "expected", value: color.added("< 0"), indicator: color.added("+") },
          { label: o.actual ?? "actual", value: fmtValue(n), indicator: color.removed("✗") },
        ],
        note: o.note,
      }),
      actual: n,
      expected: "< 0",
    })
  },

  /**
   * Asserts that `n` is exactly `0`.
   * @example `assert.zero(remainder, "no remainder expected")`
   */
  zero(n: number, opts?: Opts): void {
    if (isDisabled()) return
    if (n === 0) return
    const o = parseOpts(opts)
    fail({
      assertion: "zero",
      message: buildBlock({
        assertion: "zero",
        title: o.msg ?? "Expected zero",
        rows: [
          { label: "expected", value: color.added("0"), indicator: color.added("+") },
          { label: o.actual ?? "actual", value: fmtValue(n), indicator: color.removed("✗") },
        ],
        note: o.note,
      }),
      actual: n,
      expected: 0,
    })
  },

  /**
   * Asserts that `a > b`.
   * @example `assert.greater(newVersion, currentVersion, "version must increase")`
   */
  greater(a: number, b: number, opts?: Opts): void {
    if (isDisabled()) return
    if (a > b) return
    const o = parseOpts(opts)
    fail({
      assertion: "greater",
      message: buildBlock({
        assertion: "greater",
        title: o.msg ?? "Expected greater value",
        rows: [
          {
            label: "expected",
            value: color.added(`> ${fmtValue(b)}`),
            indicator: color.added("+"),
          },
          { label: o.actual ?? "actual", value: fmtValue(a), indicator: color.removed("✗") },
        ],
        note: o.note,
      }),
      actual: a,
      expected: `> ${b}`,
    })
  },

  /**
   * Asserts that `a >= b`.
   * @example `assert.greaterOrEqual(balance, amount, "insufficient funds")`
   */
  greaterOrEqual(a: number, b: number, opts?: Opts): void {
    if (isDisabled()) return
    if (a >= b) return
    const o = parseOpts(opts)
    fail({
      assertion: "greaterOrEqual",
      message: buildBlock({
        assertion: "greaterOrEqual",
        title: o.msg ?? "Value below minimum",
        rows: [
          {
            label: "minimum",
            value: color.added(`>= ${fmtValue(b)}`),
            indicator: color.added("+"),
          },
          { label: o.actual ?? "actual", value: fmtValue(a), indicator: color.removed("✗") },
          { label: "shortfall", value: fmtValue(b - a) },
        ],
        note: o.note,
      }),
      actual: a,
      expected: `>= ${b}`,
    })
  },

  /**
   * Asserts that `a < b`.
   * @example `assert.less(latencyMs, 200, "latency too high")`
   */
  less(a: number, b: number, opts?: Opts): void {
    if (isDisabled()) return
    if (a < b) return
    const o = parseOpts(opts)
    fail({
      assertion: "less",
      message: buildBlock({
        assertion: "less",
        title: o.msg ?? "Expected smaller value",
        rows: [
          {
            label: "expected",
            value: color.added(`< ${fmtValue(b)}`),
            indicator: color.added("+"),
          },
          { label: o.actual ?? "actual", value: fmtValue(a), indicator: color.removed("✗") },
        ],
        note: o.note,
      }),
      actual: a,
      expected: `< ${b}`,
    })
  },

  /**
   * Asserts that `a <= b`.
   * @example `assert.lessOrEqual(pageSize, 100, "page size exceeds limit")`
   */
  lessOrEqual(a: number, b: number, opts?: Opts): void {
    if (isDisabled()) return
    if (a <= b) return
    const o = parseOpts(opts)
    fail({
      assertion: "lessOrEqual",
      message: buildBlock({
        assertion: "lessOrEqual",
        title: o.msg ?? "Value above maximum",
        rows: [
          {
            label: "maximum",
            value: color.added(`<= ${fmtValue(b)}`),
            indicator: color.added("+"),
          },
          { label: o.actual ?? "actual", value: fmtValue(a), indicator: color.removed("✗") },
        ],
        note: o.note,
      }),
      actual: a,
      expected: `<= ${b}`,
    })
  },

  /**
   * Asserts that `v` is within the closed range `[min, max]`.
   *
   * @param v    - The value to check.
   * @param min  - Inclusive lower bound.
   * @param max  - Inclusive upper bound.
   * @param opts - Optional message / context.
   *
   * @example
   * ```ts
   * assert.withinRange(percentage, 0, 100, "percentage must be 0–100")
   * ```
   */
  withinRange(v: number, min: number, max: number, opts?: Opts): void {
    if (isDisabled()) return
    if (v >= min && v <= max) return
    const o = parseOpts(opts)
    fail({
      assertion: "withinRange",
      message: buildBlock({
        assertion: "withinRange",
        title: o.msg ?? "Value out of range",
        rows: [
          {
            label: "range",
            value: `${fmtValue(min)} → ${fmtValue(max)}`,
            indicator: color.added("+"),
          },
          { label: o.actual ?? "actual", value: fmtValue(v), indicator: color.removed("✗") },
          { label: "distance", value: fmtValue(v < min ? min - v : v - max) },
        ],
        note: o.note,
      }),
      actual: v,
      expected: `[${min}, ${max}]`,
    })
  },

  /**
   * Asserts that `|actual - expected| <= delta`.
   * Useful for floating-point comparisons and timing tolerances.
   *
   * @example
   * ```ts
   * assert.inDelta(computed, 1.333, 0.001, "floating point result out of tolerance")
   * ```
   */
  inDelta(actual: number, expected: number, delta: number, opts?: Opts): void {
    if (isDisabled()) return
    if (Math.abs(actual - expected) <= delta) return
    const o = parseOpts(opts)
    const distance = Math.abs(actual - expected)
    fail({
      assertion: "inDelta",
      message: buildBlock({
        assertion: "inDelta",
        title: o.msg ?? "Value outside delta tolerance",
        rows: [
          { label: "expected", value: fmtValue(expected), indicator: color.added("+") },
          { label: "actual", value: fmtValue(actual), indicator: color.removed("✗") },
          { label: "delta", value: color.added(`± ${delta}`) },
          { label: "distance", value: color.removed(String(distance)) },
          { label: "excess", value: fmtValue(distance - delta) },
        ],
        note: o.note,
      }),
      actual,
      expected,
    })
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ARRAYS — inspired by Ruby Array + Enumerable
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Asserts that the array has exactly `n` elements.
   * @example `assert.len(users, 10, "expected 10 users")`
   */
  len<T>(arr: T[], n: number, opts?: Opts): void {
    if (isDisabled()) return
    const size = _.size(arr)
    if (size === n) return
    const o = parseOpts(opts)
    fail({
      assertion: "len",
      message: buildBlock({
        assertion: "len",
        title: o.msg ?? "Unexpected array length",
        rows: [
          { label: "expected", value: fmtValue(n), indicator: color.added("+") },
          { label: "actual", value: color.removed(String(size)), indicator: color.removed("✗") },
        ],
        note: o.note,
      }),
      actual: size,
      expected: n,
    })
  },

  /**
   * Asserts that the array has more than `n` elements.
   * @example `assert.longerThan(results, 0, "must have at least one result")`
   */
  longerThan<T>(arr: T[], n: number, opts?: Opts): void {
    if (isDisabled()) return
    const size = _.size(arr)
    if (size > n) return
    const o = parseOpts(opts)
    fail({
      assertion: "longerThan",
      message: buildBlock({
        assertion: "longerThan",
        title: o.msg ?? "Array too short",
        rows: [
          { label: "expected", value: color.added(`> ${n}`), indicator: color.added("+") },
          { label: "actual", value: fmtValue(size), indicator: color.removed("✗") },
        ],
        note: o.note,
      }),
      actual: size,
      expected: `> ${n}`,
    })
  },

  /**
   * Asserts that the array has fewer than `n` elements.
   * @example `assert.shorterThan(queue, 1000, "queue overflow")`
   */
  shorterThan<T>(arr: T[], n: number, opts?: Opts): void {
    if (isDisabled()) return
    const size = _.size(arr)
    if (size < n) return
    const o = parseOpts(opts)
    fail({
      assertion: "shorterThan",
      message: buildBlock({
        assertion: "shorterThan",
        title: o.msg ?? "Array too long",
        rows: [
          { label: "expected", value: color.added(`< ${n}`), indicator: color.added("+") },
          { label: "actual", value: fmtValue(size), indicator: color.removed("✗") },
        ],
        note: o.note,
      }),
      actual: size,
      expected: `< ${n}`,
    })
  },

  /**
   * Asserts that the array contains the given item (using `_.includes`).
   * @example `assert.includes(roles, "admin", "admin role required")`
   */
  includes<T>(arr: T[], item: T, opts?: Opts): void {
    if (isDisabled()) return
    if (_.includes(arr, item)) return
    const o = parseOpts(opts)
    fail({
      assertion: "includes",
      message: buildBlock({
        assertion: "includes",
        title: o.msg ?? "Item not found in array",
        rows: [
          { label: "item", value: fmtValue(item), indicator: color.removed("✗") },
          { label: "array", value: fmtValue(arr) },
        ],
        note: o.note,
      }),
      actual: arr,
      expected: item,
    })
  },

  /**
   * Asserts that every element satisfies the predicate — Ruby `all?`.
   *
   * @remarks
   * When the predicate is a type guard `(v: T) => v is U`, the entire
   * array is narrowed to `U[]` after the call.
   *
   * @example
   * ```ts
   * assert.all(orders, o => o.status === "paid", "all orders must be paid")
   *
   * // With type guard — narrows array type:
   * assert.all(items, (v): v is string => typeof v === "string")
   * items // string[]
   * ```
   */
  all<T, U extends T>(
    arr: T[],
    predicate: ((v: T) => v is U) | ((v: T) => boolean),
    opts?: Opts
  ): asserts arr is U[] {
    if (isDisabled()) return
    const index = arr.findIndex((v) => !predicate(v))
    if (index === -1) return
    const o = parseOpts(opts)
    fail({
      assertion: "all",
      message: buildBlock({
        assertion: "all",
        title: o.msg ?? "Not all elements match predicate",
        rows: [
          { label: "index", value: color.index(String(index)), indicator: color.removed("✗") },
          { label: "value", value: fmtValue(arr[index]) },
        ],
        extras: { "array size": arr.length },
        note: o.note,
      }),
      actual: arr[index],
      expected: "match predicate",
    })
  },

  /**
   * Asserts that at least one element satisfies the predicate — Ruby `any?`.
   * @example `assert.any(events, e => e.type === "purchase", "need a purchase event")`
   */
  any<T>(arr: T[], predicate: (v: T) => boolean, opts?: Opts): void {
    if (isDisabled()) return
    if (arr.some(predicate)) return
    const o = parseOpts(opts)
    fail({
      assertion: "any",
      message: buildBlock({
        assertion: "any",
        title: o.msg ?? "No element matched predicate",
        rows: [{ label: "array", value: fmtValue(arr) }],
        extras: { size: arr.length },
        note: o.note,
      }),
      actual: arr,
      expected: "at least one match",
    })
  },

  /**
   * Asserts that no element satisfies the predicate — Ruby `none?`.
   * @example `assert.none(users, u => u.banned && u.active, "banned users must be inactive")`
   */
  none<T>(arr: T[], predicate: (v: T) => boolean, opts?: Opts): void {
    if (isDisabled()) return
    const bad = arr.find((v) => predicate(v))
    if (bad === undefined) return
    const o = parseOpts(opts)
    fail({
      assertion: "none",
      message: buildBlock({
        assertion: "none",
        title: o.msg ?? "Element matched forbidden predicate",
        rows: [{ label: "value", value: fmtValue(bad), indicator: color.removed("✗") }],
        extras: { index: arr.indexOf(bad) },
        note: o.note,
      }),
      actual: bad,
      expected: "no match",
    })
  },

  /**
   * Asserts that exactly one element satisfies the predicate — Ruby `one?`.
   * @example `assert.one(events, e => e.type === "checkout", "exactly one checkout expected")`
   */
  one<T>(arr: T[], predicate: (v: T) => boolean, opts?: Opts): void {
    if (isDisabled()) return
    const count = arr.filter(predicate).length
    if (count === 1) return
    const o = parseOpts(opts)
    fail({
      assertion: "one",
      message: buildBlock({
        assertion: "one",
        title: o.msg ?? "Expected exactly one match",
        rows: [
          { label: "expected", value: color.added("1"), indicator: color.added("+") },
          { label: "matches", value: color.removed(String(count)), indicator: color.removed("✗") },
        ],
        note: o.note,
      }),
      actual: count,
      expected: 1,
    })
  },

  /**
   * Asserts that exactly `n` elements satisfy the predicate — Ruby `count { }`.
   * @example `assert.count(transactions, t => t.amount > 1000, 3, "expected 3 large transactions")`
   */
  count<T>(arr: T[], predicate: (v: T) => boolean, n: number, opts?: Opts): void {
    if (isDisabled()) return
    const count = arr.filter(predicate).length
    if (count === n) return
    const o = parseOpts(opts)
    fail({
      assertion: "count",
      message: buildBlock({
        assertion: "count",
        title: o.msg ?? "Unexpected predicate count",
        rows: [
          { label: "expected", value: fmtValue(n), indicator: color.added("+") },
          { label: "actual", value: color.removed(String(count)), indicator: color.removed("✗") },
        ],
        note: o.note,
      }),
      actual: count,
      expected: n,
    })
  },

  /**
   * Asserts that all items in `items` are present in `arr`.
   * @example `assert.containsAll(permissions, required, "missing required permissions")`
   */
  containsAll<T>(arr: T[], items: T[], opts?: Opts): void {
    if (isDisabled()) return
    const missing = _.difference(items, arr)
    if (!missing.length) return
    const o = parseOpts(opts)
    fail({
      assertion: "containsAll",
      message: buildBlock({
        assertion: "containsAll",
        title: o.msg ?? "Missing required elements",
        rows: missing.map((m) => ({
          label: "missing",
          value: fmtValue(m),
          indicator: color.removed("✗"),
        })),
        note: o.note,
      }),
      actual: arr,
      expected: items,
    })
  },

  /**
   * Asserts that none of `items` are present in `arr`.
   * @example `assert.containsNone(errors, fatalErrors, "fatal error occurred")`
   */
  containsNone<T>(arr: T[], items: T[], opts?: Opts): void {
    if (isDisabled()) return
    const found = _.intersection(arr, items)
    if (!found.length) return
    const o = parseOpts(opts)
    fail({
      assertion: "containsNone",
      message: buildBlock({
        assertion: "containsNone",
        title: o.msg ?? "Forbidden elements found",
        rows: found.map((f) => ({
          label: "found",
          value: fmtValue(f),
          indicator: color.removed("✗"),
        })),
        note: o.note,
      }),
      actual: found,
      expected: "none present",
    })
  },

  /**
   * Asserts that the two arrays have the same elements regardless of order.
   * Uses `_.sortBy` for a deterministic comparison (works with objects).
   * @example `assert.elementsMatch(result, expected, "wrong set of ids")`
   */
  elementsMatch<T>(a: T[], b: T[], opts?: Opts): void {
    if (isDisabled()) return
    if (_.isEqual(_.sortBy(a), _.sortBy(b))) return
    const o = parseOpts(opts)
    const only_a = _.differenceWith(a, b, _.isEqual)
    const only_b = _.differenceWith(b, a, _.isEqual)
    fail({
      assertion: "elementsMatch",
      message: buildBlock({
        assertion: "elementsMatch",
        title: o.msg ?? "Arrays do not contain the same elements",
        rows: [
          ...only_a.map((v) => ({
            label: "only in a",
            value: fmtValue(v),
            indicator: color.removed("-"),
          })),
          ...only_b.map((v) => ({
            label: "only in b",
            value: fmtValue(v),
            indicator: color.added("+"),
          })),
        ],
        note: o.note,
      }),
      actual: a,
      expected: b,
    })
  },

  /**
   * Asserts that all elements of `sub` are present in `arr`.
   * @example `assert.subset(arr, required, "some required elements are missing")`
   */
  subset<T>(arr: T[], sub: T[], opts?: Opts): void {
    if (isDisabled()) return
    const missing = _.difference(sub, arr)
    if (!missing.length) return
    const o = parseOpts(opts)
    fail({
      assertion: "subset",
      message: buildBlock({
        assertion: "subset",
        title: o.msg ?? "Subset check failed",
        rows: missing.map((m) => ({
          label: "missing",
          value: fmtValue(m),
          indicator: color.removed("✗"),
        })),
        note: o.note,
      }),
      actual: arr,
      expected: sub,
    })
  },

  /**
   * Asserts that all elements are strictly unique (`indexOf` comparison).
   * @example `assert.unique(ids, "duplicate IDs detected")`
   */
  unique<T>(arr: T[], opts?: Opts): void {
    if (isDisabled()) return
    const dupes = arr.filter((v, i) => arr.indexOf(v) !== i)
    if (!dupes.length) return
    const o = parseOpts(opts)
    fail({
      assertion: "unique",
      message: buildBlock({
        assertion: "unique",
        title: o.msg ?? "Duplicate elements found",
        rows: _.uniq(dupes).map((d) => ({
          label: "duplicate",
          value: fmtValue(d),
          indicator: color.removed("✗"),
        })),
        extras: { "total duplicates": dupes.length },
        note: o.note,
      }),
      actual: dupes,
      expected: "unique",
    })
  },

  /**
   * Asserts that all elements are unique when mapped through `iteratee`.
   * Equivalent to Ruby `arr.uniq { |x| x.key }.length == arr.length`.
   * @example `assert.uniqueBy(users, "email", "duplicate emails")`
   */
  uniqueBy<T>(arr: T[], iteratee: _.ValueIteratee<T>, opts?: Opts): void {
    if (isDisabled()) return
    const fn = _.iteratee(iteratee) as (v: T) => unknown
    const vals = arr.map(fn)
    const dupes = vals.filter((v, i) => vals.indexOf(v) !== i)
    if (!dupes.length) return
    const o = parseOpts(opts)
    fail({
      assertion: "uniqueBy",
      message: buildBlock({
        assertion: "uniqueBy",
        title: o.msg ?? "Duplicate values for iteratee",
        rows: _.uniq(dupes).map((d) => ({
          label: "duplicate",
          value: fmtValue(d),
          indicator: color.removed("✗"),
        })),
        note: o.note,
      }),
      actual: dupes,
      expected: "unique",
    })
  },

  /**
   * Asserts that numeric array elements are strictly increasing.
   * @example `assert.increasing(versions, "versions must increase")`
   */
  increasing(arr: number[], opts?: Opts): void {
    if (isDisabled()) return
    const i = arr.findIndex((v, i) => i > 0 && v <= arr[i - 1]!)
    if (i === -1) return
    const o = parseOpts(opts)
    fail({
      assertion: "increasing",
      message: buildBlock({
        assertion: "increasing",
        title: o.msg ?? "Array is not strictly increasing",
        rows: [
          { label: `[${i - 1}]`, value: fmtValue(arr[i - 1]) },
          { label: `[${i}]`, value: fmtValue(arr[i]), indicator: color.removed("✗") },
        ],
        note: o.note,
      }),
      actual: arr[i],
      expected: `> ${arr[i - 1]}`,
    })
  },

  /**
   * Asserts that numeric array elements are non-decreasing (allows equal values).
   * @example `assert.nonDecreasing(scores, "scores must not decrease")`
   */
  nonDecreasing(arr: number[], opts?: Opts): void {
    if (isDisabled()) return
    const i = arr.findIndex((v, i) => i > 0 && v < arr[i - 1]!)
    if (i === -1) return
    const o = parseOpts(opts)
    fail({
      assertion: "nonDecreasing",
      message: buildBlock({
        assertion: "nonDecreasing",
        title: o.msg ?? "Array is not non-decreasing",
        rows: [
          { label: `[${i - 1}]`, value: fmtValue(arr[i - 1]) },
          { label: `[${i}]`, value: fmtValue(arr[i]), indicator: color.removed("✗") },
        ],
        note: o.note,
      }),
      actual: arr[i],
      expected: `>= ${arr[i - 1]}`,
    })
  },

  /**
   * Asserts that the array is sorted by the given iteratee — Ruby `sort_by`.
   * @example `assert.sortedBy(events, "timestamp", "events must be chronological")`
   */
  sortedBy<T>(arr: T[], iteratee: _.ValueIteratee<T>, opts?: Opts): void {
    if (isDisabled()) return
    if (_.isEqual(arr, _.sortBy(arr, iteratee))) return
    const o = parseOpts(opts)
    fail({
      assertion: "sortedBy",
      message: buildBlock({
        assertion: "sortedBy",
        title: o.msg ?? "Array is not sorted",
        rows: [{ label: "iteratee", value: fmtValue(iteratee) }],
        note: o.note,
      }),
      actual: arr,
      expected: "sorted",
    })
  },

  /**
   * Asserts that the first element equals `expected` — Ruby `arr.first`.
   * @example `assert.first(sorted, lowestId, "first element must be the lowest id")`
   */
  first<T>(arr: T[], expected: T, opts?: Opts): void {
    if (isDisabled()) return
    if (_.isEqual(_.first(arr), expected)) return
    const o = parseOpts(opts)
    fail({
      assertion: "first",
      message: buildBlock({
        assertion: "first",
        title: o.msg ?? "Unexpected first element",
        rows: [
          { label: "expected", value: fmtValue(expected), indicator: color.added("+") },
          { label: "actual", value: fmtValue(_.first(arr)), indicator: color.removed("✗") },
        ],
        note: o.note,
      }),
      actual: _.first(arr),
      expected,
    })
  },

  /**
   * Asserts that the last element equals `expected` — Ruby `arr.last`.
   * @example `assert.last(pipeline, finalStep, "pipeline must end with finalStep")`
   */
  last<T>(arr: T[], expected: T, opts?: Opts): void {
    if (isDisabled()) return
    if (_.isEqual(_.last(arr), expected)) return
    const o = parseOpts(opts)
    fail({
      assertion: "last",
      message: buildBlock({
        assertion: "last",
        title: o.msg ?? "Unexpected last element",
        rows: [
          { label: "expected", value: fmtValue(expected), indicator: color.added("+") },
          { label: "actual", value: fmtValue(_.last(arr)), indicator: color.removed("✗") },
        ],
        note: o.note,
      }),
      actual: _.last(arr),
      expected,
    })
  },

  /**
   * Asserts that `_.sumBy(arr, iteratee)` equals `expected` — Ruby `arr.sum`.
   * @example `assert.sumBy(lineItems, "totalCents", invoiceTotal, "line items must match invoice")`
   */
  sumBy<T>(
    arr: T[],
    iteratee: string | ((value: T) => number),
    expected: number,
    opts?: Opts
  ): void {
    if (isDisabled()) return
    const actual = _.sumBy(arr, iteratee)
    if (actual === expected) return
    const o = parseOpts(opts)
    fail({
      assertion: "sumBy",
      message: buildBlock({
        assertion: "sumBy",
        title: o.msg ?? "Sum mismatch",
        rows: [
          { label: "expected", value: fmtValue(expected), indicator: color.added("+") },
          { label: "actual", value: fmtValue(actual), indicator: color.removed("✗") },
          { label: "difference", value: fmtValue(actual - expected) },
        ],
        note: o.note,
      }),
      actual,
      expected,
    })
  },

  /**
   * Asserts that the array contains no `null` or `undefined` values.
   * Narrows the type to `NonNullable<T>[]` after the call.
   * @example `assert.noNils(records, "records must not contain null entries")`
   */
  noNils<T>(arr: (T | null | undefined)[], opts?: Opts): asserts arr is T[] {
    if (isDisabled()) return
    const i = arr.findIndex(_.isNil)
    if (i === -1) return
    const o = parseOpts(opts)
    fail({
      assertion: "noNils",
      message: buildBlock({
        assertion: "noNils",
        title: o.msg ?? "Null or undefined element found",
        rows: [{ label: `index [${i}]`, value: fmtValue(arr[i]), indicator: color.removed("✗") }],
        note: o.note,
      }),
      actual: arr[i],
      expected: "non-null",
    })
  },

  /**
   * Asserts that the array has no nesting (all elements are non-array).
   * @example `assert.flat(tags, "tags array must be flat")`
   */
  flat(arr: unknown[], opts?: Opts): void {
    if (isDisabled()) return
    if (_.isEqual(arr, arr.flat(Infinity))) return
    const o = parseOpts(opts)
    fail({
      assertion: "flat",
      message: buildBlock({
        assertion: "flat",
        title: o.msg ?? "Array is nested",
        rows: [{ label: "received", value: fmtValue(arr) }],
        note: o.note,
      }),
      actual: arr,
      expected: "flat array",
    })
  },

  /**
   * Asserts that all elements are instances of the given constructor.
   * Narrows the type to `T[]` after the call.
   * @example `assert.allInstanceOf(events, DomainEvent, "all events must be DomainEvent")`
   */
  allInstanceOf<T>(
    arr: unknown[],
    ctor: new (...args: unknown[]) => T,
    opts?: Opts
  ): asserts arr is T[] {
    if (isDisabled()) return
    const bad = arr.find((v) => !(v instanceof ctor))
    if (bad === undefined) return
    const o = parseOpts(opts)
    fail({
      assertion: "allInstanceOf",
      message: buildBlock({
        assertion: "allInstanceOf",
        title: o.msg ?? `Expected all elements to be ${ctor.name}`,
        rows: [{ label: "found", value: fmtValue(bad), indicator: color.removed("✗") }],
        extras: { index: arr.indexOf(bad) },
        note: o.note,
      }),
      actual: bad,
      expected: ctor.name,
    })
  },

  /**
   * Asserts that two arrays, when zipped together, satisfy the predicate
   * for every pair — Ruby `arr.zip(other).all? { |a,b| ... }`.
   * @example `assert.zippedWith(inputs, outputs, (i, o) => o.id === i.id, "ids must match")`
   */
  zippedWith<A, B>(a: A[], b: B[], predicate: (a: A, b: B) => boolean, opts?: Opts): void {
    if (isDisabled()) return
    const bad = _.zip(a, b).find(([x, y]) => !predicate(x as A, y as B))
    if (!bad) return
    const o = parseOpts(opts)
    fail({
      assertion: "zippedWith",
      message: buildBlock({
        assertion: "zippedWith",
        title: o.msg ?? "Zipped pair failed predicate",
        rows: [{ label: "pair", value: fmtValue(bad), indicator: color.removed("✗") }],
        note: o.note,
      }),
      actual: bad,
      expected: "pair to match",
    })
  },

  /**
   * Asserts the expected group keys produced by `_.groupBy`.
   * @example `assert.groupedBy(events, "type", ["click","view","purchase"])`
   */
  groupedBy<T>(
    arr: T[],
    iteratee: _.ValueIteratee<T>,
    expectedGroups: string[],
    opts?: Opts
  ): void {
    if (isDisabled()) return
    const groups = _.groupBy(arr, iteratee)
    const missing = _.difference(expectedGroups, Object.keys(groups))
    const extra = _.difference(Object.keys(groups), expectedGroups)
    if (!missing.length && !extra.length) return
    const o = parseOpts(opts)
    fail({
      assertion: "groupedBy",
      message: buildBlock({
        assertion: "groupedBy",
        title: o.msg ?? "Unexpected group keys",
        rows: [
          ...missing.map((k) => ({
            label: k,
            value: color.added("missing"),
            indicator: color.added("+"),
          })),
          ...extra.map((k) => ({
            label: k,
            value: color.removed("unexpected"),
            indicator: color.removed("-"),
          })),
        ],
        note: o.note,
      }),
      actual: Object.keys(groups),
      expected: expectedGroups,
    })
  },

  /**
   * Asserts the sizes of both partitions produced by `_.partition`.
   * @example `assert.partition(jobs, j => j.done, 8, 2, "8 done, 2 pending")`
   */
  partition<T>(
    arr: T[],
    predicate: (v: T) => boolean,
    expectedMatch: number,
    expectedRest: number,
    opts?: Opts
  ): void {
    if (isDisabled()) return
    const [matched, rest] = _.partition(arr, predicate)
    if (matched.length === expectedMatch && rest.length === expectedRest) return
    const o = parseOpts(opts)
    fail({
      assertion: "partition",
      message: buildBlock({
        assertion: "partition",
        title: o.msg ?? "Partition sizes mismatch",
        rows: [
          { label: "match expected", value: fmtValue(expectedMatch), indicator: color.added("+") },
          { label: "match actual", value: fmtValue(matched.length), indicator: color.removed("✗") },
          { label: "rest expected", value: fmtValue(expectedRest), indicator: color.added("+") },
          { label: "rest actual", value: fmtValue(rest.length), indicator: color.removed("✗") },
        ],
        note: o.note,
      }),
      actual: [matched.length, rest.length],
      expected: [expectedMatch, expectedRest],
    })
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // OBJECTS — inspired by Ruby Hash
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Asserts that `obj` has the given key — Ruby `hash.key?(k)`.
   * Narrows the type to `T & Record<K, unknown>` after the call.
   * @example `assert.hasKey(config, "database", "database key required")`
   */
  hasKey<T extends object, K extends string>(
    obj: T,
    key: K,
    opts?: Opts
  ): asserts obj is T & Record<K, unknown> {
    if (isDisabled()) return
    if (_.has(obj, key)) return
    const o = parseOpts(opts)
    fail({
      assertion: "hasKey",
      message: buildBlock({
        assertion: "hasKey",
        title: o.msg ?? `Missing key "${key}"`,
        rows: [
          { label: "key", value: color.removed(key), indicator: color.removed("✗") },
          { label: "available", value: fmtValue(Object.keys(obj)) },
        ],
        note: o.note,
      }),
      actual: obj,
      expected: key,
    })
  },

  /**
   * Asserts that `obj` has all the given keys.
   * Narrows the type to `T & Record<K, unknown>` after the call.
   * @example `assert.hasKeys(config, ["host","port","database"])`
   */
  hasKeys<T extends object, K extends string>(
    obj: T,
    keys: K[],
    opts?: Opts
  ): asserts obj is T & Record<K, unknown> {
    if (isDisabled()) return
    const missing = keys.filter((k) => !_.has(obj, k))
    if (!missing.length) return
    const o = parseOpts(opts)
    fail({
      assertion: "hasKeys",
      message: buildBlock({
        assertion: "hasKeys",
        title: o.msg ?? "Missing required keys",
        rows: missing.map((k) => ({
          label: "missing",
          value: color.removed(k),
          indicator: color.removed("✗"),
        })),
        note: o.note,
      }),
      actual: obj,
      expected: keys,
    })
  },

  /**
   * Asserts that `obj` has **exactly** the given keys — no more, no less.
   * Narrows the type to `Record<K, unknown>` after the call.
   * @example `assert.hasExactKeys(payload, ["id","name","email"])`
   */
  hasExactKeys<K extends string>(
    obj: object,
    keys: K[],
    opts?: Opts
  ): asserts obj is Record<K, unknown> {
    if (isDisabled()) return
    const actual = _.keys(obj)
    const missing = _.difference(keys, actual)
    const extra = _.difference(actual, keys)
    if (!missing.length && !extra.length) return
    const o = parseOpts(opts)
    fail({
      assertion: "hasExactKeys",
      message: buildBlock({
        assertion: "hasExactKeys",
        title: o.msg ?? "Unexpected object shape",
        rows: [
          ...missing.map((k) => ({
            label: k,
            value: color.added("missing"),
            indicator: color.added("+"),
          })),
          ...extra.map((k) => ({
            label: k,
            value: color.removed("unexpected"),
            indicator: color.removed("-"),
          })),
        ],
        extras: { "expected keys": keys.length, "actual keys": actual.length },
        note: o.note,
      }),
      actual,
      expected: keys,
    })
  },

  /**
   * Asserts that `obj` contains only keys from the `allowed` list.
   * @example `assert.hasOnlyKeys(patch, ["name","email"], "patch contains immutable fields")`
   */
  hasOnlyKeys(obj: object, allowed: string[], opts?: Opts): void {
    if (isDisabled()) return
    const extra = _.difference(_.keys(obj), allowed)
    if (!extra.length) return
    const o = parseOpts(opts)
    fail({
      assertion: "hasOnlyKeys",
      message: buildBlock({
        assertion: "hasOnlyKeys",
        title: o.msg ?? "Forbidden keys found",
        rows: extra.map((k) => ({
          label: "forbidden",
          value: color.removed(k),
          indicator: color.removed("✗"),
        })),
        note: o.note,
      }),
      actual: extra,
      expected: allowed,
    })
  },

  /**
   * Asserts that `obj[key] === expected` (deep equality via `_.isEqual`).
   * The value type is inferred from `T[K]`.
   * @example `assert.hasValue(config, "port", 5432, "wrong database port")`
   */
  hasValue<T extends object, K extends keyof T>(obj: T, key: K, expected: T[K], opts?: Opts): void {
    if (isDisabled()) return
    if (_.isEqual(obj[key], expected)) return
    const o = parseOpts(opts)
    fail({
      assertion: "hasValue",
      message: buildBlock({
        assertion: "hasValue",
        title: o.msg ?? `Wrong value for key "${String(key)}"`,
        rows: [
          { label: "expected", value: fmtValue(expected), indicator: color.added("+") },
          { label: "actual", value: fmtValue(obj[key]), indicator: color.removed("✗") },
        ],
        note: o.note,
      }),
      actual: obj[key],
      expected,
    })
  },

  /**
   * Asserts that `obj` contains all key-value pairs in `subset`.
   * @example `assert.containsSubset(user, { role: "admin" }, "user must be admin")`
   */
  containsSubset<T extends object>(obj: T, subset: Partial<T>, opts?: Opts): void {
    if (isDisabled()) return
    const bad = (_.keys(subset) as (keyof T)[]).find((k) => !_.isEqual(obj[k], subset[k]))
    if (bad === undefined) return
    const o = parseOpts(opts)
    fail({
      assertion: "containsSubset",
      message: buildBlock({
        assertion: "containsSubset",
        title: o.msg ?? "Subset mismatch",
        rows: [
          { label: String(bad), value: "" },
          { label: "  expected", value: fmtValue(subset[bad]), indicator: color.added("+") },
          { label: "  actual", value: fmtValue(obj[bad]), indicator: color.removed("✗") },
        ],
        note: o.note,
      }),
      actual: obj[bad],
      expected: subset[bad],
    })
  },

  /**
   * Asserts that all values in `obj` satisfy the predicate.
   * @example `assert.allValuesMatch(inventory, (qty) => qty >= 0, "no negative stock")`
   */
  allValuesMatch<T extends object>(
    obj: T,
    predicate: (v: T[keyof T], k: keyof T) => boolean,
    opts?: Opts
  ): void {
    if (isDisabled()) return
    const bad = (_.keys(obj) as (keyof T)[]).find((k) => !predicate(obj[k], k))
    if (bad === undefined) return
    const o = parseOpts(opts)
    fail({
      assertion: "allValuesMatch",
      message: buildBlock({
        assertion: "allValuesMatch",
        title: o.msg ?? "Value failed predicate",
        rows: [{ label: String(bad), value: fmtValue(obj[bad]), indicator: color.removed("✗") }],
        note: o.note,
      }),
      actual: obj[bad],
      expected: "match predicate",
    })
  },

  /**
   * Asserts that no value in `obj` is `null` or `undefined`.
   * @example `assert.noNilValues(config, "config must have no null values")`
   */
  noNilValues<T extends object>(obj: T, opts?: Opts): void {
    if (isDisabled()) return
    const bad = (_.keys(obj) as (keyof T)[]).find((k) => _.isNil(obj[k]))
    if (bad === undefined) return
    const o = parseOpts(opts)
    fail({
      assertion: "noNilValues",
      message: buildBlock({
        assertion: "noNilValues",
        title: o.msg ?? "Nil value found in object",
        rows: [{ label: String(bad), value: fmtValue(obj[bad]), indicator: color.removed("✗") }],
        note: o.note,
      }),
      actual: obj[bad],
      expected: "non-null",
    })
  },

  /**
   * Asserts that the object has a value at a nested path — Ruby `hash.dig(:a, :b)`.
   * @example `assert.dig(config, "database.pool.max", 10)`
   */
  dig<T>(obj: T, path: string | string[], expected: unknown, opts?: Opts): void {
    if (isDisabled()) return
    const actual = _.get(obj as object, path)
    if (_.isEqual(actual, expected)) return
    const o = parseOpts(opts)
    fail({
      assertion: "dig",
      message: buildBlock({
        assertion: "dig",
        title: o.msg ?? `Wrong value at path "${Array.isArray(path) ? path.join(".") : path}"`,
        rows: [
          { label: "expected", value: fmtValue(expected), indicator: color.added("+") },
          { label: "actual", value: fmtValue(actual), indicator: color.removed("✗") },
        ],
        note: o.note,
      }),
      actual,
      expected,
    })
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // FUNCTIONS — mathematical map properties
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Asserts that `fn(...args)` returns `expected` (deep equality).
   * @example `assert.returns(getDefaultCurrency, [], "USD")`
   */
  returns<TArgs extends unknown[], TReturn>(
    fn: (...args: TArgs) => TReturn,
    args: TArgs,
    expected: TReturn,
    opts?: Opts
  ): void {
    if (isDisabled()) return
    const actual = fn(...args)
    if (_.isEqual(actual, expected)) return
    const o = parseOpts(opts)
    fail({
      assertion: "returns",
      message: buildBlock({
        assertion: "returns",
        title: o.msg ?? `Unexpected return value from ${fn.name || "fn"}`,
        rows: [
          { label: "expected", value: fmtValue(expected), indicator: color.added("+") },
          { label: "actual", value: fmtValue(actual), indicator: color.removed("✗") },
        ],
        note: o.note,
      }),
      actual,
      expected,
    })
  },

  /**
   * Asserts that calling `fn` twice with the same arguments produces identical
   * results (referential transparency / pure function).
   * @example `assert.pure(calculateTax, [order])`
   */
  pure<TArgs extends unknown[], TReturn>(
    fn: (...args: TArgs) => TReturn,
    args: TArgs,
    opts?: Opts
  ): void {
    if (isDisabled()) return
    const r1 = fn(...args)
    const r2 = fn(...args)
    if (_.isEqual(r1, r2)) return
    const o = parseOpts(opts)
    fail({
      assertion: "pure",
      message: buildBlock({
        assertion: "pure",
        title: o.msg ?? `${fn.name || "fn"} is not deterministic`,
        rows: [
          { label: "call 1", value: fmtValue(r1) },
          { label: "call 2", value: fmtValue(r2), indicator: color.removed("✗") },
        ],
        note: o.note,
      }),
      actual: r2,
      expected: r1,
    })
  },

  /**
   * Asserts that `fn(fn(x))` equals `fn(x)` (idempotent function).
   * @example `assert.idempotent(normalizeEmail, "Alice@Example.COM")`
   */
  idempotent<T>(fn: (v: T) => T, arg: T, opts?: Opts): void {
    if (isDisabled()) return
    const r1 = fn(arg)
    const r2 = fn(r1)
    if (_.isEqual(r1, r2)) return
    const o = parseOpts(opts)
    fail({
      assertion: "idempotent",
      message: buildBlock({
        assertion: "idempotent",
        title: o.msg ?? `${fn.name || "fn"} is not idempotent`,
        rows: [
          { label: "fn(x)", value: fmtValue(r1) },
          { label: "fn(fn(x))", value: fmtValue(r2), indicator: color.removed("✗") },
        ],
        note: o.note,
      }),
      actual: r2,
      expected: r1,
    })
  },

  /**
   * Asserts that `fn.length` equals `n` (declared parameter count).
   * @example `assert.arity(transform, 1, "pipeline steps must be unary")`
   */
  arity(fn: (...args: unknown[]) => unknown, n: number, opts?: Opts): void {
    if (isDisabled()) return
    if (fn.length === n) return
    const o = parseOpts(opts)
    fail({
      assertion: "arity",
      message: buildBlock({
        assertion: "arity",
        title: o.msg ?? `Wrong arity for ${fn.name || "fn"}`,
        rows: [
          { label: "expected", value: fmtValue(n), indicator: color.added("+") },
          { label: "actual", value: fmtValue(fn.length), indicator: color.removed("✗") },
        ],
        note: o.note,
      }),
      actual: fn.length,
      expected: n,
    })
  },

  /**
   * Asserts that `fn(a)` and `fn(b)` produce different results.
   * Useful to detect hash collisions or identity-collapse bugs.
   * @example `assert.mapsDistinct(hashFn, "user:1", "user:2", "hash collision")`
   */
  mapsDistinct<T, U>(fn: (v: T) => U, a: T, b: T, opts?: Opts): void {
    if (isDisabled()) return
    const ra = fn(a)
    const rb = fn(b)
    if (!_.isEqual(ra, rb)) return
    const o = parseOpts(opts)
    fail({
      assertion: "mapsDistinct",
      message: buildBlock({
        assertion: "mapsDistinct",
        title: o.msg ?? `${fn.name || "fn"} maps two distinct inputs to the same output`,
        rows: [
          { label: "input a", value: fmtValue(a) },
          { label: "input b", value: fmtValue(b) },
          { label: "output", value: fmtValue(ra), indicator: color.removed("✗") },
        ],
        note: o.note,
      }),
      actual: [a, b],
      expected: "distinct outputs",
    })
  },

  /**
   * Asserts that `fn(combine(a, b))` equals `combine(fn(a), fn(b))`.
   * Tests the homomorphism law — that a transform distributes over
   * a combining operation.
   *
   * @example
   * ```ts
   * assert.homomorphic(
   *   normalize,
   *   (a, b) => [...a, ...b],
   *   [1, 2], [3, 4],
   *   "normalize must distribute over concatenation"
   * )
   * ```
   */
  homomorphic<T>(fn: (v: T) => T, combine: (a: T, b: T) => T, a: T, b: T, opts?: Opts): void {
    if (isDisabled()) return
    const combined = fn(combine(a, b))
    const distributed = combine(fn(a), fn(b))
    if (_.isEqual(combined, distributed)) return
    const o = parseOpts(opts)
    fail({
      assertion: "homomorphic",
      message: buildBlock({
        assertion: "homomorphic",
        title: o.msg ?? `${fn.name || "fn"} is not homomorphic`,
        rows: [
          { label: "fn(a + b)", value: fmtValue(combined), indicator: color.removed("✗") },
          { label: "fn(a)+fn(b)", value: fmtValue(distributed), indicator: color.added("+") },
        ],
        note: o.note,
      }),
      actual: combined,
      expected: distributed,
    })
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // NOT — the only negation
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Inverts any assertion — passes only if the inner assertion throws.
   *
   * @remarks
   * This is the **only** negation API in the library. Instead of duplicating
   * every assertion as `notEqual`, `notEmpty`, etc., wrap any assertion in
   * `not()`.
   *
   * @param fn   - Any assertion function from this module.
   * @param args - Arguments to forward to the assertion function.
   *
   * @example
   * ```ts
   * // assert that two values are NOT equal
   * assert.not(assert.equal, user.role, "admin")
   *
   * // assert that the array does NOT contain "FATAL"
   * assert.not(assert.includes, errors, "FATAL")
   *
   * // assert the object does NOT have a forbidden key
   * assert.not(assert.hasKey, patch, "id")
   * ```
   */
  not(fn: (...args: unknown[]) => void, ...args: unknown[]): void {
    if (isDisabled()) return
    let threw = false
    try {
      fn(...args)
    } catch {
      threw = true
    }
    if (threw) return
    fail({
      assertion: "not",
      message: buildBlock({
        assertion: "not",
        title: `not(${fn.name || "fn"}): assertion should have failed`,
        rows: [
          {
            label: "result",
            value: color.removed("passed — expected failure"),
            indicator: color.removed("✗"),
          },
        ],
      }),
    })
  },
}
