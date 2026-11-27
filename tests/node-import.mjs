import { test } from "node:test"
import { strict as nodeAssert } from "node:assert"
import { createRequire } from "node:module"
import { assert, check, AssertionError } from "../dist/index.js"

test("Node ESM imports the built package and preserves assertions", () => {
  assert.deepEqual({ version: 1 }, { version: 1 }, "deep equality")
  check([1, 2]).notEmpty()
  nodeAssert.throws(() => assert.equal(1, 2, "always active"), AssertionError)
})

test("Node CommonJS imports the built package", () => {
  const require = createRequire(import.meta.url)
  const common = require("../dist/index.cjs")
  common.assert.equal(1, 1, "CommonJS equality")
  nodeAssert.throws(() => common.assert.equal(1, 2), common.AssertionError)
})

// npm exécute automatiquement le hook « publish », même pendant un dry-run.
test("release command is not a recursive npm lifecycle hook", async () => {
  const { readFile } = await import("node:fs/promises")
  const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"))
  nodeAssert.equal(pkg.scripts.publish, undefined)
  nodeAssert.equal(typeof pkg.scripts["release:all"], "string")
})
