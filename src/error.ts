/**
 * @module error
 *
 * The {@link AssertionError} class thrown by all failing assertions
 * when mode is `"enabled"`.
 *
 * @example
 * ```ts
 * import { AssertionError } from "@assertcheck/core"
 *
 * try {
 *   assert.equal(1, 2)
 * } catch (err) {
 *   if (err instanceof AssertionError) {
 *     console.log(err.assertion) // "equal"
 *     console.log(err.actual)    // 1
 *     console.log(err.expected)  // 2
 *   }
 * }
 * ```
 */

import type { AssertionErrorOptions } from "./types.ts"

// ─────────────────────────────────────────────────────────────────────────────
// ERROR CLASS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Error thrown when an assertion fails in `"enabled"` mode.
 *
 * @remarks
 * Unlike a generic `Error`, `AssertionError` carries structured metadata
 * about what was expected, what was received, and which assertion failed.
 * This makes it easy to catch and inspect in tests or error boundaries.
 *
 * The stack trace is cleaned up with `Error.captureStackTrace` (V8 / Node.js /
 * Bun) so the first frame points directly to the call site that triggered the
 * assertion — not to the internal `fail()` helper inside this library.
 *
 * @example
 * ```ts
 * import { assert, AssertionError } from "@assertcheck/core"
 *
 * try {
 *   assert.equal(order.status, "pending", "must be pending before payment")
 * } catch (err) {
 *   if (err instanceof AssertionError) {
 *     console.error("Assertion:", err.assertion) // "equal"
 *     console.error("Actual:",    err.actual)    // "paid"
 *     console.error("Expected:",  err.expected)  // "pending"
 *   }
 * }
 * ```
 */
export class AssertionError extends Error {
  /**
   * Name of the assertion function that failed.
   * @example `"equal"`, `"all"`, `"hasExactKeys"`
   */
  readonly assertion: string

  /**
   * The value that was actually received at the time of the assertion.
   */
  readonly actual: unknown

  /**
   * The value or constraint that was expected.
   * May be a concrete value, a descriptive string, or `undefined`.
   */
  readonly expected: unknown

  constructor(opts: AssertionErrorOptions) {
    super(opts.message)
    this.name = "AssertionError"
    this.assertion = opts.assertion
    this.actual = opts.actual
    this.expected = opts.expected

    // V8 / Node.js / Bun — removes internal frames so the trace
    // starts at the real call site.
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, AssertionError)
    }
  }
}
