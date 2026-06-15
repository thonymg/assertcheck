/**
 * @module mode
 *
 * Controls the global assertion mode — whether failures throw, warn, or
 * are silenced.
 *
 * @remarks
 * **`"enabled"` is the unconditional default in every environment.**
 * You never need to call anything to activate assertions — they are always
 * on. Only call {@link modeAssertIn} when you explicitly want to override
 * this default for a specific environment.
 *
 * @example
 * ```ts
 * import { modeAssertIn } from "assertcheck"
 *
 * // Single call at app entry point — that's all
 * modeAssertIn("prod", "warn") // observe in prod without crashing
 * ```
 */

import type { AssertMode, Env } from "./types.ts"

// ─────────────────────────────────────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The active assertion mode.
 * Always starts as `"enabled"` — no auto-detection, no surprises.
 * @internal
 */
let _mode: AssertMode = "enabled"

// ─────────────────────────────────────────────────────────────────────────────
// ENV RESOLUTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Maps an {@link Env} label to the set of `NODE_ENV` strings it matches.
 * @internal
 */
const ENV_ALIASES: Record<Env, string[]> = {
  prod: ["production", "prod"],
  dev: ["development", "dev"],
  test: ["test"],
  staging: ["staging", "stage"],
  ci: ["ci"],
}

/**
 * Returns the current `NODE_ENV` value, normalised to lowercase.
 * Returns `""` when `process` is not available (browser / Deno without flag).
 * @internal
 */
// Indirection via variable prevents bundlers from inlining process.env.NODE_ENV
// at build time — the value must be read at runtime.
const _NODE_ENV_KEY = "NODE_ENV"
const currentNodeEnv = (): string => {
  if (typeof process === "undefined") return ""
  return (process.env[_NODE_ENV_KEY] ?? "").toLowerCase().trim()
}

/**
 * Returns `true` when the runtime's `NODE_ENV` matches the given {@link Env}.
 * @internal
 */
const envMatches = (env: Env): boolean => {
  const current = currentNodeEnv()
  return ENV_ALIASES[env].includes(current)
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Overrides the assertion mode **only when the current runtime environment
 * matches `env`**. Does nothing otherwise.
 *
 * @remarks
 * This is the **only recommended way** to change the assertion mode.
 * Call it once at your application entry point; every module picks up the
 * change automatically because mode state is module-level.
 *
 * The mapping between `env` labels and `NODE_ENV` values:
 *
 * | `env`       | Matches `NODE_ENV`            |
 * |-------------|-------------------------------|
 * | `"prod"`    | `"production"`, `"prod"`      |
 * | `"dev"`     | `"development"`, `"dev"`      |
 * | `"test"`    | `"test"`                      |
 * | `"staging"` | `"staging"`, `"stage"`        |
 * | `"ci"`      | `"ci"`                        |
 *
 * You can call `modeAssertIn` multiple times for different environments —
 * only the one that matches the current `NODE_ENV` takes effect:
 *
 * ```ts
 * modeAssertIn("prod",    "warn")     // soft landing in production
 * modeAssertIn("ci",      "enabled")  // explicit — same as the default
 * modeAssertIn("dev",     "enabled")  // explicit — same as the default
 * ```
 *
 * @param env  - The target environment label.
 * @param mode - The {@link AssertMode} to activate when `env` matches.
 *
 * @example
 * ```ts
 * // app.ts — call once, at the very top of your entry point
 * import { modeAssertIn } from "assertcheck"
 *
 * modeAssertIn("prod", "warn")
 * // → if NODE_ENV is "production" or "prod": mode becomes "warn"
 * // → any other NODE_ENV: mode stays "enabled" (the default)
 * ```
 *
 * @example
 * ```ts
 * // Multiple overrides for different envs
 * modeAssertIn("prod",    "warn")
 * modeAssertIn("staging", "warn")
 * modeAssertIn("ci",      "disabled") // fast CI run — no output
 * ```
 */
export const modeAssertIn = (env: Env, mode: AssertMode): void => {
  if (envMatches(env)) _mode = mode
}

/**
 * Directly sets the global assertion mode, regardless of environment.
 *
 * @remarks
 * Prefer {@link modeAssertIn} for environment-conditional overrides.
 * Use `setAssertMode` only when you need unconditional control — for
 * example in test `beforeEach` / `afterEach` hooks.
 *
 * @param mode - The desired {@link AssertMode}.
 *
 * @example
 * ```ts
 * // In a test file — save and restore around each test
 * beforeEach(() => { saved = getAssertMode(); setAssertMode("enabled") })
 * afterEach(()  => { setAssertMode(saved) })
 * ```
 */
export const setAssertMode = (mode: AssertMode): void => {
  _mode = mode
}

/**
 * Returns the current global assertion mode.
 *
 * @returns The active {@link AssertMode}.
 *
 * @example
 * ```ts
 * import { getAssertMode } from "assertcheck"
 *
 * console.log(getAssertMode()) // "enabled"
 * ```
 */
export const getAssertMode = (): AssertMode => _mode

/**
 * Returns `true` if the current mode is `"disabled"`.
 * Used internally to short-circuit assertions with zero overhead.
 * @internal
 */
export const isDisabled = (): boolean => _mode === "disabled"

/**
 * Returns `true` if the current mode is `"warn"` (output but no throw).
 * @internal
 */
export const isWarn = (): boolean => _mode === "warn"

/**
 * Runs `fn` in a temporary mode, then restores the previous mode —
 * even if `fn` throws or rejects.
 *
 * @remarks
 * Prefer this over paired `setAssertMode` / `getAssertMode` calls in tests.
 * The `finally` block guarantees restoration regardless of success or failure,
 * making mode leakage between test suites structurally impossible.
 *
 * Supports both synchronous and asynchronous callbacks:
 * - sync `fn` → mode is restored synchronously on return or throw.
 * - async `fn` → mode is restored via `Promise.prototype.finally` on
 *   resolution or rejection.
 *
 * @example
 * ```ts
 * // Sync — no beforeEach/afterEach needed
 * withMode("disabled", () => {
 *   assert.equal(1, 2) // no-op, mode is restored after this block
 * })
 *
 * // Async
 * await withMode("warn", async () => {
 *   await assert.resolves(processPayment(order))
 * })
 * ```
 */
export function withMode<T>(mode: AssertMode, fn: () => Promise<T>): Promise<T>
export function withMode<T>(mode: AssertMode, fn: () => T): T
export function withMode<T>(mode: AssertMode, fn: () => T | Promise<T>): T | Promise<T> {
  const prev = _mode
  _mode = mode
  let result: T | Promise<T>
  try {
    result = fn()
  } catch (e) {
    _mode = prev
    throw e
  }
  if (result instanceof Promise) {
    return result.finally(() => {
      _mode = prev
    }) as Promise<T>
  }
  _mode = prev
  return result
}
