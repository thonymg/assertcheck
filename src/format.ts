/**
 * @module format
 *
 * Formatting engine for assertion error output.
 * Produces richly styled, ELM-inspired error blocks that render correctly
 * in Node.js / Bun ANSI terminals, browser DevTools, and plain-text
 * environments (CI pipes, `NO_COLOR`).
 *
 * @remarks
 * You do not need to import this module directly — it is used internally
 * by {@link assert}. It is exported for advanced use cases such as
 * custom assertion wrappers.
 *
 * @example
 * ```ts
 * import { buildBlock, fmtValue } from "assertcheck/format"
 *
 * const msg = buildBlock({
 *   assertion: "myAssert",
 *   title: "Custom check failed",
 *   rows: [
 *     { label: "expected", value: fmtValue(42), indicator: "+" },
 *     { label: "actual",   value: fmtValue(0),  indicator: "✗" },
 *   ],
 * })
 * console.error(msg)
 * ```
 */

import { isPlainObject, union, isEqual } from "lodash"
import { ENV } from "./env.ts"
import type { BlockDef, RowDef } from "./types.ts"

// ─────────────────────────────────────────────────────────────────────────────
// ANSI CODES
// ─────────────────────────────────────────────────────────────────────────────

/** Raw ANSI escape codes. Used only when `ENV.hasAnsi` is true. @internal */
const A = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  italic: "\x1b[3m",
  underline: "\x1b[4m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
} as const

/**
 * Wraps `s` in ANSI codes when the terminal supports them, otherwise
 * returns `s` unchanged.
 * @internal
 */
const ansi = (codes: string, s: string): string => (ENV.hasAnsi ? `${codes}${s}${A.reset}` : s)

// ─────────────────────────────────────────────────────────────────────────────
// SEMANTIC COLOUR PALETTE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Semantic colour functions used throughout the formatter.
 * Each wraps its argument in the appropriate ANSI escape sequence,
 * or returns the string unchanged when ANSI is not supported.
 * @internal
 */
