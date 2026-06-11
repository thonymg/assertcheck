/**
 * @module types
 *
 * Shared types and interfaces for the assertcheck library.
 * Import from `@assertcheck/core/types` or via the root barrel.
 */

// ─────────────────────────────────────────────────────────────────────────────
// MODE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Controls how assertion failures are handled at runtime.
 *
 * @remarks
 * `"enabled"` is the **unconditional default** — in every environment,
 * including production. Assertions are a safety net that should always be
 * active. A clean crash with a precise message is always preferable to
 * silent data corruption.
 *
 * Use {@link modeAssertIn} at your application entry point if you want to
 * override this default for a specific environment:
 *
 * ```ts
 * modeAssertIn("prod",    "warn")     // observe in production, don't crash
 * modeAssertIn("dev",     "disabled") // silence during heavy local iteration
 * modeAssertIn("staging", "enabled")  // explicit — same as default
 * ```
 *
 * | Mode         | On failure                 | When to use                      |
 * |--------------|----------------------------|----------------------------------|
 * | `"enabled"`  | Formatted output + throw   | **Always** — default everywhere  |
 * | `"warn"`     | Formatted output, no throw | Soft rollout in production       |
 * | `"disabled"` | No-op — zero overhead      | Explicit opt-out only            |
 */
export type AssertMode = "disabled" | "warn" | "enabled"

/**
 * The set of environment names recognised by {@link modeAssertIn}.
 *
 * @remarks
 * These map to common `NODE_ENV` values and their aliases:
 *
 * | `Env`         | Matches `NODE_ENV`                     |
 * |---------------|----------------------------------------|
 * | `"prod"`      | `"production"`, `"prod"`               |
 * | `"dev"`       | `"development"`, `"dev"`               |
 * | `"test"`      | `"test"`                               |
 * | `"staging"`   | `"staging"`, `"stage"`                 |
 * | `"ci"`        | `"ci"`                                 |
 */
export type Env = "prod" | "dev" | "test" | "staging" | "ci"

// ─────────────────────────────────────────────────────────────────────────────
// OPTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Options accepted by every assertion function.
 *
 * @remarks
 * All fields are optional. You can pass a plain `string` as a shorthand for
 * `{ msg: "..." }`.
 *
 * @example
 * ```ts
 * // Shorthand string
 * assert.equal(a, b, "values must match")
 *
 * // Full options object
 * assert.equal(a, b, {
 *   msg:    "order status mismatch",
 *   actual: "order.status",
 *   note:   "call resetOrder() before retrying",
 * })
 * ```
 */
export interface AssertOptions {
  /**
   * Human-readable description of what the assertion checks.
   * Appears as the title in the formatted error block.
   */
  msg?: string

  /**
   * Label for the actual value in the error output.
   * Useful to identify which variable or field failed.
   * @example `"order.status"`, `"response.body.user.age"`
   */
  actual?: string

  /**
   * Additional context about why this assertion exists or how to fix it.
   * Displayed in the `note` section of the error block.
   * @example `"Call resetOrder() before retrying"`
   */
  note?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// ERROR
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Constructor options for {@link AssertionError}.
 */
export interface AssertionErrorOptions {
  /** The name of the assertion function that failed (e.g. `"equal"`). */
  assertion: string
  /** The formatted, human-readable error message. */
  message: string
  /** The value that was actually received. */
  actual?: unknown
  /** The value or constraint that was expected. */
  expected?: unknown
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL BLOCK BUILDER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Definition for a single row in the "values" section of an error block.
 * @internal
 */
export interface RowDef {
  /** Label column (left side). */
  label: string
  /** Value column (right side, already formatted). */
  value: string
  /** Single-character indicator: `+`, `✗`, `·`, etc. Defaults to `" "`. */
  indicator?: string
}

/**
 * Full definition passed to the internal block builder.
 * @internal
 */
export interface BlockDef {
  /** Name of the assertion, used as fallback title. */
  assertion: string
  /** Title displayed in the header bar. */
  title?: string
  /** Rows in the "values" section. */
  rows?: RowDef[]
  /** If provided, renders a structured diff between actual and expected. */
  diff?: { actual: unknown; expected: unknown }
  /** Key/value pairs rendered in the "context" section. */
  extras?: Record<string, unknown>
  /** Free-text note rendered at the bottom. */
  note?: string | undefined
}
