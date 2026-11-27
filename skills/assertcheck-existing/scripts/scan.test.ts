// Every `// expect: <rule>` line in fixture.ts is reported, and nothing else.
import { expect, test } from "bun:test"
import { execFileSync } from "node:child_process"
import { mkdirSync, mkdtempSync, readFileSync, symlinkSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"

test("scan reports exactly the expected findings", () => {
  const dir = import.meta.dir
  const fixture = join(dir, "fixture.ts")
  let out = ""
  try {
    execFileSync("node", [join(dir, "scan.mjs"), fixture, "--json", "--min", "low"], {
      encoding: "utf8",
    })
  } catch (e: any) {
    out = e.stdout // exit 1 = findings present
  }
  const got = JSON.parse(out)
    .map((f: any) => `${f.line} ${f.rule}`)
    .sort()
  const want = readFileSync(fixture, "utf8")
    .split("\n")
    .flatMap((l, i) => [...l.matchAll(/expect: ([\w-]+)/g)].map((m) => `${i + 1} ${m[1]}`))
    .sort()
  expect(got).toEqual(want)
})

test("empty in, empty out is hidden at the default level", () => {
  const dir = import.meta.dir
  let out = "[]"
  try {
    out = execFileSync("node", [join(dir, "scan.mjs"), join(dir, "fixture.ts"), "--json"], {
      encoding: "utf8",
    })
  } catch (e: any) {
    out = e.stdout
  }
  const src = readFileSync(join(dir, "fixture.ts"), "utf8").split("\n")
  const lines = JSON.parse(out).map((f: any) => src[f.line - 1].trim())
  expect(lines).not.toContain('if (!digits) return "" // expect: silent-exit')
  expect(lines.some((l: string) => l.startsWith("if (xs.length === 0)"))).toBe(true)
  expect(lines.some((l: string) => l.startsWith("if (!user)"))).toBe(true)
})

test("each hand-written check suggests the matching assertion", () => {
  const cases: [string, string][] = [
    ["!arr.includes(3)", "includes"],
    ["!arr.every(f)", "all"],
    ["!arr.some(f)", "any"],
    ["arr.some(f)", "none"],
    ["arr.length !== 4", "len"],
    ["arr.length < 3", "longerThan"],
    ["arr.length > 9", "shorterThan"],
    ["new Set(arr).size !== arr.length", "unique"],
    ["new Set(items.map((i) => i.id)).size !== items.length", "uniqueBy"],
    ["!Object.hasOwn(o, k)", "hasKey"],
    ["!o.hasOwnProperty(k)", "hasKey"],
    ["v < 0 || v > 100", "withinRange"],
    ["v !== 0", "zero"],
    ["v >= 0", "negative"],
    ["JSON.stringify(a) !== JSON.stringify(b)", "deepEqual"],
    ["!Number.isSafeInteger(v)", "integer"],
    ["arr.filter(f).length !== 1", "one"],
    ["arr.filter(f).length !== 3", "count"],
    ["arr[0] !== 5", "first"],
    ["arr[arr.length - 1] !== 5", "last"],
    ["!arr.every((x) => other.includes(x))", "containsAll"],
    ["arr.some((x) => other.includes(x))", "containsNone"],
    ["arr.some((x) => x == null)", "noNils"],
    ["!arr.every((x) => x instanceof Date)", "allInstanceOf"],
    ["!keys.every((x) => x in o)", "hasKeys"],
    ["!Object.values(o).every(f)", "allValuesMatch"],
    ["Object.values(o).some((x) => x == null)", "noNilValues"],
  ]
  const src = [
    "declare const arr: number[], other: number[], keys: string[], items: { id: string }[]",
    "declare const o: Record<string, number>, k: string, v: number, a: number, b: number",
    "declare const f: (x: number) => boolean",
    "export function g() {",
    ...cases.map(([c]) => `  if (${c}) return`),
    "}",
  ].join("\n")
  const file = join(mkdtempSync(join(tmpdir(), "assertcheck-")), "s.ts")
  writeFileSync(file, src)
  let out = ""
  try {
    execFileSync("node", [join(import.meta.dir, "scan.mjs"), file, "--json", "--min", "low"], { encoding: "utf8" })
  } catch (e: any) {
    out = e.stdout
  }
  const got = JSON.parse(out)
    .sort((x: any, y: any) => x.line - y.line)
    .map((f: any) => f.fix.split("(")[0].replace("assert.", ""))
  expect(got).toEqual(cases.map(([, name]) => name))
})

test("a try that only awaits one promise suggests assert.resolves", () => {
  const file = join(mkdtempSync(join(tmpdir(), "assertcheck-")), "r.ts")
  writeFileSync(file, "declare const p: Promise<number>\nexport async function g() {\n  try {\n    return await p\n  } catch {\n    return null\n  }\n}\n")
  let out = ""
  try {
    execFileSync("node", [join(import.meta.dir, "scan.mjs"), file, "--json"], { encoding: "utf8" })
  } catch (e: any) {
    out = e.stdout
  }
  expect(JSON.parse(out)[0].fix).toContain("assert.resolves(p")
})

test("a settled decision hides its finding, keyed on the function", () => {
  const dir = mkdtempSync(join(tmpdir(), "assertcheck-"))
  mkdirSync(join(dir, ".assertcheck"))
  symlinkSync(join(import.meta.dir, "../../../node_modules"), join(dir, "node_modules"))
  writeFileSync(join(dir, "a.ts"), "export function hook(x: string | null) {\n  if (!x) return\n}\n")
  const run = () => {
    try {
      return execFileSync("node", [join(import.meta.dir, "scan.mjs"), "a.ts", "--json"], { cwd: dir, encoding: "utf8" })
    } catch (e: any) {
      return e.stdout
    }
  }
  expect(JSON.parse(run())).toHaveLength(1)
  writeFileSync(join(dir, ".assertcheck", "decisions.md"), "- a.ts hook silent-exit — a hook must never block the commit\n")
  expect(JSON.parse(run())).toHaveLength(0)
  writeFileSync(join(dir, ".assertcheck", "decisions.md"), "- a.ts hook silent-exit\n")
  expect(JSON.parse(run())).toHaveLength(1)
})
