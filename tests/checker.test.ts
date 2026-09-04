import { describe, it, expect } from "bun:test"
import { check, Checker, ArrayChecker, ObjectChecker, AssertionError } from "./index.shim.ts"

describe("check()", () => {
  it("dispatches on value shape", () => {
    expect(check([1])).toBeInstanceOf(ArrayChecker)
    expect(check({ a: 1 })).toBeInstanceOf(ObjectChecker)
    expect(check(1)).toBeInstanceOf(Checker)
    expect(check(new Map())).toBeInstanceOf(Checker)
  })

  it("object chain returns the same checker and throws on first failure", () => {
    const c = check({ host: "h", port: 1, pool: { max: 10 } })
    expect(c.notEmpty().hasKey("host").hasKeys(["port"]).noNilValues().dig("pool.max", 10)).toBe(c)
    expect(c.containsSubset({ port: 1 }).allValuesMatch((v) => v != null)).toBe(c)
    expect(() => c.hasOnlyKeys(["host"], "unexpected keys")).toThrow(AssertionError)
    expect(() => c.hasExactKeys(["host"])).toThrow(AssertionError)
    expect(() => c.deepEqual({ host: "x", port: 1, pool: { max: 10 } })).toThrow(AssertionError)
  })

  it("array chain returns the same checker and throws on first failure", () => {
    const c = check([{ id: 1 }, { id: 2 }])
    expect(
      c
        .notEmpty()
        .noNils()
        .uniqueBy("id")
        .all((u) => u.id > 0)
        .len(2)
    ).toBe(c)
    expect(() => c.len(3, "wrong size")).toThrow(AssertionError)
  })
})
