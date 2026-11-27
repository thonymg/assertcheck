#!/usr/bin/env node
// assertcheck scan — deterministic detection of silent failures in TypeScript.
// Usage: node scan.mjs [paths...] [--diff [ref]] [--min high|medium|low] [--json] [--include-tests]
//   paths          files or directories (default: .)
//   --min level    lowest severity shown (default: medium; low = debatable, review by hand)
//   --diff [ref]   only report lines changed vs ref (default HEAD) + untracked files
//   --json         machine-readable output
//   --include-tests  also scan *.test.ts / *.spec.ts / tests/ folders
// Waive a finding with `// assertcheck-ignore` on the same or the previous line.
// After the findings, text output lists the functions that need a second, logical analysis:
// every function holding a low or debatable finding (even hidden below --min). JSON keeps an array
// of findings, each carrying its enclosing `fn`.
// Exit code: 1 if any finding, 0 otherwise.
// Requires `typescript` installed in the scanned project (or next to this script).

import { createRequire } from "node:module"
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

const cwd = process.cwd()
const ts = loadTypescript()

// ── args ─────────────────────────────────────────────────────────────
const argv = process.argv.slice(2)
const opts = { json: false, tests: false, diff: null, min: "medium", paths: [] }
for (let i = 0; i < argv.length; i++) {
  const a = argv[i]
  if (a === "--json") opts.json = true
  else if (a === "--include-tests") opts.tests = true
  else if (a === "--min") opts.min = argv[++i]
  else if (a === "--diff")
    opts.diff =
      argv[i + 1] && !argv[i + 1].startsWith("-") && !fs.existsSync(argv[i + 1])
        ? argv[++i]
        : "HEAD"
  else opts.paths.push(a)
}
if (!opts.paths.length) opts.paths.push(".")

// ── files ────────────────────────────────────────────────────────────
const SKIP_DIRS = new Set([
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".git",
  ".next",
  ".svelte-kit",
  ".vitepress",
])
const isTestPath = (f) =>
  /\.(test|spec)\.[cm]?tsx?$/.test(f) ||
  /(^|[\\/])(tests?|__tests__)[\\/]/.test(path.relative(cwd, f))
const isTsFile = (f) => /\.[cm]?tsx?$/.test(f) && !/\.d\.[cm]?ts$/.test(f)

function walk(p, out) {
  const abs = path.resolve(cwd, p)
  if (!fs.existsSync(abs)) return
  const st = fs.statSync(abs)
  if (st.isFile()) {
    if (isTsFile(abs)) out.push(abs)
    return
  }
  for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
    if (e.isDirectory() && (SKIP_DIRS.has(e.name) || e.name.startsWith("."))) continue
    walk(path.join(abs, e.name), out)
  }
}
let files = []
for (const p of opts.paths) walk(p, files)
if (!opts.tests) files = files.filter((f) => !isTestPath(f))

const changed = opts.diff ? changedLines(opts.diff) : null
if (changed) files = files.filter((f) => changed.has(f))

// ── program ──────────────────────────────────────────────────────────
const configPath = ts.findConfigFile(cwd, ts.sys.fileExists)
let compilerOptions = {
  strict: true,
  allowJs: false,
  target: ts.ScriptTarget.ES2022,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  module: ts.ModuleKind.ESNext,
}
if (configPath) {
  const cfg = ts.readConfigFile(configPath, ts.sys.readFile)
  compilerOptions = ts.parseJsonConfigFileContent(
    cfg.config,
    ts.sys,
    path.dirname(configPath)
  ).options
}
compilerOptions = { ...compilerOptions, noEmit: true, allowImportingTsExtensions: true }
const program = ts.createProgram(files, compilerOptions)
const checker = program.getTypeChecker()

// ── scan ─────────────────────────────────────────────────────────────
const findings = []
for (const file of files) {
  const sf = program.getSourceFile(file)
  if (sf) scanFile(sf)
}

const RANK = { high: 0, medium: 1, low: 2 }
const review = reviewList(findings)
const hidden = findings.filter((f) => RANK[f.severity] > RANK[opts.min]).length
findings.splice(0, findings.length, ...findings.filter((f) => RANK[f.severity] <= RANK[opts.min]))
findings.sort(
  (a, b) => RANK[a.severity] - RANK[b.severity] || a.file.localeCompare(b.file) || a.line - b.line
)

if (opts.json) {
  console.log(JSON.stringify(findings, null, 2))
} else {
  for (const f of findings) {
    console.log(`${f.file}:${f.line}:${f.col} ${f.severity} ${f.rule}  ${f.code}`)
    console.log(`  fix: ${f.fix}`)
  }
  const n = (s) => findings.filter((f) => f.severity === s).length
  console.log(
    `${findings.length} findings (${n("high")} high, ${n("medium")} medium, ${n("low")} low) in ${files.length} files` +
      (hidden ? ` (+${hidden} hidden below --min ${opts.min})` : "")
  )
  if (review.length) {
    console.log(
      `\nsecond analysis: ${review.length} function(s) the scanner cannot settle (low or debatable findings).`
    )
    console.log("Read each one in full, trace its inputs, and decide: assert, validate, or keep (say why).")
    for (const r of review) console.log(`  ${r.file}:${r.line} ${r.name}  [${[...r.rules].join(", ")}]`)
  }
}
process.exitCode = findings.length ? 1 : 0

