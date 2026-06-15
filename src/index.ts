/**
 * @module assertcheck
 *
 * Production-grade assertion library for TypeScript.
 *
 * @remarks
 * Assertions are **always enabled** — failures always output and throw.
 * There is no mode system.
 *
 * **Entry points:**
 *
 * ```ts
 * // 1. Standalone assertion functions — most common
 * import { assert } from "assertcheck"
 *
 * // 2. Chainable wrapper
 * import { check } from "assertcheck"
 * ```
 *
 * @example
 * ```ts
 * import { assert, check } from "assertcheck"
 *
 * assert.equal(order.status, "pending", {
 *   msg:    "order must be pending before payment",
 *   actual: "order.status",
 *   note:   "call resetOrder() first",
 * })
 *
 * check(users)
 *   .noNils()
 *   .uniqueBy("id", "duplicate user IDs")
 *   .all(u => u.active, "all users must be active")
 * ```
 */

// ── Core ─────────────────────────────────────────────────────────────────────
export { assert } from "./assert.ts"
export { check, Checker, ArrayChecker, ObjectChecker } from "./checker.ts"

// ── Error ────────────────────────────────────────────────────────────────────
export { AssertionError } from "./error.ts"

// ── Format (advanced / custom wrappers) ──────────────────────────────────────
export { buildBlock, fmtValue, diffObjects, color, output, parseOpts } from "./format.ts"

// ── Types ────────────────────────────────────────────────────────────────────
export type { AssertOptions, AssertionErrorOptions, BlockDef, RowDef } from "./types.ts"
