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
 * - `isNode`    — `true` when `process` is defined and `window` is not.
 * - `isBun`     — `true` when `Bun` global is available.
 * - `isDeno`    — `true` when `Deno` global is available.
 * - `hasAnsi`   — `true` when ANSI colour codes should be emitted.
 *   Requires a Node/Bun/Deno TTY terminal and respects the `NO_COLOR`
 *   environment variable (https://no-color.org/).
 * - `hasBrowserStyle` — `true` when the browser DevTools `%c` CSS
 *   styling API is available.
 */
export const ENV = /* @__PURE__ */ (() => {
  const isBrowser = typeof (globalThis as any).window !== "undefined"
  const isBun = typeof Bun !== "undefined"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isDeno = typeof (globalThis as any).Deno !== "undefined"
  const isNode = typeof process !== "undefined" && !isBrowser

  const noColor =
    (isNode || isBun) && typeof process !== "undefined" && process.env["NO_COLOR"] !== undefined

  const isTTY =
    (isNode || isBun) &&
    typeof process !== "undefined" &&
    typeof process.stdout !== "undefined" &&
    process.stdout.isTTY === true

  const hasAnsi = isTTY && !noColor
  const hasBrowserStyle = isBrowser

  return {
    isBrowser,
    isNode,
    isBun,
    isDeno,
    hasAnsi,
    hasBrowserStyle,
  } as const
})()