export const color = {
  // ── Layout
  /** Bold red — error titles and failure indicators. */
  title: (s: string): string => ansi(A.bold + A.red, s),
  /** Bold cyan — section headers like "diff", "context", "note". */
  section: (s: string): string => ansi(A.bold + A.cyan, s),
  /** Dim — secondary labels and separators. */
  label: (s: string): string => ansi(A.dim, s),
  /** Dim — separator lines (─, ═). */
  sep: (s: string): string => ansi(A.dim, s),

  // ── Value types
  /** Green — string values. */
  string: (s: string): string => ansi(A.green, s),
  /** Yellow — number values. */
  number: (s: string): string => ansi(A.yellow, s),
  /** Cyan — boolean values. */
  boolean: (s: string): string => ansi(A.cyan, s),
  /** Dim — null / undefined. */
  nil: (s: string): string => ansi(A.dim, s),
  /** Blue — arrays. */
  array: (s: string): string => ansi(A.blue, s),
  /** Magenta — plain objects. */
  object: (s: string): string => ansi(A.magenta, s),

  // ── Diff indicators
  /** Bold green — expected / added / missing. */
  added: (s: string): string => ansi(A.bold + A.green, s),
  /** Bold red — actual / removed / unexpected. */
  removed: (s: string): string => ansi(A.bold + A.red, s),
  /** Bold yellow — changed. */
  changed: (s: string): string => ansi(A.bold + A.yellow, s),
  /** Dim — unchanged entries in a diff. */
  same: (s: string): string => ansi(A.dim, s),

  // ── Miscellaneous
  /** Italic cyan — note / hint text. */
  note: (s: string): string => ansi(A.italic + A.cyan, s),
  /** Yellow — indices and counts. */
  index: (s: string): string => ansi(A.yellow, s),
  /** Underline — paths and key names. */
  path: (s: string): string => ansi(A.underline, s),
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

/** Total width of separator lines, in characters. */
const WIDTH = 62

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A blank line used to add vertical breathing room between sections.
 * @internal
 */
const spacer = (): string => ""

/**
 * A thin horizontal separator line (─).
 * @internal
 */
const line = (): string => color.sep("─".repeat(WIDTH))

/**
 * A thick horizontal separator line (═).
 * @internal
 */
const dline = (): string => color.sep("═".repeat(WIDTH))

/**
 * Renders a centred header bar for the top of an error block.
 *
 * @example
 * ```
 * ══════════════════ ● Values are not equal ══════════════════
 * ```
 *
 * @param title - The title text to centre.
 * @param icon  - The icon prefix. Defaults to `"●"`.
 * @internal
 */
const header = (title: string, icon = "●"): string => {
  const text = ` ${icon} ${title} `
  const pad = Math.max(0, WIDTH - text.length)
  const left = Math.floor(pad / 2)
  const right = pad - left
  return color.title("═".repeat(left) + text + "═".repeat(right))
}

/**
 * Renders a section sub-header with a trailing fill line.
 *
 * @example
 * ```
 * ── diff ────────────────────────────────────────────────────
 * ```
 *
 * @param label - The section label.
 * @internal
 */
const section = (label: string): string => {
  const prefix = `── ${label} `
  const fill = "─".repeat(Math.max(0, WIDTH - prefix.length))
  return color.section(prefix) + color.sep(fill)
}

/**
 * Renders a single data row with a label column, value column,
 * and an optional single-character indicator on the left.
 *
 * @example
 * ```
 *   ✗ actual        "paid"
 *   + expected      "pending"
 * ```
 *
 * @param label     - The label (left column).
 * @param value     - The formatted value string (right column).
 * @param indicator - Single-char prefix. Defaults to `" "`.
 * @internal
 */
const row = (label: string, value: string, indicator = " "): string => {
  const padded = label.padEnd(14)
  return `  ${indicator} ${color.label(padded)}  ${value}`
}

// ─────────────────────────────────────────────────────────────────────────────
// VALUE FORMATTER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Formats any JavaScript value into a compact, type-coloured string
 * suitable for display in error output.
 *
 * @remarks
 * - Strings are wrapped in `"double quotes"`.
 * - Arrays are abbreviated after 3 elements: `[1, 2, 3, …+7]`.
 * - Objects are abbreviated after 3 keys.
 * - Recursion is limited to 2 levels deep.
 * - When ANSI is available, each type is rendered in a distinct colour.
 *
 * @param v     - The value to format.
 * @param depth - Internal recursion depth (0 = top level).
 * @returns A formatted, optionally coloured string.
 *
 * @example
 * ```ts
 * import { fmtValue } from "assertcheck/format"
 *
 * fmtValue("hello")        // → "hello"   (green in terminal)
 * fmtValue(42)             // → 42        (yellow)
 * fmtValue([1, 2, 3, 4])   // → [1, 2, 3, …+1]
 * fmtValue(null)           // → null      (dim)
 * ```
 */
export const fmtValue = (v: unknown, depth = 0): string => {
  if (v === null) return color.nil("null")
  if (v === undefined) return color.nil("undefined")
  if (typeof v === "string") return color.string(`"${v}"`)
  if (typeof v === "number") return color.number(String(v))
  if (typeof v === "boolean") return color.boolean(String(v))

  if (Array.isArray(v)) {
    if (depth > 1 || v.length === 0) return color.array(`[…${v.length}]`)
    const shown = v.slice(0, 3).map((x) => fmtValue(x, depth + 1))
    const more = v.length > 3 ? color.label(`, …+${v.length - 3}`) : ""
    return color.array("[") + shown.join(", ") + more + color.array("]")
  }

  if (typeof v === "object") {
    if (depth > 1) return color.object("{…}")
    try {
      const keys = Object.keys(v as object)
      const shown = keys.slice(0, 3)
      const moreLen = keys.length - shown.length
      const pairs = shown.map(
        (k) => `${color.label(k)}: ${fmtValue((v as Record<string, unknown>)[k], depth + 1)}`
      )
      const more = moreLen > 0 ? `, ${color.label(`…+${moreLen}`)}` : ""
      return color.object("{ ") + pairs.join(", ") + more + color.object(" }")
    } catch {
      return color.object("{…}")
    }
  }

  return String(v)
}

// ─────────────────────────────────────────────────────────────────────────────
// DIFF RENDERER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Produces a line-by-line structured diff between `actual` and `expected`.
 *
 * @remarks
 * When both values are plain objects, each key is compared individually:
 * - `·` — equal (dim, secondary)
 * - `~` — changed (two sub-rows: expected / actual)
 * - `+` — missing from actual (shown in green)
 * - `-` — unexpected in actual (shown in red)
 *
 * When either value is not a plain object, falls back to a simple
 * expected / actual two-row layout.
 *
 * @param actual   - The value that was received.
 * @param expected - The value that was expected.
 * @returns An array of formatted lines.
 * @internal
 */
export const diffObjects = (actual: unknown, expected: unknown): string[] => {
  if (!isPlainObject(actual) || !isPlainObject(expected)) {
    return [
      row("expected", fmtValue(expected), color.added("+")),
      row("actual", fmtValue(actual), color.removed("✗")),
    ]
  }

  const a = actual as Record<string, unknown>
  const e = expected as Record<string, unknown>
  const keys = union(Object.keys(a), Object.keys(e))

  return keys.flatMap<string>((k) => {
    if (isEqual(a[k], e[k])) return [row(k, fmtValue(a[k]), color.same("·"))]

    if (!(k in a)) return [row(k, fmtValue(e[k]), color.added("+")) + color.added("  ← missing")]

    if (!(k in e))
      return [row(k, fmtValue(a[k]), color.removed("-")) + color.removed("  ← unexpected")]

    return [
      row(k, "", color.changed("~")),
      row("  expected", fmtValue(e[k]), " "),
      row("  actual", fmtValue(a[k]), " "),
    ]
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOCK BUILDER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Builds the complete formatted error block string from a {@link BlockDef}.
 *
 * @remarks
 * The output follows this ELM-inspired structure:
 * ```
 * ══════════════════ ● Title ════════════════════════════════
 *
 * ── values ──────────────────────────────────────────────────
 *   + expected      "pending"
 *   ✗ actual        "paid"
 *
 * ── diff ────────────────────────────────────────────────────
 *   · id            "usr_123"
 *   ~ status
 *       expected    "active"
 *       actual      "banned"
 *
 * ── context ─────────────────────────────────────────────────
 *   index           3
 *   array size      10
 *
 * ── note ────────────────────────────────────────────────────
 *   Call resetOrder() before retrying
 *
 * ════════════════════════════════════════════════════════════
 * ```
 *
 * @param def - The block definition.
 * @returns The complete formatted string, ready to print.
 *
 * @example
 * ```ts
 * import { buildBlock, fmtValue } from "assertcheck/format"
 *
 * const msg = buildBlock({
 *   assertion: "equal",
 *   title:     "Order status mismatch",
 *   rows: [
 *     { label: "expected", value: fmtValue("pending"), indicator: "+" },
 *     { label: "actual",   value: fmtValue("paid"),    indicator: "✗" },
 *   ],
 *   note: "Call resetOrder() before retrying",
 * })
 * ```
 */
export const buildBlock = (def: BlockDef): string => {
  const lines: string[] = [spacer(), header(def.title ?? def.assertion), spacer()]

  if (def.rows && def.rows.length > 0) {
    lines.push(section("values"))
    for (const r of def.rows) {
      lines.push(row(r.label, r.value, r.indicator))
    }
    lines.push(spacer())
  }

  if (def.diff) {
    lines.push(section("diff"))
    lines.push(...diffObjects(def.diff.actual, def.diff.expected))
    lines.push(spacer())
  }

  if (def.extras && Object.keys(def.extras).length > 0) {
    lines.push(section("context"))
    for (const [k, v] of Object.entries(def.extras)) {
      lines.push(row(k, fmtValue(v)))
    }
    lines.push(spacer())
  }

  if (def.note) {
    lines.push(section("note"))
    lines.push(`  ${color.note(def.note)}`)
    lines.push(spacer())
  }

  lines.push(dline())
  return lines.join("\n")
}

// ─────────────────────────────────────────────────────────────────────────────
// OUTPUT ROUTER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Writes the formatted error message to the appropriate output channel.
 *
 * @remarks
 * - **Node.js / Bun / Deno** — writes directly to `process.stderr` to avoid
 *   interfering with stdout pipelines.
 * - **Browser** — uses `console.groupCollapsed` + `console.error` so the
 *   error appears as a collapsible group in DevTools, keeping the console
 *   clean while preserving full detail on expansion.
 * - **Fallback** — `console.error` for any unknown runtime.
 *
 * @param msg - The pre-formatted message string.
 * @internal
 */
export const output = (msg: string): void => {
  if (ENV.isBrowser) {
    console.groupCollapsed(
      "%cAssertionError %c(click to expand)",
      "color:#e74c3c;font-weight:bold",
      "color:#7f8c8d;font-weight:normal"
    )
    console.error(msg)
    console.groupEnd()
    return
  }

  if ((ENV.isNode || ENV.isBun || ENV.isDeno) && typeof process !== "undefined") {
    process.stderr.write(msg + "\n")
    return
  }

  console.error(msg)
}

// ─────────────────────────────────────────────────────────────────────────────
// OPTIONS PARSER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Normalises the `opts` parameter accepted by every assertion.
 * Accepts either a plain string (used as `msg`) or a full
 * {@link AssertOptions} object.
 * @internal
 */
export const parseOpts = (
  raw: string | { msg?: string; actual?: string; note?: string } | undefined
): { msg?: string; actual?: string; note?: string } =>
  typeof raw === "string" ? { msg: raw } : (raw ?? {})
