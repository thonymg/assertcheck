/**
 * @module fail
 *
 * Internal helper that routes an assertion failure through the
 * current mode (disabled / warn / enabled).
 * @internal
 */

import { isDisabled, isWarn } from "./mode.ts"
import { AssertionError } from "./error.ts"
import { output } from "./format.ts"
import type { AssertionErrorOptions } from "./types.ts"

/**
 * Handles an assertion failure according to the current {@link AssertMode}.
 *
 * @remarks
 * - `"disabled"` — returns immediately, no output, no throw.
 * - `"warn"`     — prints the formatted block to the output channel, returns.
 * - `"enabled"`  — prints the formatted block, then throws {@link AssertionError}.
 *
 * Always declared as `never` return type so TypeScript narrows correctly
 * after a `fail()` call.
 *
 * @param opts - The structured failure options.
 * @internal
 */
export const fail = (opts: AssertionErrorOptions): never => {
  if (isDisabled()) return undefined as never

  output(opts.message)

  if (isWarn()) return undefined as never

  throw new AssertionError(opts)
}