// ── rules ────────────────────────────────────────────────────────────
function scanFile(sf) {
  const lines = sf.text.split("\n")
  const lineChanged = changed?.get(sf.fileName)
  const envSeen = new Set()

  const fns = []
  const collectFns = (n) => {
    if (ts.isFunctionLike(n) && n.body) fns.push(n)
    ts.forEachChild(n, collectFns)
  }
  collectFns(sf)
  const fnName = (n) => {
    if (ts.isConstructorDeclaration(n)) return "constructor"
    if (n.name) return n.name.getText(sf)
    const p = n.parent
    return p && (ts.isVariableDeclaration(p) || ts.isPropertyAssignment(p) || ts.isPropertyDeclaration(p))
      ? p.name.getText(sf)
      : null
  }
  // innermost named function around a position, "<module>" at top level
  const enclosing = (pos) => {
    let best = null
    for (const f of fns) {
      if (pos < f.getStart(sf) || pos > f.end || !fnName(f)) continue
      if (!best || f.getStart(sf) >= best.getStart(sf)) best = f
    }
    return best
      ? { name: fnName(best), line: sf.getLineAndCharacterOfPosition(best.getStart(sf)).line + 1 }
      : { name: "<module>", line: 1 }
  }

  // node: an AST node, or a text position (then `code` gives the snippet)
  const report = (node, severity, rule, fix, code) => {
    const start = typeof node === "number" ? node : node.getStart(sf)
    const { line, character } = sf.getLineAndCharacterOfPosition(start)
    if (lineChanged && !lineChanged(line + 1)) return
    if (
      /assertcheck-ignore/.test(lines[line]) ||
      (line > 0 && /assertcheck-ignore/.test(lines[line - 1]))
    )
      return
    const file = path.relative(cwd, sf.fileName)
    if (findings.some((f) => f.file === file && f.line === line + 1 && f.rule === rule)) return // one per line per rule
    findings.push({
      file,
      line: line + 1,
      col: character + 1,
      severity,
      rule,
      code: code ?? snippet(node, sf),
      fix,
      fn: enclosing(start),
    })
  }

  const visit = (node) => {
    // silent-exit / silent-skip: if (<invalid>) return | continue
    if (ts.isIfStatement(node) && !node.elseStatement) {
      const exit = exitKind(node.thenStatement)
      const fix = exit && !followedByFailure(node) ? suggest(node.expression, sf) : null
      if (fix) {
        const optional = mentionsOptionalParam(node.expression)
        const passthrough =
          isEmptyPassthrough(node) || returnsSubjectOrNil(node) || isBusinessThreshold(node.expression)
        const severity =
          optional || passthrough ? "low" : exit === "continue" ? "medium" : exit
        const rule = exit === "continue" ? "silent-skip" : "silent-exit"
        report(
          node,
          severity,
          rule,
          fix +
            (optional
              ? "  (optional param: keep if absence is legitimate)"
              : passthrough
                ? "  (empty/absent in, empty/absent out, or a business threshold: keep unless it is a bug upstream)"
                : exit === "continue"
                ? "  (or keep if skipping is business logic)"
                : "")
        )
      }
    }

    // swallowed-catch: try {} catch { console.log / return null / nothing }
    if (ts.isCatchClause(node) && isSwallowBody(node.block) && !followedByFailure(node.parent)) {
      // top-level try of a script that logs: the program's last handler, a decision
      const topLevelLog =
        ts.isSourceFile(node.parent.parent) && node.block.statements.some(isConsoleCall)
      report(
        node,
        topLevelLog ? "low" : "high",
        "swallowed-catch",
        'remove the try/catch and let it throw, or rethrow with context: throw new Error("…", { cause: e })'
      )
    }

    // promise-catch: p.catch(() => null)
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.name.text === "catch" &&
      node.arguments.length === 1
    ) {
      const fn = node.arguments[0]
      if (
        (ts.isArrowFunction(fn) || ts.isFunctionExpression(fn)) &&
        (ts.isBlock(fn.body) ? isSwallowBody(fn.body) : isEmptyish(fn.body))
      ) {
        report(
          node,
          "high",
          "swallowed-promise",
          `drop .catch(), or use: await assert.resolvesNotNil(${text(node.expression.expression, sf)}, "…")`
        )
      }
    }

    // falsy / nullish fallback with a literal default
    if (
      ts.isBinaryExpression(node) &&
      (node.operatorToken.kind === ts.SyntaxKind.BarBarToken ||
        node.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken) &&
      isLiteralish(node.right) &&
      !isEnvAccess(node.left)
    ) {
      const or = node.operatorToken.kind === ts.SyntaxKind.BarBarToken
      const left = text(chainRoot(node.left), sf)
      const numeric = /^(Number|parseInt|parseFloat)\(/.test(left)
      const labelDefault = ts.isStringLiteral(unwrap(node.right)) && unwrap(node.right).text !== "" // display default, e.g. name || "anonymous"
      report(
        node,
        or && !labelDefault ? "medium" : "low",
        or ? "falsy-fallback" : "nullish-fallback",
        (numeric
          ? `assert.finite(${left}, "${label(left)} must be a number")`
          : `assert.notNil(${left}, "${label(left)} is required")`) +
          " then use it directly" +
          (or
            ? '  (|| also replaces 0, "" and NaN)'
            : "  (keep if the value is optional by design)")
      )
    }

    // unguarded env var (first read per var per file)
    if (isEnvAccess(node) && !insideAssert(node)) {
      const name = envName(node)
      if (!envSeen.has(name)) {
        envSeen.add(name)
        if (!isEnvHandled(node)) report(
          node,
          "medium",
          "unguarded-env",
          `assert.notEmpty(process.env.${name}, "${name} env var is required") at startup`
        )
      }
    }

    // non-null assertion: x!
    if (ts.isNonNullExpression(node)) {
      const e = text(node.expression, sf)
      report(
        node,
        ts.isElementAccessExpression(node.expression) ? "low" : "medium",
        "non-null-bang",
        `assert.notNil(${e}, "${label(e)} is required") — narrows the type and checks at runtime`
      )
    }

    // cast from any / unknown
    // `x as unknown as T` is a deliberate escape hatch: skip it
    if (
      (ts.isAsExpression(node) || ts.isTypeAssertionExpression(node)) &&
      !isConstOrTopType(node.type) &&
      !ts.isAsExpression(node.expression)
    ) {
      const t = checker.getTypeAtLocation(node.expression)
      if (t.flags & (ts.TypeFlags.Any | ts.TypeFlags.Unknown)) {
        const e = ts.isIdentifier(node.expression) ? node.expression.text : "v"
        const bind = e === "v" ? `const v: unknown = ${text(node.expression, sf)}; ` : ""
        let src = unwrap(node.expression)
        if (ts.isAwaitExpression(src)) src = unwrap(src.expression)
        report(
          node,
          ts.isCallExpression(src) ? "medium" : "low",
          "unchecked-cast",
          `validate before casting: ${bind}assert.object(${e}); assert.hasKeys(${e}, [/* required keys */])`
        )
      }
    }

    // filter(Boolean) / filter(x => x != null)
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.name.text === "filter" &&
      node.arguments.length === 1 &&
      isNilFilter(node.arguments[0])
    ) {
      report(
        node,
        "low",
        "nil-filter",
        `assert.noNils(${text(node.expression.expression, sf)}, "…") if nils are a bug; keep the filter if they are expected`
      )
    }

    // switch default that swallows unknown values
    if (ts.isDefaultClause(node) && isSilentDefault(node)) {
      const sw = node.parent.parent
      const e = text(sw.expression, sf)
      report(
        node,
        "medium",
        "silent-default",
        `default: { const unreachable: never = ${e}; throw new Error(\`unexpected ${label(e)}: \${unreachable}\`) }`
      )
    }

    // optional chain on a nullable value whose undefined result flows on
    if (
      (ts.isPropertyAccessExpression(node) ||
        ts.isElementAccessExpression(node) ||
        ts.isCallExpression(node)) &&
      node.questionDotToken
    ) {
      const top = chainTop(node)
      if (
        !handledContext(top) &&
        isNullable(node.expression) &&
        !mentionsOptionalParam(node.expression)
      ) {
        const e = text(node.expression, sf)
        report(
          node,
          "low",
          "optional-chain",
          `assert.notNil(${e}, "${label(e)} is required") then use ${e}. directly`
        )
      }
    }

    // [...new Set(arr)] / Array.from(new Set(arr)): duplicates removed without a word
    if (
      ts.isNewExpression(node) &&
      node.expression.getText(sf) === "Set" &&
      node.arguments?.length === 1 &&
      (ts.isSpreadElement(node.parent) ||
        (ts.isCallExpression(node.parent) && node.parent.expression.getText(sf) === "Array.from"))
    ) {
      const e = text(node.arguments[0], sf)
      report(
        node.parent,
        "low",
        "dedupe",
        `assert.unique(${e}, "…") or assert.uniqueBy(${e}, "id", "…") if duplicates are a bug; keep if they are expected`
      )
    }

    // Math.max(0, x) / Math.min(x, 100) / Math.abs(x): an out-of-range value is repaired
    if (ts.isCallExpression(node) && /^Math\.(max|min|abs)$/.test(node.expression.getText(sf))) {
      const fn = node.expression.getText(sf).slice(5)
      const args = node.arguments
      const lit = args.findIndex((a) => isNumberLiteral(a))
      const value = args.find((_, i) => i !== lit)
      if (fn === "abs" && args.length === 1 && !isNumberLiteral(args[0])) {
        const e = text(args[0], sf)
        report(
          node,
          "low",
          "clamp",
          `assert.greaterOrEqual(${e}, 0, "…") if a negative value is a bug; keep if it is a real distance`
        )
      } else if (
        fn !== "abs" &&
        args.length === 2 &&
        lit !== -1 &&
        value &&
        !isNumberLiteral(value)
      ) {
        const e = text(value, sf),
          bound = text(args[lit], sf)
        const inner =
          ts.isCallExpression(unwrap(value)) &&
          /^Math\.(max|min)$/.test(unwrap(value).expression.getText(sf))
        const check = inner
          ? `assert.withinRange(<value>, <min>, <max>, "…")`
          : fn === "max"
            ? `assert.greaterOrEqual(${e}, ${bound}, "…")`
            : `assert.lessOrEqual(${e}, ${bound}, "…")`
        if (
          !(
            ts.isCallExpression(node.parent) &&
            /^Math\.(max|min)$/.test(node.parent.expression.getText(sf))
          )
        )
          report(
            node,
            "low",
            "clamp",
            `${check} if an out-of-range value is a bug; keep if clamping is the intent`
          )
      }
    }

    // Number(s) / parseInt(s) / .map(Number): a bad string becomes NaN and flows on
    if (ts.isCallExpression(node)) {
      const re = /^(Number|parseInt|parseFloat)$/
      const viaMap =
        ts.isPropertyAccessExpression(node.expression) &&
        node.expression.name.text === "map" &&
        node.arguments.length === 1 &&
        re.test(node.arguments[0].getText(sf))
      const direct = re.test(node.expression.getText(sf)) && node.arguments.length > 0
      if ((viaMap || direct) && !numberChecked(node)) {
        const e = viaMap ? text(node.expression.expression, sf) : text(node.arguments[0], sf)
        report(
          node,
          viaMap ? "medium" : "low",
          "unchecked-number",
          viaMap
            ? `check each parsed item: for (const n of ${label(e)}) assert.finite(n, "…")  (a malformed string gives NaN, then "NaN" written downstream)`
            : `assert.finite(${text(node, sf)}, "${label(e)} must be a number") if the string can be malformed; keep if NaN is handled next`
        )
      }
    }

    // a === "x" ? a : b === "y" ? c : d: anything else silently takes the last branch
    if (ts.isConditionalExpression(node) && !isElseBranch(node)) {
      const hit = literalCompare(node.condition)
      if (hit) {
        let chain = 1
        for (let c = node.whenFalse; ts.isConditionalExpression(c); c = c.whenFalse) chain++
        const ty = checker.getNonNullableType(checker.getTypeAtLocation(hit.subject))
        const open = ty.flags & (ts.TypeFlags.Any | ts.TypeFlags.Unknown)
        const closed = ty.isUnion() && ty.types.length >= 3 && ty.types.every((x) => x.isLiteral())
        if (open || closed || chain >= 2) {
          const e = text(hit.subject, sf)
          report(
            node,
            open ? "medium" : "low",
            "silent-ternary",
            `switch (${e}) with default: { const unreachable: never = ${e}; throw new Error(\`unexpected ${label(e)}: \${unreachable}\`) }  (a value outside the compared literals silently takes the last branch; keep if the last branch is the real default)`
          )
        }
      }
    }

    // record[key] typed as always present: a missing key gives undefined with no error
    if (
      ts.isElementAccessExpression(node) &&
      !node.questionDotToken &&
      !isNumberLiteral(node.argumentExpression) &&
      !ts.isStringLiteralLike(node.argumentExpression) &&
      !isAssignTarget(node)
    ) {
      const ot = checker.getNonNullableType(checker.getTypeAtLocation(node.expression))
      const info = checker.getIndexInfosOfType(ot).find((i) => i.keyType.flags & ts.TypeFlags.String)
      const rt = checker.getTypeAtLocation(node)
      const parts = rt.isUnion() ? rt.types : [rt]
      const mayBeUndefined = parts.some((x) => x.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Any))
      if (info && !checker.isArrayType(ot) && !checker.isTupleType(ot) && !mayBeUndefined) {
        const o = text(node.expression, sf)
        report(
          node,
          "low",
          "unchecked-index",
          `assert.hasKey(${o}, ${text(node.argumentExpression, sf)}, "unknown key") before reading; the type says the key is always there, the data may not`
        )
      }
    }

    // function f(x = 0): a missing required argument becomes a valid-looking value
    if (
      ts.isParameter(node) &&
      node.initializer &&
      isLiteralish(node.initializer) &&
      node.parent.body
    ) {
      const n = node.name.getText(sf)
      report(
        node,
        "low",
        "default-param",
        `if ${n} is required: drop the default and assert.notNil(${n}, "${n} is required")`
      )
    }

    ts.forEachChild(node, visit)
  }
  visit(sf)

  // comments stating an invariant inside a function: a rule nobody checks
  const bodies = []
  const collect = (n) => {
    if (ts.isFunctionLike(n) && n.body) bodies.push([n.body.getStart(sf), n.body.end])
    ts.forEachChild(n, collect)
  }
  collect(sf)
  const scanner = ts.createScanner(ts.ScriptTarget.Latest, false, sf.languageVariant, sf.text)
  for (let k = scanner.scan(); k !== ts.SyntaxKind.EndOfFileToken; k = scanner.scan()) {
    if (k !== ts.SyntaxKind.SingleLineCommentTrivia && k !== ts.SyntaxKind.MultiLineCommentTrivia)
      continue
    const pos = scanner.getTokenPos()
    const c = scanner.getTokenText()
    if (statesInvariant(c) && bodies.some(([a, b]) => pos > a && pos < b)) {
      const one = c.replace(/^\/[/*]+\s*|\s*\*\/$/g, "").replace(/\s+/g, " ")
      report(
        pos,
        "low",
        "comment-invariant",
        "turn the comment into the matching assert.* call (it can go stale, an assertion cannot)",
        one.length > 80 ? one.slice(0, 77) + "..." : one
      )
    }
  }
}

function isCheckCall(t) {
  return /^(assert\.\w+|check|Number\.(isFinite|isNaN|isInteger|isSafeInteger)|isNaN|isFinite)$/.test(t)
}

// the NaN of a parse is dealt with: checked in place, compared, or checked by a following statement
function numberChecked(node) {
  for (let p = node.parent; p && !ts.isFunctionLike(p); p = p.parent) {
    if (ts.isCallExpression(p) && isCheckCall(p.expression.getText())) return true
    if (ts.isBinaryExpression(p) && handledContext(node)) return true
  }
  if (handledContext(node)) return true
  // `const n = Number(s)` then `if (Number.isNaN(n))` / `assert.finite(n)` later in the block
  let decl = node.parent
  while (decl && !ts.isVariableDeclaration(decl) && !ts.isStatement(decl)) decl = decl.parent
  if (!decl || !ts.isVariableDeclaration(decl)) return false
  const stmt = decl.parent?.parent
  const list = stmt?.parent?.statements
  if (!list) return false
  const names = ts.isIdentifier(decl.name)
    ? [decl.name.text]
    : decl.name.elements.map((el) => el.name.getText())
  let seen = false
  for (const s of list.slice(list.indexOf(stmt) + 1)) {
    const v = (n) => {
      if (seen) return
      if (ts.isCallExpression(n) && isCheckCall(n.expression.getText())) {
        const args = n.arguments.map((a) => a.getText())
        if (names.some((x) => args.some((a) => new RegExp(`\\b${x}\\b`).test(a)))) seen = true
      }
      ts.forEachChild(n, v)
    }
    v(s)
  }
  return seen
}

function isElseBranch(n) {
  return ts.isConditionalExpression(n.parent) && n.parent.whenFalse === n
}

// `x === "lit"` / `x !== 3`: the subject being tested against a string or number literal
function literalCompare(cond) {
  cond = unwrap(cond)
  if (!ts.isBinaryExpression(cond)) return null
  const k = cond.operatorToken.kind
  if (
    ![
      ts.SyntaxKind.EqualsEqualsEqualsToken,
      ts.SyntaxKind.ExclamationEqualsEqualsToken,
      ts.SyntaxKind.EqualsEqualsToken,
      ts.SyntaxKind.ExclamationEqualsToken,
    ].includes(k)
  )
    return null
  const lit = (e) => ts.isStringLiteralLike(unwrap(e)) || ts.isNumericLiteral(unwrap(e))
  if (lit(cond.right) && !lit(cond.left)) return { subject: cond.left }
  if (lit(cond.left) && !lit(cond.right)) return { subject: cond.right }
  return null
}

function isAssignTarget(n) {
  const p = n.parent
  return (
    (ts.isBinaryExpression(p) &&
      p.left === n &&
      p.operatorToken.kind >= ts.SyntaxKind.FirstAssignment &&
      p.operatorToken.kind <= ts.SyntaxKind.LastAssignment) ||
    ts.isDeleteExpression(p) ||
    ((ts.isPrefixUnaryExpression(p) || ts.isPostfixUnaryExpression(p)) &&
      [ts.SyntaxKind.PlusPlusToken, ts.SyntaxKind.MinusMinusToken].includes(p.operator))
  )
}

// functions that need a second, logical analysis: any low or debatable ("keep if…") finding in them
function reviewList(all) {
  const map = new Map()
  for (const f of all) {
    if (f.severity !== "low" && !/\bkeep\b/.test(f.fix)) continue
    const key = `${f.file}:${f.fn.line}:${f.fn.name}`
    if (!map.has(key)) map.set(key, { file: f.file, line: f.fn.line, name: f.fn.name, rules: new Set() })
    map.get(key).rules.add(f.rule)
  }
  return [...map.values()].sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line)
}

function statesInvariant(comment) {
  return /\b(must|must not|should never|never be|always be|assumes?|guaranteed|invariant|doit|ne doit|jamais|toujours|suppose)\b/i.test(
    comment
  )
}

function isNumberLiteral(e) {
  e = unwrap(e)
  return ts.isNumericLiteral(e) || (ts.isPrefixUnaryExpression(e) && ts.isNumericLiteral(e.operand))
}

// ── helpers ──────────────────────────────────────────────────────────
function exitKind(stmt) {
  if (ts.isBlock(stmt)) {
    const real = stmt.statements.filter((s) => !isConsoleCall(s))
    if (real.length !== 1) return null
    stmt = real[0]
  }
  if (ts.isContinueStatement(stmt)) return "continue"
  if (!ts.isReturnStatement(stmt)) return null
  if (!stmt.expression || isNullOrUndefined(stmt.expression)) return "high"
  if (isEmptyish(stmt.expression)) return "medium"
  return null // returning a real value is a decision, not a silent exit
}

// `if (!s) return ""` / `if (!xs.length) return []`: an empty string or array mapped to the
// same empty value is a total function, not a hidden failure
function isEmptyPassthrough(ifNode) {
  const ret = unwrap(ifNode.thenStatement)
  const stmt = ts.isBlock(ret) ? ret.statements.find((s) => !isConsoleCall(s)) : ret
  if (!stmt || !ts.isReturnStatement(stmt)) return false
  // bare `return` in a void function: nothing to do on an empty list
  // (not on an empty string: `if (!id) return` hides a missing id)
  const value = stmt.expression && unwrap(stmt.expression)
  const wantString =
    !!value && (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value))
  const wantArray = !value || ts.isArrayLiteralExpression(value)
  if (value && !(wantString ? value.text === "" : wantArray && value.elements.length === 0))
    return false

  const cond = unwrap(ifNode.expression)
  let subject = null
  if (ts.isPrefixUnaryExpression(cond) && cond.operator === ts.SyntaxKind.ExclamationToken)
    subject = unwrap(cond.operand)
  else if (
    ts.isBinaryExpression(cond) &&
    (cond.operatorToken.kind === ts.SyntaxKind.EqualsEqualsEqualsToken ||
      cond.operatorToken.kind === ts.SyntaxKind.EqualsEqualsToken) &&
    ts.isNumericLiteral(cond.right) &&
    cond.right.text === "0"
  )
    subject = cond.left
  if (!subject) return false
  if (ts.isPropertyAccessExpression(subject) && subject.name.text === "length")
    subject = subject.expression
  const ty = checker.getNonNullableType(checker.getTypeAtLocation(subject))
  return (
    (wantString && !!(ty.flags & ts.TypeFlags.StringLike)) || (wantArray && checker.isArrayType(ty))
  )
}

// `if (n > 2) return`, `if (age < 18) return`: a business threshold, not a validity check
// (0 and 1 stay findings: `<= 0`, `< 1` are what "invalid" looks like)
function isBusinessThreshold(cond) {
  cond = unwrap(cond)
  if (!ts.isBinaryExpression(cond)) return false
  const rel = [
    ts.SyntaxKind.GreaterThanToken,
    ts.SyntaxKind.GreaterThanEqualsToken,
    ts.SyntaxKind.LessThanToken,
    ts.SyntaxKind.LessThanEqualsToken,
  ].includes(cond.operatorToken.kind)
  const lit = [cond.left, cond.right].map(unwrap).find(ts.isNumericLiteral)
  return rel && !!lit && lit.text !== "0" && lit.text !== "1"
}

// `if (!found) return null; …; return found`: the function's result is `found` or nothing
// (a lookup), so returning null is the answer, not a hidden failure
function returnsSubjectOrNil(ifNode) {
  const cond = unwrap(ifNode.expression)
  if (!ts.isPrefixUnaryExpression(cond) || cond.operator !== ts.SyntaxKind.ExclamationToken) return false
  const subject = unwrap(cond.operand)
  if (!ts.isIdentifier(subject)) return false
  if (exitKind(ifNode.thenStatement) !== "high") return false
  let fn = ifNode.parent
  while (fn && !ts.isFunctionLike(fn)) fn = fn.parent
  if (!fn?.body) return false
  let found = false
  const v = (n) => {
    if (found || (ts.isFunctionLike(n) && n !== fn)) return
    if (
      ts.isReturnStatement(n) &&
      n.expression &&
      ts.isIdentifier(unwrap(n.expression)) &&
      unwrap(n.expression).text === subject.text
    )
      found = true
    else ts.forEachChild(n, v)
  }
  v(fn.body)
  return found
}

// `if (ok) return; fail(...)` or `try { x() } catch { return }; fail(...)` is a success exit, not a silent one
function followedByFailure(stmt) {
  const list =
    stmt.parent &&
    (ts.isBlock(stmt.parent) ||
      ts.isSourceFile(stmt.parent) ||
      ts.isCaseClause(stmt.parent) ||
      ts.isDefaultClause(stmt.parent))
      ? stmt.parent.statements
      : null
  const next = list?.[list.indexOf(stmt) + 1]
  if (!next) return false
  if (ts.isThrowStatement(next)) return true
  const e = ts.isExpressionStatement(next)
    ? next.expression
    : ts.isReturnStatement(next)
      ? next.expression
      : null
  return (
    !!e && ts.isCallExpression(e) && !!(checker.getTypeAtLocation(e).flags & ts.TypeFlags.Never)
  )
}

function isSwallowBody(block) {
  if (containsThrow(block)) return false
  return block.statements.every(
    (s) =>
      isConsoleCall(s) || (ts.isReturnStatement(s) && (!s.expression || isEmptyish(s.expression)))
  )
}

function containsThrow(node) {
  let found = false
  const v = (n) => {
    if (found || ts.isFunctionLike(n)) return
    if (ts.isThrowStatement(n)) found = true
    else ts.forEachChild(n, v)
  }
  ts.forEachChild(node, v)
  return found
}

function isConsoleCall(s) {
  return (
    ts.isExpressionStatement(s) &&
    ts.isCallExpression(s.expression) &&
    /^console\.\w+$/.test(s.expression.expression.getText())
  )
}

function isNullOrUndefined(e) {
  return (
    e.kind === ts.SyntaxKind.NullKeyword ||
    (ts.isIdentifier(e) && e.text === "undefined") ||
    ts.isVoidExpression(e)
  )
}

// literals that read like "nothing": null, undefined, [], {}, false, "", 0, -1
function isEmptyish(e) {
  e = unwrap(e)
  return (
    isNullOrUndefined(e) ||
    e.kind === ts.SyntaxKind.FalseKeyword ||
    (ts.isArrayLiteralExpression(e) && e.elements.length === 0) ||
    (ts.isObjectLiteralExpression(e) && e.properties.length === 0) ||
    (ts.isStringLiteral(e) && e.text === "") ||
    (ts.isNoSubstitutionTemplateLiteral(e) && e.text === "") ||
    (ts.isNumericLiteral(e) && e.text === "0") ||
    (ts.isPrefixUnaryExpression(e) &&
      e.operator === ts.SyntaxKind.MinusToken &&
      ts.isNumericLiteral(e.operand) &&
      e.operand.text === "1")
  )
}

function isLiteralish(e) {
  e = unwrap(e)
  return (
    isEmptyish(e) ||
    ts.isStringLiteral(e) ||
    ts.isNumericLiteral(e) ||
    ts.isNoSubstitutionTemplateLiteral(e) ||
    e.kind === ts.SyntaxKind.TrueKeyword ||
    ts.isArrayLiteralExpression(e) ||
    ts.isObjectLiteralExpression(e)
  )
}

function unwrap(e) {
  while (ts.isParenthesizedExpression(e) || ts.isAsExpression(e) || ts.isSatisfiesExpression?.(e))
    e = e.expression
  return e
}

function isEnvAccess(n) {
  return (
    (ts.isPropertyAccessExpression(n) || ts.isElementAccessExpression(n)) &&
    n.expression.getText?.() === "process.env"
  )
}
function envName(n) {
  return ts.isPropertyAccessExpression(n)
    ? n.name.text
    : n.argumentExpression.getText().replace(/^["'`]|["'`]$/g, "")
}

// the code already decides what happens without the var:
// `if (process.env.X)`, `process.env.X ?? computed()`, `const x = process.env.X; if (!x) throw`
function isEnvHandled(n) {
  let c = n
  while (
    c.parent &&
    (ts.isParenthesizedExpression(c.parent) ||
      (ts.isPrefixUnaryExpression(c.parent) &&
        c.parent.operator === ts.SyntaxKind.ExclamationToken) ||
      (ts.isBinaryExpression(c.parent) &&
        (c.parent.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken ||
          c.parent.operatorToken.kind === ts.SyntaxKind.BarBarToken)))
  )
    c = c.parent
  if (ts.isIfStatement(c.parent) && c.parent.expression === c) return true
  if (ts.isConditionalExpression(c.parent) && c.parent.condition === c) return true

  const p = n.parent
  if (
    ts.isBinaryExpression(p) &&
    p.left === n &&
    (p.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken ||
      p.operatorToken.kind === ts.SyntaxKind.BarBarToken) &&
    !isLiteralish(unwrap(p.right))
  )
    return true

  if (ts.isVariableDeclaration(p) && ts.isIdentifier(p.name)) {
    const stmt = p.parent?.parent // VariableDeclarationList → VariableStatement
    const list = stmt?.parent?.statements
    const next = list?.[list.indexOf(stmt) + 1]
    if (
      next &&
      ts.isIfStatement(next) &&
      (ts.isThrowStatement(next.thenStatement) || containsThrow(next.thenStatement))
    ) {
      let mentioned = false
      const v = (m) => {
        if (ts.isIdentifier(m) && m.text === p.name.text) mentioned = true
        else ts.forEachChild(m, v)
      }
      v(next.expression)
      if (mentioned) return true
    }
    if (next && insideAssertStatement(next, p.name.text)) return true
  }
  return false
}

function insideAssertStatement(stmt, name) {
  return (
    ts.isExpressionStatement(stmt) &&
    ts.isCallExpression(stmt.expression) &&
    /^assert\.\w+$/.test(stmt.expression.expression.getText()) &&
    stmt.expression.arguments[0]?.getText() === name
  )
}

function insideAssert(n) {
  for (let p = n.parent; p && !ts.isFunctionLike(p); p = p.parent) {
    if (ts.isCallExpression(p) && /^(assert\.\w+|check)$/.test(p.expression.getText())) return true
  }
  return false
}

function isConstOrTopType(t) {
  if (ts.isTypeReferenceNode(t) && t.typeName.getText() === "const") return true
  return t.kind === ts.SyntaxKind.AnyKeyword || t.kind === ts.SyntaxKind.UnknownKeyword
}

function isNilFilter(fn) {
  if (ts.isIdentifier(fn)) return fn.text === "Boolean"
  if (!(ts.isArrowFunction(fn) || ts.isFunctionExpression(fn)) || fn.parameters.length !== 1)
    return false
  const p = fn.parameters[0].name.getText()
  let body = fn.body
  if (ts.isBlock(body)) {
    if (
      body.statements.length !== 1 ||
      !ts.isReturnStatement(body.statements[0]) ||
      !body.statements[0].expression
    )
      return false
    body = body.statements[0].expression
  }
  body = unwrap(body)
  if (ts.isIdentifier(body)) return body.text === p
  if (ts.isPrefixUnaryExpression(body) && body.operator === ts.SyntaxKind.ExclamationToken) {
    const inner = unwrap(body.operand)
    return (
      ts.isPrefixUnaryExpression(inner) &&
      inner.operator === ts.SyntaxKind.ExclamationToken &&
      inner.operand.getText() === p
    )
  }
  if (ts.isBinaryExpression(body)) {
    const op = body.operatorToken.kind
    const neq =
      op === ts.SyntaxKind.ExclamationEqualsToken ||
      op === ts.SyntaxKind.ExclamationEqualsEqualsToken
    return neq && body.left.getText() === p && isNullOrUndefined(body.right)
  }
  return false
}

function isSilentDefault(clause) {
  return clause.statements.every(
    (s) =>
      ts.isBreakStatement(s) ||
      isConsoleCall(s) ||
      (ts.isReturnStatement(s) && (!s.expression || isEmptyish(s.expression)))
  )
}

// u?.a?.b → u : the value that must exist
function chainRoot(e) {
  let root = null
  for (
    let cur = unwrap(e);
    ts.isPropertyAccessExpression(cur) ||
    ts.isElementAccessExpression(cur) ||
    ts.isCallExpression(cur);
    cur = cur.expression
  ) {
    if (cur.questionDotToken) root = cur.expression
  }
  return root ?? e
}

function chainTop(n) {
  let cur = n
  while (
    cur.parent &&
    (ts.isPropertyAccessExpression(cur.parent) ||
      ts.isElementAccessExpression(cur.parent) ||
      ts.isCallExpression(cur.parent) ||
      ts.isNonNullExpression(cur.parent)) &&
    cur.parent.expression === cur
  )
    cur = cur.parent
  return cur
}

// the undefined produced by ?. is explicitly dealt with here
function handledContext(e) {
  let p = e.parent
  while (p && ts.isParenthesizedExpression(p)) p = p.parent
  if (!p) return false
  if (ts.isBinaryExpression(p)) {
    const k = p.operatorToken.kind
    return [
      ts.SyntaxKind.QuestionQuestionToken,
      ts.SyntaxKind.BarBarToken,
      ts.SyntaxKind.AmpersandAmpersandToken,
      ts.SyntaxKind.EqualsEqualsToken,
      ts.SyntaxKind.EqualsEqualsEqualsToken,
      ts.SyntaxKind.ExclamationEqualsToken,
      ts.SyntaxKind.ExclamationEqualsEqualsToken,
      ts.SyntaxKind.LessThanToken,
      ts.SyntaxKind.LessThanEqualsToken,
      ts.SyntaxKind.GreaterThanToken,
      ts.SyntaxKind.GreaterThanEqualsToken,
    ].includes(k)
  }
  if (ts.isPrefixUnaryExpression(p) || ts.isTypeOfExpression(p)) return true
  if (
    (ts.isIfStatement(p) || ts.isWhileStatement(p) || ts.isConditionalExpression(p)) &&
    p.expression === e
  )
    return true
  if (ts.isConditionalExpression(p) && p.condition === e) return true
  if (ts.isExpressionStatement(p)) return true // fire-and-forget call: a?.()
  if (ts.isCallExpression(p) && insideAssert(e)) return true
  return false
}

function isNullable(e) {
  const t = checker.getTypeAtLocation(e)
  const parts = t.isUnion() ? t.types : [t]
  return parts.some(
    (x) => x.flags & (ts.TypeFlags.Null | ts.TypeFlags.Undefined | ts.TypeFlags.Void)
  )
}

function mentionsOptionalParam(e) {
  let hit = false
  const v = (n) => {
    if (hit) return
    if (ts.isIdentifier(n)) {
      const d = checker.getSymbolAtLocation(n)?.valueDeclaration
      if (d && ts.isParameter(d) && (d.questionToken || d.initializer)) hit = true
    }
    ts.forEachChild(n, v)
  }
  v(e)
  return hit
}

// condition that triggers an exit → the assertion that states the opposite
function suggest(cond, sf) {
  cond = unwrap(cond)
  const t = (n) => text(n, sf)
  const msg = (n, what) => `"${label(t(n))} ${what}"`

  if (ts.isBinaryExpression(cond) && cond.operatorToken.kind === ts.SyntaxKind.BarBarToken) {
    const a = suggest(cond.left, sf),
      b = suggest(cond.right, sf)
    return a && b ? `${a}; ${b}` : null
  }
  if (ts.isPrefixUnaryExpression(cond) && cond.operator === ts.SyntaxKind.ExclamationToken) {
    const e = unwrap(cond.operand)
    if (ts.isPropertyAccessExpression(e) && e.name.text === "length")
      return `assert.notEmpty(${t(e.expression)}, ${msg(e.expression, "must not be empty")})`
    if (ts.isCallExpression(e)) {
      const callee = t(e.expression),
        arg = e.arguments[0] && t(e.arguments[0])
      const map = {
        "Array.isArray": "array",
        "Number.isFinite": "finite",
        "Number.isInteger": "integer",
      }
      if (map[callee])
        return `assert.${map[callee]}(${arg}, ${msg(e.arguments[0], `must be ${map[callee] === "array" ? "an array" : map[callee]}`)})`
    }
    if (ts.isBinaryExpression(e) && e.operatorToken.kind === ts.SyntaxKind.InstanceOfKeyword)
      return `assert.instanceOf(${t(e.left)}, ${t(e.right)}, ${msg(e.left, `must be a ${t(e.right)}`)})`
    if (ts.isBinaryExpression(e) && e.operatorToken.kind === ts.SyntaxKind.InKeyword)
      return `assert.hasKey(${t(e.right)}, ${t(e.left)}, ${msg(e.right, `must have key ${t(e.left)}`)})`
    const ty = checker.getTypeAtLocation(e)
    if (ty.flags & ts.TypeFlags.BooleanLike)
      return `assert.equal(${t(e)}, true, ${msg(e, "must hold")})`
    const fn = ty.flags & ts.TypeFlags.StringLike ? "notEmpty" : "notNil"
    return `assert.${fn}(${t(e)}, ${msg(e, "is required")})`
  }
  if (ts.isCallExpression(cond) && t(cond.expression) === "Number.isNaN")
    return `assert.finite(${t(cond.arguments[0])}, ${msg(cond.arguments[0], "must be a finite number")})`
  if (!ts.isBinaryExpression(cond)) return null

  const k = cond.operatorToken.kind,
    L = cond.left,
    R = cond.right
  const eq = k === ts.SyntaxKind.EqualsEqualsToken || k === ts.SyntaxKind.EqualsEqualsEqualsToken
  const neq =
    k === ts.SyntaxKind.ExclamationEqualsToken || k === ts.SyntaxKind.ExclamationEqualsEqualsToken

  if (eq && isNullOrUndefined(R)) return `assert.notNil(${t(L)}, ${msg(L, "is required")})`
  if (eq && isNullOrUndefined(L)) return `assert.notNil(${t(R)}, ${msg(R, "is required")})`
  if (
    ts.isPropertyAccessExpression(L) &&
    L.name.text === "length" &&
    ts.isNumericLiteral(R) &&
    ((eq && R.text === "0") ||
      (k === ts.SyntaxKind.LessThanToken && R.text === "1") ||
      (k === ts.SyntaxKind.LessThanEqualsToken && R.text === "0"))
  )
    return `assert.notEmpty(${t(L.expression)}, ${msg(L.expression, "must not be empty")})`
  if (neq && ts.isTypeOfExpression(L) && ts.isStringLiteral(R)) {
    const map = {
      string: "string",
      number: "number",
      boolean: "boolean",
      object: "object",
      function: "func",
    }
    if (map[R.text])
      return `assert.${map[R.text]}(${t(L.expression)}, ${msg(L.expression, `must be a ${R.text}`)})`
  }
  const zero = ts.isNumericLiteral(R) && R.text === "0"
  switch (k) {
    case ts.SyntaxKind.LessThanEqualsToken:
      return zero
        ? `assert.positive(${t(L)}, ${msg(L, "must be positive")})`
        : `assert.greater(${t(L)}, ${t(R)}, ${msg(L, `must be > ${t(R)}`)})`
    case ts.SyntaxKind.LessThanToken:
      return `assert.greaterOrEqual(${t(L)}, ${t(R)}, ${msg(L, `must be >= ${t(R)}`)})`
    case ts.SyntaxKind.GreaterThanToken:
      return `assert.lessOrEqual(${t(L)}, ${t(R)}, ${msg(L, `must be <= ${t(R)}`)})`
    case ts.SyntaxKind.GreaterThanEqualsToken:
      return `assert.less(${t(L)}, ${t(R)}, ${msg(L, `must be < ${t(R)}`)})`
  }
  if (neq) return `assert.equal(${t(L)}, ${t(R)}, ${msg(L, `must be ${t(R).replace(/"/g, "'")}`)})`
  return null // `if (a === b) return` is usually a business shortcut, not an invalid state
}

function text(n, sf) {
  return n.getText(sf).replace(/\s+/g, " ")
}
function snippet(n, sf) {
  if (ts.isCatchClause(n)) return `catch (${n.variableDeclaration?.name.getText(sf) ?? ""}) { … }`
  const s = text(n, sf)
  return s.length > 80 ? s.slice(0, 77) + "..." : s
}
function label(expr) {
  return expr.replace(/^this\./, "").replace(/"/g, "'")
}

// ── git diff → Map<absFile, (line) => boolean> ─────────────────────────
function changedLines(ref) {
  const git = (...a) => execFileSync("git", a, { cwd, encoding: "utf8", maxBuffer: 64 << 20 })
  const root = git("rev-parse", "--show-toplevel").trim()
  const map = new Map()
  let cur = null
  for (const l of git("diff", "-U0", "--no-color", ref).split("\n")) {
    if (l.startsWith("+++ ")) {
      cur = l === "+++ /dev/null" ? null : path.join(root, l.slice(6))
      if (cur) map.set(cur, [])
    }
    const m = cur && /^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/.exec(l)
    if (m) map.get(cur).push([+m[1], +m[1] + (m[2] === undefined ? 1 : +m[2]) - 1])
  }
  const out = new Map()
  for (const [f, ranges] of map)
    out.set(f, (line) => ranges.some(([a, b]) => line >= a && line <= b))
  for (const f of git("ls-files", "--others", "--exclude-standard").split("\n").filter(Boolean))
    out.set(path.join(root, f), () => true)
  return out
}

function loadTypescript() {
  for (const base of [path.join(cwd, "package.json"), import.meta.url]) {
    try {
      return createRequire(base)("typescript")
    } catch {} // not there: try the next location
  }
  console.error(
    "assertcheck scan: `typescript` not found. Install it in the project: npm i -D typescript"
  )
  process.exit(2)
}
