/**
 * @module env
 *
 * Universal runtime detection.
 * Works across Node.js, Bun, Deno, and all modern browsers.
 * No external dependencies.
 * @internal
 */

/**
 * Detected runtime capabilities, computed once at module load time.
 *
 * @remarks
 * - `isBrowser` — `true` when `window` is defined (browser, jsdom).
 *   Also implies the DevTools `%c` CSS styling API is available.
 * - `isNode`    — `true` when `process` is defined and `window` is not.
 * - `isBun`     — `true` when `Bun` global is available.
 * - `isDeno`    — `true` when `Deno` global is available.
 * - `hasAnsi`   — `true` when ANSI colour codes should be emitted.
 *   Requires a Node/Bun TTY terminal and respects the `NO_COLOR`
 *   environment variable (https://no-color.org/).
 */
export const ENV = /* @__PURE__ */ (() => {
  const isBrowser = typeof (globalThis as any).window !== "undefined"
  const isBun = typeof Bun !== "undefined"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isDeno = typeof (globalThis as any).Deno !== "undefined"
  const isNode = typeof process !== "undefined" && !isBrowser

  const proc = (isNode || isBun) && typeof process !== "undefined" ? process : undefined
  const hasAnsi = proc?.stdout?.isTTY === true && proc.env["NO_COLOR"] === undefined

  return { isBrowser, isNode, isBun, isDeno, hasAnsi } as const
})()
