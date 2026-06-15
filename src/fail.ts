/**
 * @module fail
 *
 * Internal helper that outputs and throws on assertion failure.
 * Assertions are always enabled — there is no mode system.
 * @internal
 */

import { AssertionError } from "./error.ts"
import { output } from "./format.ts"
import type { AssertionErrorOptions } from "./types.ts"

/**
 * Outputs the formatted error block and throws {@link AssertionError}.
 *
 * @param opts - The structured failure options.
 * @internal
 */
export const fail = (opts: AssertionErrorOptions): never => {
  output(opts.message)
  throw new AssertionError(opts)
}
