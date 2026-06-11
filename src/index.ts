/**
 * @module assertcheck
 *
 * Production-grade assertion library for TypeScript.
 *
 * @remarks
 * **`"enabled"` is the unconditional default — including in production.**
 * You never need to configure anything to start using assertions.
 * Only call {@link modeAssertIn} when you explicitly want to change the
 * behaviour for a specific environment.
 *
 * **Entry points:**
 *
 * ```ts
 * // 1. Standalone assertion functions — most common
 * import { assert } from "assertcheck"
 *
 * // 2. Chainable wrapper
 * import { check } from "assertcheck"
 *
 * // 3. Environment-conditional mode override — call once at app boot
 * import { modeAssertIn } from "assertcheck"
 * ```
 *
 * **Mode overview:**
 *
 * | Mode         | Behaviour           | Default?       |
 * |--------------|---------------------|----------------|
 * | `"enabled"`  | Log + throw         | ✅ Always      |
 * | `"warn"`     | Log only, no throw  | Via modeAssertIn |
 * | `"disabled"` | No-op, zero cost    | Via modeAssertIn |
 *
 * @example
 * ```ts
 * // app.ts — one call at the entry point, everything else just works
 * import { modeAssertIn, assert, check } from "assertcheck"
 *
 * modeAssertIn("prod", "warn") // soft landing in production
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

// ── Mode ─────────────────────────────────────────────────────────────────────
export { modeAssertIn, setAssertMode, getAssertMode } from "./mode.ts"

// ── Error ────────────────────────────────────────────────────────────────────
export { AssertionError } from "./error.ts"

// ── Format (advanced / custom wrappers) ──────────────────────────────────────
export { buildBlock, fmtValue, diffObjects, color, output, parseOpts } from "./format.ts"

// ── Types ────────────────────────────────────────────────────────────────────
export type {
  AssertMode,
  Env,
  AssertOptions,
  AssertionErrorOptions,
  BlockDef,
  RowDef,
} from "./types.ts"
