// Every `// expect: <rule>` line in fixture.ts is reported, and nothing else.
import { expect, test } from "bun:test"
import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
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
