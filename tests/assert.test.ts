/**
 * @file assert.test.ts
 *
 * Test suite for @assertcheck/core.
 * Runs with `bun test`.
 */

import { describe, it, expect, beforeEach, afterEach } from "bun:test"
import { assert, AssertionError, modeAssertIn, setAssertMode, getAssertMode } from "../src/index.ts"

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const shouldThrow = (fn: () => void): AssertionError => {
  let caught: unknown
  try {
    fn()
  } catch (e) {
    caught = e
  }
  expect(caught).toBeInstanceOf(AssertionError)
  return caught as AssertionError
}

const shouldPass = (fn: () => void): void => {
  expect(fn).not.toThrow()
}

// ─────────────────────────────────────────────────────────────────────────────
// MODE
// ─────────────────────────────────────────────────────────────────────────────

describe("mode", () => {
  let saved: ReturnType<typeof getAssertMode>

  // Always restore after each test so failures don't bleed between suites
  beforeEach(() => {
    saved = getAssertMode()
  })
  afterEach(() => {
    setAssertMode(saved)
  })

  it("default is 'enabled' — no configuration needed", () => {
    setAssertMode("enabled") // reset to default
    expect(getAssertMode()).toBe("enabled")
    shouldThrow(() => assert.equal(1, 2))
  })

  it("disabled — no throw on failure", () => {
    setAssertMode("disabled")
    shouldPass(() => assert.equal(1, 2))
  })

  it("warn — no throw, failure is observed", () => {
    setAssertMode("warn")
    shouldPass(() => assert.equal(1, 2))
  })

  it("enabled — throws AssertionError on failure", () => {
    setAssertMode("enabled")
    shouldThrow(() => assert.equal(1, 2))
  })

  describe("modeAssertIn", () => {
    const originalNodeEnv = process.env["NODE_ENV"]

    afterEach(() => {
      // Restore NODE_ENV after each sub-test
      if (originalNodeEnv === undefined) {
        delete process.env["NODE_ENV"]
      } else {
        process.env["NODE_ENV"] = originalNodeEnv
      }
      setAssertMode("enabled") // back to default
    })

    it("applies mode when NODE_ENV matches 'prod' alias", () => {
      process.env["NODE_ENV"] = "production"
      modeAssertIn("prod", "warn")
      expect(getAssertMode()).toBe("warn")
    })

    it("applies mode when NODE_ENV matches 'prod' short alias", () => {
      process.env["NODE_ENV"] = "prod"
      modeAssertIn("prod", "disabled")
      expect(getAssertMode()).toBe("disabled")
    })

    it("does NOT apply mode when NODE_ENV does not match", () => {
      process.env["NODE_ENV"] = "development"
      modeAssertIn("prod", "disabled")
      // mode must stay unchanged — still "enabled"
      expect(getAssertMode()).toBe("enabled")
    })

    it("applies mode for 'dev' when NODE_ENV=development", () => {
      process.env["NODE_ENV"] = "development"
      modeAssertIn("dev", "disabled")
      expect(getAssertMode()).toBe("disabled")
    })

    it("applies mode for 'dev' short alias", () => {
      process.env["NODE_ENV"] = "dev"
      modeAssertIn("dev", "warn")
      expect(getAssertMode()).toBe("warn")
    })

    it("applies mode for 'test'", () => {
      process.env["NODE_ENV"] = "test"
      modeAssertIn("test", "disabled")
      expect(getAssertMode()).toBe("disabled")
    })

    it("applies mode for 'staging'", () => {
      process.env["NODE_ENV"] = "staging"
      modeAssertIn("staging", "warn")
      expect(getAssertMode()).toBe("warn")
    })

    it("applies mode for 'stage' alias", () => {
      process.env["NODE_ENV"] = "stage"
      modeAssertIn("staging", "warn")
      expect(getAssertMode()).toBe("warn")
    })

    it("applies mode for 'ci'", () => {
      process.env["NODE_ENV"] = "ci"
      modeAssertIn("ci", "disabled")
      expect(getAssertMode()).toBe("disabled")
    })

    it("multiple calls — only matching env takes effect", () => {
      process.env["NODE_ENV"] = "production"
      modeAssertIn("prod", "warn") // ← matches
      modeAssertIn("staging", "disabled") // ← does not match
      modeAssertIn("dev", "disabled") // ← does not match
      expect(getAssertMode()).toBe("warn")
    })

    it("multiple calls — last matching env wins", () => {
      process.env["NODE_ENV"] = "production"
      modeAssertIn("prod", "warn")
      modeAssertIn("prod", "disabled") // same env, last call wins
      expect(getAssertMode()).toBe("disabled")
    })
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// EXISTENCE
// ─────────────────────────────────────────────────────────────────────────────

describe("nil / notNil / empty / notEmpty", () => {
  it("nil — passes for null", () => shouldPass(() => assert.nil(null)))
  it("nil — passes for undefined", () => shouldPass(() => assert.nil(undefined)))
  it("nil — throws for 0", () => shouldThrow(() => assert.nil(0)))
  it("nil — throws for ''", () => shouldThrow(() => assert.nil("")))

  it("notNil — passes for non-null", () => shouldPass(() => assert.notNil(0)))
  it("notNil — throws for null", () => shouldThrow(() => assert.notNil(null)))

  it("empty — passes for []", () => shouldPass(() => assert.empty([])))
  it("empty — passes for ''", () => shouldPass(() => assert.empty("")))
  it("empty — throws for [1]", () => shouldThrow(() => assert.empty([1])))

  it("notEmpty — passes for [1]", () => shouldPass(() => assert.notEmpty([1])))
  it("notEmpty — throws for []", () => shouldThrow(() => assert.notEmpty([])))
})

// ─────────────────────────────────────────────────────────────────────────────
// TYPE GUARDS
// ─────────────────────────────────────────────────────────────────────────────

describe("type guards", () => {
  it("string — passes", () => shouldPass(() => assert.string("ok")))
  it("string — throws", () => shouldThrow(() => assert.string(1)))
  it("number — passes", () => shouldPass(() => assert.number(1)))
  it("integer — passes", () => shouldPass(() => assert.integer(2)))
  it("integer — throws float", () => shouldThrow(() => assert.integer(1.5)))
  it("finite — throws NaN", () => shouldThrow(() => assert.finite(NaN)))
  it("finite — throws Infinity", () => shouldThrow(() => assert.finite(Infinity)))
  it("boolean — passes", () => shouldPass(() => assert.boolean(true)))
  it("array — passes", () => shouldPass(() => assert.array([])))
  it("array — throws", () => shouldThrow(() => assert.array({})))
  it("object — passes", () => shouldPass(() => assert.object({})))
  it("object — throws array", () => shouldThrow(() => assert.object([])))
  it("func — passes", () => shouldPass(() => assert.func(() => {})))

  it("instanceOf — passes", () => {
    class Foo {}
    shouldPass(() => assert.instanceOf(new Foo(), Foo))
  })
  it("instanceOf — throws", () => {
    class Foo {}
    class Bar {}
    shouldThrow(() => assert.instanceOf(new Foo(), Bar))
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// EQUALITY
// ─────────────────────────────────────────────────────────────────────────────

describe("equal / deepEqual", () => {
  it("equal — passes on ===", () => shouldPass(() => assert.equal(1, 1)))
  it("equal — throws on !==", () => {
    const err = shouldThrow(() => assert.equal(1, 2))
    expect(err.assertion).toBe("equal")
    expect(err.actual).toBe(1)
    expect(err.expected).toBe(2)
  })

  it("deepEqual — passes on deep match", () =>
    shouldPass(() => assert.deepEqual({ a: 1 }, { a: 1 })))

  it("deepEqual — throws on deep mismatch", () => {
    const err = shouldThrow(() => assert.deepEqual({ a: 1 }, { a: 2 }))
    expect(err.assertion).toBe("deepEqual")
  })

  it("deepEqual — message includes diff", () => {
    const err = shouldThrow(() => assert.deepEqual({ status: "paid" }, { status: "pending" }))
    expect(err.message).toContain("status")
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// NUMERICS
// ─────────────────────────────────────────────────────────────────────────────

describe("numerics", () => {
  it("positive — passes", () => shouldPass(() => assert.positive(1)))
  it("positive — throws 0", () => shouldThrow(() => assert.positive(0)))
  it("positive — throws negative", () => shouldThrow(() => assert.positive(-1)))
  it("negative — passes", () => shouldPass(() => assert.negative(-1)))
  it("zero — passes", () => shouldPass(() => assert.zero(0)))
  it("zero — throws", () => shouldThrow(() => assert.zero(1)))
  it("greater — passes", () => shouldPass(() => assert.greater(2, 1)))
  it("greater — throws equal", () => shouldThrow(() => assert.greater(1, 1)))
  it("greaterOrEqual — passes equal", () => shouldPass(() => assert.greaterOrEqual(1, 1)))
  it("less — passes", () => shouldPass(() => assert.less(1, 2)))
  it("lessOrEqual — passes equal", () => shouldPass(() => assert.lessOrEqual(1, 1)))
  it("withinRange — passes", () => shouldPass(() => assert.withinRange(5, 0, 10)))
  it("withinRange — throws below", () => shouldThrow(() => assert.withinRange(-1, 0, 10)))
  it("withinRange — throws above", () => shouldThrow(() => assert.withinRange(11, 0, 10)))
  it("inDelta — passes", () => shouldPass(() => assert.inDelta(1.001, 1.0, 0.01)))
  it("inDelta — throws", () => shouldThrow(() => assert.inDelta(1.1, 1.0, 0.01)))

  it("greaterOrEqual — message includes shortfall", () => {
    const err = shouldThrow(() => assert.greaterOrEqual(3, 10, "balance check"))
    expect(err.message).toContain("shortfall")
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// ARRAYS
// ─────────────────────────────────────────────────────────────────────────────

describe("arrays", () => {
  it("len — passes", () => shouldPass(() => assert.len([1, 2, 3], 3)))
  it("len — throws", () => shouldThrow(() => assert.len([1, 2], 3)))
  it("longerThan — passes", () => shouldPass(() => assert.longerThan([1, 2], 1)))
  it("longerThan — throws", () => shouldThrow(() => assert.longerThan([1], 1)))
  it("shorterThan — passes", () => shouldPass(() => assert.shorterThan([1], 3)))
  it("includes — passes", () => shouldPass(() => assert.includes([1, 2, 3], 2)))
  it("includes — throws", () => shouldThrow(() => assert.includes([1, 2, 3], 4)))

  it("all — passes", () => shouldPass(() => assert.all([2, 4, 6], (n) => n % 2 === 0)))
  it("all — throws with index", () => {
    const err = shouldThrow(() => assert.all([2, 3, 4], (n) => n % 2 === 0))
    expect(err.message).toContain("index")
    expect(err.message).toContain("1")
  })

  it("any — passes", () => shouldPass(() => assert.any([1, 2, 3], (n) => n === 2)))
  it("any — throws", () => shouldThrow(() => assert.any([1, 3, 5], (n) => n % 2 === 0)))
  it("none — passes", () => shouldPass(() => assert.none([1, 3, 5], (n) => n % 2 === 0)))
  it("none — throws", () => shouldThrow(() => assert.none([1, 2, 3], (n) => n === 2)))
  it("one — passes", () => shouldPass(() => assert.one([1, 2, 3], (n) => n === 2)))
  it("one — throws (two)", () => shouldThrow(() => assert.one([2, 2, 3], (n) => n === 2)))
  it("count — passes", () => shouldPass(() => assert.count([1, 2, 3, 4], (n) => n % 2 === 0, 2)))

  it("containsAll — passes", () => shouldPass(() => assert.containsAll([1, 2, 3], [1, 2])))
  it("containsAll — throws", () => shouldThrow(() => assert.containsAll([1, 2], [1, 2, 3])))
  it("containsNone — passes", () => shouldPass(() => assert.containsNone([1, 2, 3], [4, 5])))
  it("containsNone — throws", () => shouldThrow(() => assert.containsNone([1, 2, 3], [3, 4])))

  it("elementsMatch — passes (different order)", () =>
    shouldPass(() => assert.elementsMatch([3, 1, 2], [1, 2, 3])))
  it("elementsMatch — throws", () => shouldThrow(() => assert.elementsMatch([1, 2], [1, 3])))

  it("unique — passes", () => shouldPass(() => assert.unique([1, 2, 3])))
  it("unique — throws", () => {
    const err = shouldThrow(() => assert.unique([1, 2, 2, 3]))
    expect(err.message).toContain("duplicate")
  })

  it("uniqueBy — passes", () => shouldPass(() => assert.uniqueBy([{ id: 1 }, { id: 2 }], "id")))
  it("uniqueBy — throws", () => shouldThrow(() => assert.uniqueBy([{ id: 1 }, { id: 1 }], "id")))

  it("increasing — passes", () => shouldPass(() => assert.increasing([1, 2, 3])))
  it("increasing — throws equal", () => shouldThrow(() => assert.increasing([1, 1, 2])))
  it("nonDecreasing — passes equal", () => shouldPass(() => assert.nonDecreasing([1, 1, 2])))

  it("sortedBy — passes", () =>
    shouldPass(() => assert.sortedBy([{ n: 1 }, { n: 2 }, { n: 3 }], "n")))
  it("sortedBy — throws", () => shouldThrow(() => assert.sortedBy([{ n: 3 }, { n: 1 }], "n")))

  it("first — passes", () => shouldPass(() => assert.first([1, 2, 3], 1)))
  it("first — throws", () => shouldThrow(() => assert.first([1, 2, 3], 2)))
  it("last — passes", () => shouldPass(() => assert.last([1, 2, 3], 3)))

  it("sumBy — passes", () => shouldPass(() => assert.sumBy([{ v: 1 }, { v: 2 }, { v: 3 }], "v", 6)))
  it("sumBy — throws", () => shouldThrow(() => assert.sumBy([{ v: 1 }, { v: 2 }], "v", 10)))

  it("noNils — passes", () => shouldPass(() => assert.noNils([1, 2, 3])))
  it("noNils — throws", () => {
    const err = shouldThrow(() => assert.noNils([1, null, 3]))
    expect(err.message).toContain("index")
  })

  it("flat — passes", () => shouldPass(() => assert.flat([1, 2, 3])))
  it("flat — throws", () => shouldThrow(() => assert.flat([[1], 2, 3])))

  it("partition — passes", () =>
    shouldPass(() => assert.partition([1, 2, 3, 4], (n) => n % 2 === 0, 2, 2)))
  it("partition — throws", () =>
    shouldThrow(() => assert.partition([1, 2, 3, 4], (n) => n % 2 === 0, 3, 1)))

  it("zippedWith — passes", () =>
    shouldPass(() => assert.zippedWith([1, 2], [1, 2], (a, b) => a === b)))
  it("zippedWith — throws", () =>
    shouldThrow(() => assert.zippedWith([1, 2], [1, 3], (a, b) => a === b)))

  it("groupedBy — passes", () =>
    shouldPass(() => assert.groupedBy([{ t: "a" }, { t: "b" }, { t: "a" }], "t", ["a", "b"])))
})

// ─────────────────────────────────────────────────────────────────────────────
// OBJECTS
// ─────────────────────────────────────────────────────────────────────────────

describe("objects", () => {
  it("hasKey — passes", () => shouldPass(() => assert.hasKey({ a: 1 }, "a")))
  it("hasKey — throws", () => shouldThrow(() => assert.hasKey({ a: 1 }, "b" as string)))

  it("hasKeys — passes", () => shouldPass(() => assert.hasKeys({ a: 1, b: 2 }, ["a", "b"])))
  it("hasKeys — throws", () => shouldThrow(() => assert.hasKeys({ a: 1 }, ["a", "b"])))

  it("hasExactKeys — passes", () =>
    shouldPass(() => assert.hasExactKeys({ a: 1, b: 2 }, ["a", "b"])))
  it("hasExactKeys — throws extra", () =>
    shouldThrow(() => assert.hasExactKeys({ a: 1, b: 2, c: 3 }, ["a", "b"])))
  it("hasExactKeys — throws missing", () =>
    shouldThrow(() => assert.hasExactKeys({ a: 1 }, ["a", "b"])))

  it("hasOnlyKeys — passes", () => shouldPass(() => assert.hasOnlyKeys({ a: 1 }, ["a", "b", "c"])))
  it("hasOnlyKeys — throws", () =>
    shouldThrow(() => assert.hasOnlyKeys({ a: 1, x: 2 }, ["a", "b"])))

  it("hasValue — passes", () => shouldPass(() => assert.hasValue({ a: 1 }, "a", 1)))
  it("hasValue — throws", () => shouldThrow(() => assert.hasValue({ a: 1 }, "a", 2)))

  it("containsSubset — passes", () =>
    shouldPass(() => assert.containsSubset({ a: 1, b: 2, c: 3 }, { a: 1, b: 2 })))
  it("containsSubset — throws", () => shouldThrow(() => assert.containsSubset({ a: 1 }, { a: 2 })))

  it("allValuesMatch — passes", () =>
    shouldPass(() => assert.allValuesMatch({ a: 1, b: 2 }, (v) => v > 0)))
  it("allValuesMatch — throws", () =>
    shouldThrow(() => assert.allValuesMatch({ a: 1, b: -1 }, (v) => v > 0)))

  it("noNilValues — passes", () => shouldPass(() => assert.noNilValues({ a: 1, b: 2 })))
  it("noNilValues — throws", () => shouldThrow(() => assert.noNilValues({ a: 1, b: null })))

  it("dig — passes", () => shouldPass(() => assert.dig({ a: { b: { c: 42 } } }, "a.b.c", 42)))
  it("dig — throws", () => shouldThrow(() => assert.dig({ a: { b: { c: 42 } } }, "a.b.c", 0)))
})

// ─────────────────────────────────────────────────────────────────────────────
// FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

describe("functions", () => {
  it("returns — passes", () => shouldPass(() => assert.returns((x: number) => x * 2, [5], 10)))
  it("returns — throws", () => shouldThrow(() => assert.returns((x: number) => x * 2, [5], 11)))

  it("pure — passes", () => shouldPass(() => assert.pure((x: number) => x + 1, [1])))
  it("pure — throws non-deterministic", () => {
    let i = 0
    shouldThrow(() => assert.pure(() => i++, []))
  })

  it("idempotent — passes", () =>
    shouldPass(() => assert.idempotent((s: string) => s.trim(), "  hello  ")))
  it("idempotent — throws", () => shouldThrow(() => assert.idempotent((n: number) => n + 1, 0)))

  it("arity — passes", () => shouldPass(() => assert.arity((a: number, b: number) => a + b, 2)))
  it("arity — throws", () => shouldThrow(() => assert.arity((a: number) => a, 2)))

  it("mapsDistinct — passes", () =>
    shouldPass(() => assert.mapsDistinct((n: number) => n * 2, 1, 2)))
  it("mapsDistinct — throws (collision)", () =>
    shouldThrow(() => assert.mapsDistinct(() => 42, 1, 2)))

  it("homomorphic — passes", () =>
    shouldPass(() =>
      assert.homomorphic(
        (n: number) => n * 2,
        (a: number, b: number) => a + b,
        3,
        4
      )
    ))
})

// ─────────────────────────────────────────────────────────────────────────────
// NOT
// ─────────────────────────────────────────────────────────────────────────────

describe("not", () => {
  it("not — passes when inner assertion fails", () =>
    shouldPass(() => assert.not(assert.equal, 1, 2)))

  it("not — throws when inner assertion passes", () =>
    shouldThrow(() => assert.not(assert.equal, 1, 1)))

  it("not — works with includes", () => shouldPass(() => assert.not(assert.includes, [1, 2, 3], 4)))
})

// ─────────────────────────────────────────────────────────────────────────────
// ASSERTION ERROR METADATA
// ─────────────────────────────────────────────────────────────────────────────

describe("AssertionError metadata", () => {
  it("carries assertion name", () => {
    const err = shouldThrow(() => assert.equal(1, 2))
    expect(err.assertion).toBe("equal")
  })

  it("carries actual and expected", () => {
    const err = shouldThrow(() => assert.equal("a", "b"))
    expect(err.actual).toBe("a")
    expect(err.expected).toBe("b")
  })

  it("message includes note when provided", () => {
    const err = shouldThrow(() => assert.equal(1, 2, { note: "retry later" }))
    expect(err.message).toContain("retry later")
  })

  it("message includes actual label when provided", () => {
    const err = shouldThrow(() => assert.equal("paid", "pending", { actual: "order.status" }))
    expect(err.message).toContain("order.status")
  })
})
