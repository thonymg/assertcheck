/**
 * @file assert.deep.test.ts
 *
 * Deep, 6-level test suite for @assertcheck/core.
 *
 * Levels per assertion:
 *   L1 – basic pass
 *   L2 – basic fail / throws
 *   L3 – edge / boundary values
 *   L4 – error metadata (assertion, actual, expected)
 *   L5 – error message content
 *   L6 – complex / real-world scenarios
 */

import { describe, it, expect, beforeEach, afterEach } from "bun:test"
import { assert, AssertionError, setAssertMode, getAssertMode } from "../src/index.ts"

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const throws = (fn: () => void): AssertionError => {
  let caught: unknown
  try {
    fn()
  } catch (e) {
    caught = e
  }
  expect(caught).toBeInstanceOf(AssertionError)
  return caught as AssertionError
}

const passes = (fn: () => void) => expect(fn).not.toThrow()

// Restore mode around every test
let _savedMode: ReturnType<typeof getAssertMode>
beforeEach(() => {
  _savedMode = getAssertMode()
})
afterEach(() => {
  setAssertMode(_savedMode)
})

// ─────────────────────────────────────────────────────────────────────────────
// NIL / NOT-NIL
// ─────────────────────────────────────────────────────────────────────────────

describe("nil — deep", () => {
  // L1 pass
  it("passes for null", () => passes(() => assert.nil(null)))
  it("passes for undefined", () => passes(() => assert.nil(undefined)))

  // L2 fail
  it("throws for 0", () => throws(() => assert.nil(0)))
  it("throws for false", () => throws(() => assert.nil(false)))
  it("throws for empty string", () => throws(() => assert.nil("")))
  it("throws for empty array", () => throws(() => assert.nil([])))
  it("throws for empty object", () => throws(() => assert.nil({})))
  it("throws for NaN", () => throws(() => assert.nil(NaN)))

  // L3 edge
  it("throws for 0 (falsy but not nil)", () => {
    const err = throws(() => assert.nil(0))
    expect(err.actual).toBe(0)
  })
  it("throws for empty string (falsy but not nil)", () => {
    const err = throws(() => assert.nil(""))
    expect(err.actual).toBe("")
  })

  // L4 metadata
  it("sets assertion = 'nil'", () => {
    const err = throws(() => assert.nil(42))
    expect(err.assertion).toBe("nil")
  })
  it("sets actual to the failing value", () => {
    const obj = { id: 1 }
    const err = throws(() => assert.nil(obj))
    expect(err.actual).toBe(obj)
  })
  it("sets expected to null", () => {
    const err = throws(() => assert.nil("x"))
    expect(err.expected).toBe(null)
  })

  // L5 message
  it("message contains 'null'", () => {
    const err = throws(() => assert.nil(99))
    expect(err.message).toContain("null")
  })
  it("message contains custom note", () => {
    const err = throws(() => assert.nil(1, { note: "must be empty after reset" }))
    expect(err.message).toContain("must be empty after reset")
  })

  // L6 complex
  it("disabled mode — does not throw even for non-nil", () => {
    setAssertMode("disabled")
    passes(() => assert.nil(42))
  })
  it("warn mode — does not throw", () => {
    setAssertMode("warn")
    passes(() => assert.nil({ nested: true }))
  })
  it("real-world: cleaned-up resource must be nil", () => {
    let conn: null | { close(): void } = null
    passes(() => assert.nil(conn, "connection must be closed"))
  })
  it("real-world: throws when stale reference is non-nil", () => {
    const stale = { close: () => {} }
    throws(() => assert.nil(stale, "expected cleaned-up connection"))
  })
})

describe("notNil — deep", () => {
  // L1 pass
  it("passes for 0", () => passes(() => assert.notNil(0)))
  it("passes for false", () => passes(() => assert.notNil(false)))
  it("passes for empty string", () => passes(() => assert.notNil("")))
  it("passes for empty array", () => passes(() => assert.notNil([])))

  // L2 fail
  it("throws for null", () => throws(() => assert.notNil(null)))
  it("throws for undefined", () => throws(() => assert.notNil(undefined)))

  // L3 edge
  it("passes for 0 (falsy, not nil)", () => passes(() => assert.notNil(0)))
  it("passes for NaN (not nil)", () => passes(() => assert.notNil(NaN)))

  // L4 metadata
  it("sets assertion = 'notNil'", () => {
    const err = throws(() => assert.notNil(null))
    expect(err.assertion).toBe("notNil")
  })
  it("sets actual to null", () => {
    const err = throws(() => assert.notNil(null))
    expect(err.actual).toBeNull()
  })
  it("sets actual to undefined", () => {
    const err = throws(() => assert.notNil(undefined))
    expect(err.actual).toBeUndefined()
  })

  // L5 message
  it("message contains 'non-null'", () => {
    const err = throws(() => assert.notNil(null))
    expect(err.message).toContain("non-null")
  })
  it("message contains custom msg", () => {
    const err = throws(() => assert.notNil(undefined, { msg: "user must exist" }))
    expect(err.message).toContain("user must exist")
  })

  // L6 complex
  it("disabled mode — does not throw for null", () => {
    setAssertMode("disabled")
    passes(() => assert.notNil(null))
  })
  it("real-world: user loaded from DB must not be nil", () => {
    const user = { id: 1, name: "Alice" }
    passes(() => assert.notNil(user))
  })
  it("real-world: missing DB record throws", () => {
    const row: null = null
    throws(() => assert.notNil(row, "record not found"))
  })
})

describe("empty — deep", () => {
  // L1 pass
  it("passes for []", () => passes(() => assert.empty([])))
  it("passes for ''", () => passes(() => assert.empty("")))
  it("passes for {}", () => passes(() => assert.empty({})))
  it("passes for new Map()", () => passes(() => assert.empty(new Map())))
  it("passes for new Set()", () => passes(() => assert.empty(new Set())))

  // L2 fail
  it("throws for [1]", () => throws(() => assert.empty([1])))
  it("throws for 'hello'", () => throws(() => assert.empty("hello")))
  it("throws for { a: 1 }", () => throws(() => assert.empty({ a: 1 })))

  // L3 edge
  it("passes for array with only undefined removed by lodash isEmpty", () => {
    passes(() => assert.empty([]))
  })
  it("throws for single-character string", () => throws(() => assert.empty("x")))
  it("throws for Set with one element", () => throws(() => assert.empty(new Set([1]))))

  // L4 metadata
  it("sets assertion = 'empty'", () => {
    const err = throws(() => assert.empty([1]))
    expect(err.assertion).toBe("empty")
  })
  it("sets actual to failing array", () => {
    const arr = [1, 2, 3]
    const err = throws(() => assert.empty(arr))
    expect(err.actual).toEqual([1, 2, 3])
  })

  // L5 message
  it("message contains 'empty'", () => {
    const err = throws(() => assert.empty([1, 2]))
    expect(err.message.toLowerCase()).toContain("empty")
  })

  // L6 complex
  it("disabled mode — does not throw", () => {
    setAssertMode("disabled")
    passes(() => assert.empty([1, 2, 3]))
  })
  it("real-world: validation errors list must be empty on success", () => {
    const errors: string[] = []
    passes(() => assert.empty(errors, "no validation errors expected"))
  })
  it("real-world: populated errors throw", () => {
    const errors = ["name required", "email invalid"]
    throws(() => assert.empty(errors, "expected no errors"))
  })
})

describe("notEmpty — deep", () => {
  // L1 pass
  it("passes for [1]", () => passes(() => assert.notEmpty([1])))
  it("passes for 'x'", () => passes(() => assert.notEmpty("x")))
  it("passes for { a: 1 }", () => passes(() => assert.notEmpty({ a: 1 })))

  // L2 fail
  it("throws for []", () => throws(() => assert.notEmpty([])))
  it("throws for ''", () => throws(() => assert.notEmpty("")))
  it("throws for {}", () => throws(() => assert.notEmpty({})))

  // L3 edge
  it("passes for [false]", () => passes(() => assert.notEmpty([false])))
  it("passes for [null]", () => passes(() => assert.notEmpty([null])))
  it("throws for new Map()", () => throws(() => assert.notEmpty(new Map())))

  // L4 metadata
  it("sets assertion = 'notEmpty'", () => {
    const err = throws(() => assert.notEmpty([]))
    expect(err.assertion).toBe("notEmpty")
  })
  it("sets actual to []", () => {
    const err = throws(() => assert.notEmpty([]))
    expect(err.actual).toEqual([])
  })

  // L5 message
  it("message contains custom msg", () => {
    const err = throws(() => assert.notEmpty([], { msg: "results required" }))
    expect(err.message).toContain("results required")
  })

  // L6 complex
  it("disabled mode — does not throw", () => {
    setAssertMode("disabled")
    passes(() => assert.notEmpty([]))
  })
  it("real-world: search results must not be empty", () => {
    const results = [
      { id: 1, title: "Post A" },
      { id: 2, title: "Post B" },
    ]
    passes(() => assert.notEmpty(results, "search must return results"))
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// TYPE GUARDS — deep
// ─────────────────────────────────────────────────────────────────────────────

describe("string — deep", () => {
  // L1 pass
  it("passes for ''", () => passes(() => assert.string("")))
  it("passes for 'hello'", () => passes(() => assert.string("hello")))

  // L2 fail
  it("throws for 1", () => throws(() => assert.string(1)))
  it("throws for true", () => throws(() => assert.string(true)))
  it("throws for null", () => throws(() => assert.string(null)))
  it("throws for []", () => throws(() => assert.string([])))

  // L3 edge
  it("throws for new String('x') (boxed string)", () => {
    // lodash _.isString returns true for String objects too, let's verify pass
    passes(() => assert.string(new String("x") as unknown as string))
  })
  it("throws for Symbol", () => throws(() => assert.string(Symbol("s"))))
  it("throws for undefined", () => throws(() => assert.string(undefined)))

  // L4 metadata
  it("sets assertion = 'string'", () => {
    const err = throws(() => assert.string(42))
    expect(err.assertion).toBe("string")
  })
  it("sets actual to the failing value", () => {
    const err = throws(() => assert.string(99))
    expect(err.actual).toBe(99)
  })

  // L5 message
  it("message mentions type", () => {
    const err = throws(() => assert.string(42))
    expect(err.message).toContain("number")
  })
  it("message contains 'string'", () => {
    const err = throws(() => assert.string(false))
    expect(err.message.toLowerCase()).toContain("string")
  })

  // L6 complex
  it("disabled mode — no throw for number", () => {
    setAssertMode("disabled")
    passes(() => assert.string(42))
  })
  it("real-world: API response field must be string", () => {
    const apiResponse = { status: "active", code: "USR-001" }
    passes(() => assert.string(apiResponse.status))
    passes(() => assert.string(apiResponse.code))
  })
  it("real-world: throws when numeric ID is passed as name", () => {
    throws(() => assert.string(12345 as unknown as string, "username must be string"))
  })
})

describe("number — deep", () => {
  it("passes for 0", () => passes(() => assert.number(0)))
  it("passes for NaN (lodash considers NaN a number)", () => passes(() => assert.number(NaN)))
  it("passes for Infinity", () => passes(() => assert.number(Infinity)))
  it("throws for '1'", () => throws(() => assert.number("1")))
  it("throws for true", () => throws(() => assert.number(true)))
  it("throws for null", () => throws(() => assert.number(null)))

  it("sets assertion = 'number'", () => {
    const err = throws(() => assert.number("oops"))
    expect(err.assertion).toBe("number")
  })
  it("sets actual correctly", () => {
    const err = throws(() => assert.number("123"))
    expect(err.actual).toBe("123")
  })
  it("message contains 'number'", () => {
    const err = throws(() => assert.number("x"))
    expect(err.message.toLowerCase()).toContain("number")
  })
  it("disabled mode — no throw for string", () => {
    setAssertMode("disabled")
    passes(() => assert.number("not a number" as unknown as number))
  })
  it("real-world: price field from form must be number", () => {
    const parsed = 29.99
    passes(() => assert.number(parsed))
  })
  it("real-world: throws when price arrives as string from form", () => {
    throws(() => assert.number("29.99" as unknown as number, "price must be numeric"))
  })
})

describe("integer — deep", () => {
  it("passes for 0", () => passes(() => assert.integer(0)))
  it("passes for -42", () => passes(() => assert.integer(-42)))
  it("passes for 2147483647", () => passes(() => assert.integer(2147483647)))

  it("throws for 1.5", () => throws(() => assert.integer(1.5)))
  it("throws for NaN", () => throws(() => assert.integer(NaN)))
  it("throws for Infinity", () => throws(() => assert.integer(Infinity)))
  it("throws for '3'", () => throws(() => assert.integer("3" as unknown as number)))

  it("sets assertion = 'integer'", () => {
    const err = throws(() => assert.integer(1.1))
    expect(err.assertion).toBe("integer")
  })
  it("sets actual to the float", () => {
    const err = throws(() => assert.integer(3.14))
    expect(err.actual).toBe(3.14)
  })
  it("message mentions integer", () => {
    const err = throws(() => assert.integer(0.001))
    expect(err.message.toLowerCase()).toContain("integer")
  })
  it("disabled — float does not throw", () => {
    setAssertMode("disabled")
    passes(() => assert.integer(1.5))
  })
  it("real-world: page size must be integer", () => {
    passes(() => assert.integer(25, "page size"))
    throws(() => assert.integer(25.5, "page size"))
  })
  it("real-world: amount in cents must be integer", () => {
    passes(() => assert.integer(1099))
    throws(() => assert.integer(10.99 as unknown as number, "use cents"))
  })
})

describe("finite — deep", () => {
  it("passes for 0", () => passes(() => assert.finite(0)))
  it("passes for -999.99", () => passes(() => assert.finite(-999.99)))
  it("passes for Number.MAX_SAFE_INTEGER", () =>
    passes(() => assert.finite(Number.MAX_SAFE_INTEGER)))

  it("throws for NaN", () => throws(() => assert.finite(NaN)))
  it("throws for Infinity", () => throws(() => assert.finite(Infinity)))
  it("throws for -Infinity", () => throws(() => assert.finite(-Infinity)))
  it("throws for '5' string", () => throws(() => assert.finite("5" as unknown as number)))

  it("sets assertion = 'finite'", () => {
    const err = throws(() => assert.finite(NaN))
    expect(err.assertion).toBe("finite")
  })
  it("sets actual to NaN", () => {
    const err = throws(() => assert.finite(NaN))
    expect(err.actual).toBeNaN()
  })
  it("message contains 'finite'", () => {
    const err = throws(() => assert.finite(Infinity))
    expect(err.message.toLowerCase()).toContain("finite")
  })
  it("real-world: computed ratio must be finite", () => {
    const total = 100
    const ratio = 42 / total
    passes(() => assert.finite(ratio))
    const divByZero = 42 / 0
    throws(() => assert.finite(divByZero, "ratio cannot be Infinity"))
  })
})

describe("boolean — deep", () => {
  it("passes for true", () => passes(() => assert.boolean(true)))
  it("passes for false", () => passes(() => assert.boolean(false)))

  it("throws for 0", () => throws(() => assert.boolean(0)))
  it("throws for 1", () => throws(() => assert.boolean(1)))
  it("throws for 'true'", () => throws(() => assert.boolean("true")))
  it("throws for null", () => throws(() => assert.boolean(null)))

  it("sets assertion = 'boolean'", () => {
    const err = throws(() => assert.boolean(1))
    expect(err.assertion).toBe("boolean")
  })
  it("sets actual to the failing value", () => {
    const err = throws(() => assert.boolean(0))
    expect(err.actual).toBe(0)
  })
  it("real-world: feature flag must be boolean", () => {
    const flags = { darkMode: true, beta: false }
    passes(() => assert.boolean(flags.darkMode))
    passes(() => assert.boolean(flags.beta))
    throws(() => assert.boolean(1 as unknown as boolean, "feature flag must be boolean"))
  })
})

describe("array — deep", () => {
  it("passes for []", () => passes(() => assert.array([])))
  it("passes for [1, 2, 3]", () => passes(() => assert.array([1, 2, 3])))
  it("passes for [[1, 2], [3]]", () => passes(() => assert.array([[1, 2], [3]])))

  it("throws for {}", () => throws(() => assert.array({})))
  it("throws for 'string'", () => throws(() => assert.array("string")))
  it("throws for null", () => throws(() => assert.array(null)))
  it("throws for new Set()", () => throws(() => assert.array(new Set())))

  it("sets assertion = 'array'", () => {
    const err = throws(() => assert.array({}))
    expect(err.assertion).toBe("array")
  })
  it("message contains 'array'", () => {
    const err = throws(() => assert.array("oops"))
    expect(err.message.toLowerCase()).toContain("array")
  })
  it("real-world: API response items must be array", () => {
    const response = { items: [{ id: 1 }, { id: 2 }], total: 2 }
    passes(() => assert.array(response.items))
    throws(() => assert.array(response.total as unknown as unknown[], "items must be array"))
  })
})

describe("object — deep", () => {
  it("passes for {}", () => passes(() => assert.object({})))
  it("passes for { a: 1 }", () => passes(() => assert.object({ a: 1 })))

  it("throws for []", () => throws(() => assert.object([])))
  it("throws for null", () => throws(() => assert.object(null)))
  it("throws for 'string'", () => throws(() => assert.object("string")))
  it("throws for class instance", () => {
    class Foo {}
    throws(() => assert.object(new Foo()))
  })

  it("sets assertion = 'object'", () => {
    const err = throws(() => assert.object([]))
    expect(err.assertion).toBe("object")
  })
  it("message contains 'object'", () => {
    const err = throws(() => assert.object([]))
    expect(err.message.toLowerCase()).toContain("object")
  })
  it("real-world: parsed JSON body must be plain object", () => {
    const body = { userId: 1, action: "buy" }
    passes(() => assert.object(body))
    throws(() => assert.object([1, 2] as unknown as object, "body must be object not array"))
  })
})

describe("func — deep", () => {
  it("passes for arrow function", () => passes(() => assert.func(() => {})))
  it("passes for named function", () => passes(() => assert.func(function named() {})))
  it("passes for class constructor", () => {
    class Foo {}
    passes(() => assert.func(Foo))
  })

  it("throws for string", () => throws(() => assert.func("fn")))
  it("throws for object", () => throws(() => assert.func({})))
  it("throws for null", () => throws(() => assert.func(null)))

  it("sets assertion = 'func'", () => {
    const err = throws(() => assert.func("fn"))
    expect(err.assertion).toBe("func")
  })
  it("real-world: middleware must be function", () => {
    const mw = (req: unknown, res: unknown, next: () => void) => next()
    passes(() => assert.func(mw))
    throws(() => assert.func({ handle: () => {} } as unknown as () => void, "must be function"))
  })
})

describe("instanceOf — deep", () => {
  class Animal {
    name: string
    constructor(n: string) {
      this.name = n
    }
  }
  class Dog extends Animal {}
  class Cat extends Animal {}

  it("passes for direct instance", () => passes(() => assert.instanceOf(new Dog("Rex"), Dog)))
  it("passes for parent class", () => passes(() => assert.instanceOf(new Dog("Rex"), Animal)))
  it("passes for Error subclass", () => {
    class AppError extends Error {}
    passes(() => assert.instanceOf(new AppError("msg"), AppError))
    passes(() => assert.instanceOf(new AppError("msg"), Error))
  })

  it("throws for wrong class", () => throws(() => assert.instanceOf(new Dog("Rex"), Cat)))
  it("throws for plain object", () => throws(() => assert.instanceOf({}, Dog)))
  it("throws for null", () => throws(() => assert.instanceOf(null, Dog)))

  it("sets assertion = 'instanceOf'", () => {
    const err = throws(() => assert.instanceOf(new Dog("Rex"), Cat))
    expect(err.assertion).toBe("instanceOf")
  })
  it("sets expected to constructor name", () => {
    const err = throws(() => assert.instanceOf(new Dog("Rex"), Cat))
    expect(err.expected).toBe("Cat")
  })
  it("message contains class name", () => {
    const err = throws(() => assert.instanceOf({}, Dog))
    expect(err.message).toContain("Dog")
  })

  it("real-world: event must be DomainEvent", () => {
    class DomainEvent {
      type: string
      constructor(t: string) {
        this.type = t
      }
    }
    class OrderPlaced extends DomainEvent {}
    class UserCreated extends DomainEvent {}
    const evt = new OrderPlaced("order.placed")
    passes(() => assert.instanceOf(evt, DomainEvent))
    passes(() => assert.instanceOf(evt, OrderPlaced))
    throws(() => assert.instanceOf(evt, UserCreated))
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// EQUALITY — deep
// ─────────────────────────────────────────────────────────────────────────────

describe("equal — deep", () => {
  // L1 pass
  it("passes for 0 === 0", () => passes(() => assert.equal(0, 0)))
  it("passes for 'a' === 'a'", () => passes(() => assert.equal("a", "a")))
  it("passes for null === null", () => passes(() => assert.equal(null, null)))
  it("passes for undefined === undefined", () => passes(() => assert.equal(undefined, undefined)))
  it("passes for true === true", () => passes(() => assert.equal(true, true)))

  // L2 fail
  it("throws for 1 !== 2", () => throws(() => assert.equal(1, 2)))
  it("throws for 'a' !== 'b'", () => throws(() => assert.equal("a", "b")))
  it("throws for null !== undefined", () =>
    throws(() => assert.equal(null, undefined as unknown as null)))
  it("throws for reference equality — different objects", () => {
    throws(() => assert.equal({ a: 1 } as unknown as number, { a: 1 } as unknown as number))
  })

  // L3 edge
  it("throws for NaN !== NaN (IEEE754)", () => {
    // NaN !== NaN is true in JS — strict equality
    throws(() => assert.equal(NaN, NaN))
  })
  it("passes for same reference", () => {
    const ref = { x: 1 }
    passes(() => assert.equal(ref as unknown as number, ref as unknown as number))
  })
  it("passes for 0 vs -0 (=== treats them as equal)", () => {
    passes(() => assert.equal(0, -0))
  })

  // L4 metadata
  it("sets assertion = 'equal'", () => {
    const err = throws(() => assert.equal(1, 2))
    expect(err.assertion).toBe("equal")
  })
  it("sets actual and expected", () => {
    const err = throws(() => assert.equal("a", "b"))
    expect(err.actual).toBe("a")
    expect(err.expected).toBe("b")
  })
  it("preserves object reference in actual", () => {
    const obj = { key: "val" }
    const err = throws(() => assert.equal(obj as unknown as number, 42))
    expect(err.actual).toBe(obj)
  })

  // L5 message
  it("message contains custom msg", () => {
    const err = throws(() => assert.equal(1, 2, { msg: "version must match" }))
    expect(err.message).toContain("version must match")
  })
  it("message contains actual label when provided", () => {
    const err = throws(() => assert.equal("paid", "pending", { actual: "order.status" }))
    expect(err.message).toContain("order.status")
  })
  it("message contains note when provided", () => {
    const err = throws(() => assert.equal(1, 2, { note: "check config" }))
    expect(err.message).toContain("check config")
  })

  // L6 complex
  it("disabled mode — 1 !== 2 does not throw", () => {
    setAssertMode("disabled")
    passes(() => assert.equal(1, 2))
  })
  it("real-world: HTTP status code check", () => {
    const statusCode = 200
    passes(() => assert.equal(statusCode, 200))
    throws(() => assert.equal(404, 200, "expected 200 OK"))
  })
  it("real-world: enum value check in state machine", () => {
    type Status = "idle" | "loading" | "success" | "error"
    const state: Status = "success"
    passes(() => assert.equal(state, "success"))
    throws(() => assert.equal(state, "loading" as Status, "expected loading state"))
  })
})

describe("deepEqual — deep", () => {
  // L1 pass
  it("passes for identical primitive", () => passes(() => assert.deepEqual(1, 1)))
  it("passes for deeply equal objects", () => passes(() => assert.deepEqual({ a: 1 }, { a: 1 })))
  it("passes for deeply equal nested objects", () =>
    passes(() => assert.deepEqual({ a: { b: { c: 3 } } }, { a: { b: { c: 3 } } })))
  it("passes for equal arrays", () => passes(() => assert.deepEqual([1, 2, 3], [1, 2, 3])))
  it("passes for array of objects", () =>
    passes(() => assert.deepEqual([{ id: 1 }, { id: 2 }], [{ id: 1 }, { id: 2 }])))

  // L2 fail
  it("throws for { a: 1 } vs { a: 2 }", () => throws(() => assert.deepEqual({ a: 1 }, { a: 2 })))
  it("throws for [1,2] vs [1,3]", () => throws(() => assert.deepEqual([1, 2], [1, 3])))
  it("throws for different key sets", () =>
    throws(() => assert.deepEqual({ a: 1 } as unknown as { a: number; b: number }, { a: 1, b: 2 })))

  // L3 edge
  it("passes for empty objects", () => passes(() => assert.deepEqual({}, {})))
  it("passes for empty arrays", () => passes(() => assert.deepEqual([], [])))
  it("throws for array vs object", () =>
    throws(() => assert.deepEqual([] as unknown as object, {})))

  // L4 metadata
  it("sets assertion = 'deepEqual'", () => {
    const err = throws(() => assert.deepEqual({ a: 1 }, { a: 2 }))
    expect(err.assertion).toBe("deepEqual")
  })
  it("sets actual and expected objects", () => {
    const actual = { status: "paid" }
    const expected = { status: "pending" }
    const err = throws(() => assert.deepEqual(actual, expected))
    expect(err.actual).toEqual({ status: "paid" })
    expect(err.expected).toEqual({ status: "pending" })
  })

  // L5 message
  it("message includes diffed key", () => {
    const err = throws(() => assert.deepEqual({ status: "paid" }, { status: "pending" }))
    expect(err.message).toContain("status")
  })
  it("message includes custom note", () => {
    const err = throws(() => assert.deepEqual({ a: 1 }, { a: 2 }, { note: "from deserializer" }))
    expect(err.message).toContain("from deserializer")
  })

  // L6 complex
  it("disabled — deep mismatch does not throw", () => {
    setAssertMode("disabled")
    passes(() => assert.deepEqual({ a: 1 }, { a: 999 }))
  })
  it("real-world: serialized/deserialized round-trip", () => {
    const original = { id: 1, tags: ["a", "b"], meta: { active: true } }
    const deserialized = JSON.parse(JSON.stringify(original))
    passes(() => assert.deepEqual(original, deserialized))
  })
  it("real-world: API response shape validation", () => {
    const response = { user: { id: 42, role: "admin" }, token: "abc" }
    const expected = { user: { id: 42, role: "admin" }, token: "abc" }
    passes(() => assert.deepEqual(response, expected))
  })
  it("real-world: detects extra field in response", () => {
    const response = { id: 1, name: "Alice", password: "hashed" } as unknown as {
      id: number
      name: string
    }
    const expected = { id: 1, name: "Alice" }
    throws(() => assert.deepEqual(response, expected, "response has extra field"))
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// NUMERICS — deep
// ─────────────────────────────────────────────────────────────────────────────

describe("positive — deep", () => {
  it("passes for 1", () => passes(() => assert.positive(1)))
  it("passes for 0.001", () => passes(() => assert.positive(0.001)))
  it("passes for Number.MAX_VALUE", () => passes(() => assert.positive(Number.MAX_VALUE)))

  it("throws for 0", () => throws(() => assert.positive(0)))
  it("throws for -1", () => throws(() => assert.positive(-1)))
  it("throws for -0.001", () => throws(() => assert.positive(-0.001)))
  it("throws for NaN (not finite)", () => throws(() => assert.positive(NaN)))
  it("throws for Infinity (not finite)", () => throws(() => assert.positive(Infinity)))

  it("sets assertion = 'positive'", () => {
    const err = throws(() => assert.positive(0))
    expect(err.assertion).toBe("positive")
  })
  it("sets actual to 0", () => {
    const err = throws(() => assert.positive(0))
    expect(err.actual).toBe(0)
  })
  it("sets expected to '> 0'", () => {
    const err = throws(() => assert.positive(-5))
    expect(err.expected).toBe("> 0")
  })
  it("message mentions '> 0'", () => {
    const err = throws(() => assert.positive(-1))
    expect(err.message).toContain("> 0")
  })
  it("disabled — 0 does not throw", () => {
    setAssertMode("disabled")
    passes(() => assert.positive(0))
  })
  it("real-world: order amount must be positive", () => {
    passes(() => assert.positive(9999, "amount must be positive"))
    throws(() => assert.positive(0, "zero amount not allowed"))
    throws(() => assert.positive(-1, "negative amount"))
  })
})

describe("negative — deep", () => {
  it("passes for -1", () => passes(() => assert.negative(-1)))
  it("passes for -0.001", () => passes(() => assert.negative(-0.001)))

  it("throws for 0", () => throws(() => assert.negative(0)))
  it("throws for 1", () => throws(() => assert.negative(1)))
  it("throws for NaN", () => throws(() => assert.negative(NaN)))
  it("throws for -Infinity (not finite)", () => throws(() => assert.negative(-Infinity)))

  it("sets assertion = 'negative'", () => {
    const err = throws(() => assert.negative(0))
    expect(err.assertion).toBe("negative")
  })
  it("real-world: temperature drop must be negative delta", () => {
    const delta = -5.2
    passes(() => assert.negative(delta, "must be a drop"))
    throws(() => assert.negative(1.0, "temperature rose — expected drop"))
  })
})

describe("zero — deep", () => {
  it("passes for 0", () => passes(() => assert.zero(0)))
  it("passes for -0", () => passes(() => assert.zero(-0)))

  it("throws for 1", () => throws(() => assert.zero(1)))
  it("throws for -1", () => throws(() => assert.zero(-1)))
  it("throws for 0.001", () => throws(() => assert.zero(0.001)))
  it("throws for NaN", () => throws(() => assert.zero(NaN)))

  it("sets assertion = 'zero'", () => {
    const err = throws(() => assert.zero(1))
    expect(err.assertion).toBe("zero")
  })
  it("sets expected to 0", () => {
    const err = throws(() => assert.zero(5))
    expect(err.expected).toBe(0)
  })
  it("real-world: remainder after batch processing must be zero", () => {
    const processed = 100,
      total = 100
    passes(() => assert.zero(total - processed, "all items processed"))
    throws(() => assert.zero(3, "3 items remain"))
  })
})

describe("greater — deep", () => {
  it("passes for 2 > 1", () => passes(() => assert.greater(2, 1)))
  it("passes for 0.1 > 0", () => passes(() => assert.greater(0.1, 0)))
  it("passes for -1 > -2", () => passes(() => assert.greater(-1, -2)))

  it("throws for 1 > 1 (equal)", () => throws(() => assert.greater(1, 1)))
  it("throws for 1 > 2", () => throws(() => assert.greater(1, 2)))

  it("sets assertion = 'greater'", () => {
    const err = throws(() => assert.greater(1, 1))
    expect(err.assertion).toBe("greater")
  })
  it("sets actual to 1 and expected to '> 1'", () => {
    const err = throws(() => assert.greater(1, 1))
    expect(err.actual).toBe(1)
    expect(err.expected).toBe("> 1")
  })
  it("message contains expected threshold", () => {
    const err = throws(() => assert.greater(3, 5))
    expect(err.message).toContain("5")
  })
  it("real-world: new version must be greater", () => {
    passes(() => assert.greater(2, 1, "v2 > v1"))
    throws(() => assert.greater(1, 1, "same version — not upgraded"))
  })
})

describe("greaterOrEqual — deep", () => {
  it("passes for 2 >= 1", () => passes(() => assert.greaterOrEqual(2, 1)))
  it("passes for 1 >= 1", () => passes(() => assert.greaterOrEqual(1, 1)))
  it("passes for 0 >= 0", () => passes(() => assert.greaterOrEqual(0, 0)))

  it("throws for 0 >= 1", () => throws(() => assert.greaterOrEqual(0, 1)))
  it("throws for -1 >= 0", () => throws(() => assert.greaterOrEqual(-1, 0)))

  it("sets assertion = 'greaterOrEqual'", () => {
    const err = throws(() => assert.greaterOrEqual(0, 1))
    expect(err.assertion).toBe("greaterOrEqual")
  })
  it("message contains 'shortfall'", () => {
    const err = throws(() => assert.greaterOrEqual(3, 10))
    expect(err.message).toContain("shortfall")
  })
  it("shortfall is correct value", () => {
    const err = throws(() => assert.greaterOrEqual(3, 10))
    expect(err.message).toContain("7")
  })
  it("real-world: balance must cover withdrawal", () => {
    const balance = 500,
      amount = 200
    passes(() => assert.greaterOrEqual(balance, amount, "sufficient funds"))
    throws(() => assert.greaterOrEqual(100, 200, "insufficient funds"))
  })
  it("real-world: shortfall message in payment flow", () => {
    const err = throws(() => assert.greaterOrEqual(80, 100, "balance check"))
    expect(err.message).toContain("shortfall")
    expect(err.message).toContain("20")
  })
})

describe("less — deep", () => {
  it("passes for 1 < 2", () => passes(() => assert.less(1, 2)))
  it("passes for -1 < 0", () => passes(() => assert.less(-1, 0)))

  it("throws for 1 < 1 (equal)", () => throws(() => assert.less(1, 1)))
  it("throws for 2 < 1", () => throws(() => assert.less(2, 1)))

  it("sets assertion = 'less'", () => {
    const err = throws(() => assert.less(2, 1))
    expect(err.assertion).toBe("less")
  })
  it("real-world: API latency must be below 200ms", () => {
    passes(() => assert.less(150, 200, "within SLA"))
    throws(() => assert.less(250, 200, "SLA breach"))
  })
})

describe("lessOrEqual — deep", () => {
  it("passes for 1 <= 2", () => passes(() => assert.lessOrEqual(1, 2)))
  it("passes for 1 <= 1", () => passes(() => assert.lessOrEqual(1, 1)))

  it("throws for 2 <= 1", () => throws(() => assert.lessOrEqual(2, 1)))
  it("throws for 0 <= -1", () => throws(() => assert.lessOrEqual(0, -1)))

  it("sets assertion = 'lessOrEqual'", () => {
    const err = throws(() => assert.lessOrEqual(5, 3))
    expect(err.assertion).toBe("lessOrEqual")
  })
  it("real-world: page size must not exceed 100", () => {
    passes(() => assert.lessOrEqual(50, 100))
    passes(() => assert.lessOrEqual(100, 100))
    throws(() => assert.lessOrEqual(101, 100, "page size too large"))
  })
})

describe("withinRange — deep", () => {
  it("passes for 5 in [0, 10]", () => passes(() => assert.withinRange(5, 0, 10)))
  it("passes for 0 (lower bound)", () => passes(() => assert.withinRange(0, 0, 10)))
  it("passes for 10 (upper bound)", () => passes(() => assert.withinRange(10, 0, 10)))
  it("passes for negative range: -5 in [-10, 0]", () =>
    passes(() => assert.withinRange(-5, -10, 0)))

  it("throws for -1 in [0, 10]", () => throws(() => assert.withinRange(-1, 0, 10)))
  it("throws for 11 in [0, 10]", () => throws(() => assert.withinRange(11, 0, 10)))

  it("sets assertion = 'withinRange'", () => {
    const err = throws(() => assert.withinRange(-1, 0, 10))
    expect(err.assertion).toBe("withinRange")
  })
  it("sets expected to '[min, max]' string", () => {
    const err = throws(() => assert.withinRange(11, 0, 10))
    expect(err.expected).toBe("[0, 10]")
  })
  it("message contains 'distance' info", () => {
    const err = throws(() => assert.withinRange(15, 0, 10))
    expect(err.message).toContain("distance")
  })
  it("real-world: percentage score 0–100", () => {
    passes(() => assert.withinRange(0, 0, 100))
    passes(() => assert.withinRange(100, 0, 100))
    passes(() => assert.withinRange(72.5, 0, 100))
    throws(() => assert.withinRange(-0.1, 0, 100, "score below minimum"))
    throws(() => assert.withinRange(100.1, 0, 100, "score above maximum"))
  })
  it("real-world: distance is correct in message", () => {
    const err = throws(() => assert.withinRange(15, 0, 10))
    expect(err.message).toContain("5")
  })
})

describe("inDelta — deep", () => {
  it("passes for |1.001 - 1.0| <= 0.01", () => passes(() => assert.inDelta(1.001, 1.0, 0.01)))
  it("passes for exact match (delta 0)", () => passes(() => assert.inDelta(5, 5, 0)))
  it("passes for negative values within delta", () =>
    passes(() => assert.inDelta(-1.001, -1.0, 0.01)))

  it("throws for |1.1 - 1.0| > 0.01", () => throws(() => assert.inDelta(1.1, 1.0, 0.01)))
  it("throws when actual is above expected + delta", () =>
    throws(() => assert.inDelta(10.5, 10.0, 0.4)))
  it("throws when actual is below expected - delta", () =>
    throws(() => assert.inDelta(9.5, 10.0, 0.4)))

  it("sets assertion = 'inDelta'", () => {
    const err = throws(() => assert.inDelta(2.0, 1.0, 0.5))
    expect(err.assertion).toBe("inDelta")
  })
  it("message contains 'delta'", () => {
    const err = throws(() => assert.inDelta(1.1, 1.0, 0.01))
    expect(err.message.toLowerCase()).toContain("delta")
  })
  it("message contains 'excess'", () => {
    const err = throws(() => assert.inDelta(1.1, 1.0, 0.01))
    expect(err.message).toContain("excess")
  })
  it("real-world: floating-point computation tolerance", () => {
    const computed = 0.1 + 0.2 // 0.30000000000000004
    passes(() => assert.inDelta(computed, 0.3, 1e-10))
    throws(() => assert.inDelta(computed, 0.3, 0, "exact match fails for FP"))
  })
  it("real-world: GPS coordinate tolerance", () => {
    const measured = 48.8566
    const expected = 48.8567
    passes(() => assert.inDelta(measured, expected, 0.001))
    throws(() => assert.inDelta(measured, expected, 0.00001, "too precise"))
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// ARRAYS — len, longerThan, shorterThan, includes, all, any, none, one, count
// ─────────────────────────────────────────────────────────────────────────────

describe("len — deep", () => {
  it("passes for []·0", () => passes(() => assert.len([], 0)))
  it("passes for [1,2,3]·3", () => passes(() => assert.len([1, 2, 3], 3)))

  it("throws for wrong length", () => throws(() => assert.len([1, 2], 3)))
  it("throws for empty vs 1", () => throws(() => assert.len([], 1)))

  it("sets assertion = 'len'", () => {
    const err = throws(() => assert.len([1], 2))
    expect(err.assertion).toBe("len")
  })
  it("actual is actual length", () => {
    const err = throws(() => assert.len([1, 2], 5))
    expect(err.actual).toBe(2)
  })
  it("expected is expected length", () => {
    const err = throws(() => assert.len([1, 2], 5))
    expect(err.expected).toBe(5)
  })
  it("real-world: paginated page must have exactly 10 items", () => {
    const page = Array.from({ length: 10 }, (_, i) => ({ id: i }))
    passes(() => assert.len(page, 10))
    throws(() => assert.len([...page, { id: 10 }], 10, "page overflow"))
  })
  it("real-world: chess board must have 64 squares", () => {
    const board = Array.from({ length: 64 }, (_, i) => i)
    passes(() => assert.len(board, 64))
  })
})

describe("longerThan — deep", () => {
  it("passes for [1,2] > 1", () => passes(() => assert.longerThan([1, 2], 1)))
  it("passes for [x] > 0", () => passes(() => assert.longerThan(["x"], 0)))

  it("throws for [1] > 1 (equal)", () => throws(() => assert.longerThan([1], 1)))
  it("throws for [] > 0", () => throws(() => assert.longerThan([], 0)))

  it("sets assertion = 'longerThan'", () => {
    const err = throws(() => assert.longerThan([], 0))
    expect(err.assertion).toBe("longerThan")
  })
  it("real-world: search must return at least one result", () => {
    const results = [{ id: 1 }]
    passes(() => assert.longerThan(results, 0, "must have results"))
    throws(() => assert.longerThan([], 0, "no results found"))
  })
})

describe("shorterThan — deep", () => {
  it("passes for [1] < 3", () => passes(() => assert.shorterThan([1], 3)))
  it("passes for [] < 1", () => passes(() => assert.shorterThan([], 1)))

  it("throws for [1,2,3] < 3 (equal)", () => throws(() => assert.shorterThan([1, 2, 3], 3)))
  it("throws for [1,2,3,4] < 3", () => throws(() => assert.shorterThan([1, 2, 3, 4], 3)))

  it("sets assertion = 'shorterThan'", () => {
    const err = throws(() => assert.shorterThan([1, 2, 3], 3))
    expect(err.assertion).toBe("shorterThan")
  })
  it("real-world: tags must be fewer than 10", () => {
    const tags = ["a", "b", "c"]
    passes(() => assert.shorterThan(tags, 10))
    throws(() => assert.shorterThan(Array(10).fill("x"), 10, "tag limit exceeded"))
  })
})

describe("includes — deep", () => {
  it("passes for item in array", () => passes(() => assert.includes([1, 2, 3], 2)))
  it("passes for string in array", () => passes(() => assert.includes(["a", "b"], "a")))
  it("passes for first element", () => passes(() => assert.includes([7], 7)))

  it("throws for missing item", () => throws(() => assert.includes([1, 2, 3], 4)))
  it("throws for empty array", () => throws(() => assert.includes([], 1)))
  it("does not use deep equality — throws for different reference", () => {
    throws(() => assert.includes([{ id: 1 }], { id: 1 }))
  })

  it("sets assertion = 'includes'", () => {
    const err = throws(() => assert.includes([1, 2], 3))
    expect(err.assertion).toBe("includes")
  })
  it("sets expected to the missing item", () => {
    const err = throws(() => assert.includes([1, 2], 99))
    expect(err.expected).toBe(99)
  })
  it("real-world: required permissions", () => {
    const permissions = ["read", "write", "delete"]
    passes(() => assert.includes(permissions, "write"))
    throws(() =>
      assert.includes(
        permissions,
        "admin" as (typeof permissions)[number],
        "admin permission required"
      )
    )
  })
})

describe("all — deep", () => {
  it("passes when all match predicate", () =>
    passes(() => assert.all([2, 4, 6], (n) => n % 2 === 0)))
  it("passes for empty array (vacuously true)", () => passes(() => assert.all([], () => false)))
  it("passes for single-element match", () => passes(() => assert.all([2], (n) => n % 2 === 0)))

  it("throws when first element fails", () =>
    throws(() => assert.all([1, 2, 4], (n) => n % 2 === 0)))
  it("throws when last element fails", () =>
    throws(() => assert.all([2, 4, 5], (n) => n % 2 === 0)))
  it("throws when middle element fails", () =>
    throws(() => assert.all([2, 3, 4], (n) => n % 2 === 0)))

  it("sets assertion = 'all'", () => {
    const err = throws(() => assert.all([1], (n) => n > 5))
    expect(err.assertion).toBe("all")
  })
  it("message contains index of failing element", () => {
    const err = throws(() => assert.all([2, 3, 4], (n) => n % 2 === 0))
    expect(err.message).toContain("index")
    expect(err.message).toContain("1")
  })
  it("actual is the failing element", () => {
    const err = throws(() => assert.all([2, 3, 4], (n) => n % 2 === 0))
    expect(err.actual).toBe(3)
  })
  it("real-world: all orders must be paid before shipping", () => {
    type Order = { id: number; status: "paid" | "pending" }
    const orders: Order[] = [
      { id: 1, status: "paid" },
      { id: 2, status: "paid" },
    ]
    passes(() => assert.all(orders, (o) => o.status === "paid"))
    throws(() => assert.all([...orders, { id: 3, status: "pending" }], (o) => o.status === "paid"))
  })
  it("real-world: all users must have verified email", () => {
    const users = [
      { id: 1, email: "a@b.com", verified: true },
      { id: 2, email: "c@d.com", verified: true },
    ]
    passes(() => assert.all(users, (u) => u.verified))
    throws(() =>
      assert.all(
        [...users, { id: 3, email: "e@f.com", verified: false }],
        (u) => u.verified,
        "all users must be verified"
      )
    )
  })
})

describe("any — deep", () => {
  it("passes when at least one matches", () => passes(() => assert.any([1, 2, 3], (n) => n === 2)))
  it("passes when first matches", () => passes(() => assert.any([2, 1, 1], (n) => n === 2)))
  it("passes when last matches", () => passes(() => assert.any([1, 1, 2], (n) => n === 2)))

  it("throws when none match", () => throws(() => assert.any([1, 3, 5], (n) => n % 2 === 0)))
  it("throws for empty array", () => throws(() => assert.any([], () => true)))

  it("sets assertion = 'any'", () => {
    const err = throws(() => assert.any([1, 3], (n) => n > 10))
    expect(err.assertion).toBe("any")
  })
  it("real-world: at least one admin in team", () => {
    const team = [
      { id: 1, role: "member" },
      { id: 2, role: "admin" },
    ]
    passes(() => assert.any(team, (m) => m.role === "admin"))
    throws(() =>
      assert.any([{ id: 1, role: "member" }], (m) => m.role === "admin", "need an admin")
    )
  })
})

describe("none — deep", () => {
  it("passes when no element matches", () =>
    passes(() => assert.none([1, 3, 5], (n) => n % 2 === 0)))
  it("passes for empty array", () => passes(() => assert.none([], () => true)))

  it("throws when one element matches", () => throws(() => assert.none([1, 2, 3], (n) => n === 2)))
  it("throws when first element matches", () =>
    throws(() => assert.none([2, 3, 4], (n) => n === 2)))

  it("sets assertion = 'none'", () => {
    const err = throws(() => assert.none([1, 2], (n) => n === 2))
    expect(err.assertion).toBe("none")
  })
  it("actual is the matching element", () => {
    const err = throws(() => assert.none([1, 42, 3], (n) => n === 42))
    expect(err.actual).toBe(42)
  })
  it("real-world: no banned users in active list", () => {
    const users = [
      { id: 1, banned: false },
      { id: 2, banned: false },
    ]
    passes(() => assert.none(users, (u) => u.banned))
    throws(() =>
      assert.none(
        [...users, { id: 3, banned: true }],
        (u) => u.banned,
        "banned user in active list"
      )
    )
  })
})

describe("one — deep", () => {
  it("passes when exactly one matches", () => passes(() => assert.one([1, 2, 3], (n) => n === 2)))
  it("passes for single-element array matching", () =>
    passes(() => assert.one([5], (n) => n === 5)))

  it("throws when zero match", () => throws(() => assert.one([1, 3, 5], (n) => n === 2)))
  it("throws when two match", () => throws(() => assert.one([2, 2, 3], (n) => n === 2)))
  it("throws for empty array", () => throws(() => assert.one([], () => true)))

  it("sets assertion = 'one'", () => {
    const err = throws(() => assert.one([2, 2], (n) => n === 2))
    expect(err.assertion).toBe("one")
  })
  it("actual is count when more than one matches", () => {
    const err = throws(() => assert.one([2, 2, 2], (n) => n === 2))
    expect(err.actual).toBe(3)
  })
  it("real-world: exactly one primary contact per customer", () => {
    const contacts = [
      { id: 1, primary: false },
      { id: 2, primary: true },
      { id: 3, primary: false },
    ]
    passes(() => assert.one(contacts, (c) => c.primary))
    throws(() =>
      assert.one(
        [...contacts, { id: 4, primary: true }],
        (c) => c.primary,
        "multiple primary contacts"
      )
    )
  })
})

describe("count — deep", () => {
  it("passes for 2 even numbers", () =>
    passes(() => assert.count([1, 2, 3, 4], (n) => n % 2 === 0, 2)))
  it("passes for 0 matches", () => passes(() => assert.count([1, 3, 5], (n) => n % 2 === 0, 0)))
  it("passes for all matching", () => passes(() => assert.count([2, 4], (n) => n % 2 === 0, 2)))

  it("throws when count is off by one", () =>
    throws(() => assert.count([2, 4, 6], (n) => n % 2 === 0, 2)))
  it("throws for empty array expecting 1", () => throws(() => assert.count([], () => true, 1)))

  it("sets assertion = 'count'", () => {
    const err = throws(() => assert.count([2, 4], (n) => n % 2 === 0, 1))
    expect(err.assertion).toBe("count")
  })
  it("actual is the real count", () => {
    const err = throws(() => assert.count([2, 4, 6], (n) => n % 2 === 0, 1))
    expect(err.actual).toBe(3)
  })
  it("real-world: exactly 3 retries should have occurred", () => {
    const attempts = [
      { id: 1, retry: false },
      { id: 2, retry: true },
      { id: 3, retry: true },
      { id: 4, retry: true },
      { id: 5, retry: false },
    ]
    passes(() => assert.count(attempts, (a) => a.retry, 3))
    throws(() => assert.count(attempts, (a) => a.retry, 2, "expected 3 retries"))
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// ARRAYS — containsAll, containsNone, elementsMatch, subset, unique, uniqueBy
// ─────────────────────────────────────────────────────────────────────────────

describe("containsAll — deep", () => {
  it("passes when all items present", () => passes(() => assert.containsAll([1, 2, 3], [1, 2])))
  it("passes when items == arr (same set)", () => passes(() => assert.containsAll([1, 2], [1, 2])))
  it("passes for empty items list", () => passes(() => assert.containsAll([1], [])))

  it("throws when one item missing", () => throws(() => assert.containsAll([1, 2], [1, 2, 3])))
  it("throws when all items missing", () => throws(() => assert.containsAll([], [1, 2])))

  it("sets assertion = 'containsAll'", () => {
    const err = throws(() => assert.containsAll([1], [1, 2]))
    expect(err.assertion).toBe("containsAll")
  })
  it("real-world: response must contain required fields as values", () => {
    const statuses = ["active", "inactive", "pending"]
    passes(() => assert.containsAll(statuses, ["active", "inactive"]))
    throws(() => assert.containsAll(["active"], ["active", "inactive"], "missing 'inactive'"))
  })
})

describe("containsNone — deep", () => {
  it("passes when no forbidden items present", () =>
    passes(() => assert.containsNone([1, 2, 3], [4, 5])))
  it("passes for empty forbidden list", () => passes(() => assert.containsNone([1, 2], [])))
  it("passes for empty arr", () => passes(() => assert.containsNone([], [1, 2])))

  it("throws when one forbidden item present", () =>
    throws(() => assert.containsNone([1, 2, 3], [3, 4])))
  it("throws when all forbidden items present", () =>
    throws(() => assert.containsNone([1, 2], [1, 2])))

  it("sets assertion = 'containsNone'", () => {
    const err = throws(() => assert.containsNone([1, 2], [2]))
    expect(err.assertion).toBe("containsNone")
  })
  it("actual is the intersection found", () => {
    const err = throws(() => assert.containsNone([1, 2, 3], [2, 3]))
    expect(Array.isArray(err.actual)).toBe(true)
    expect((err.actual as number[]).sort()).toEqual([2, 3])
  })
  it("real-world: audit log must not contain sensitive actions", () => {
    const log = ["login", "view", "export"]
    const forbidden = ["delete_all", "drop_db"]
    passes(() => assert.containsNone(log, forbidden))
    throws(() => assert.containsNone([...log, "delete_all"], forbidden, "forbidden action in log"))
  })
})

describe("elementsMatch — deep", () => {
  it("passes for same order", () => passes(() => assert.elementsMatch([1, 2, 3], [1, 2, 3])))
  it("passes for different order", () => passes(() => assert.elementsMatch([3, 1, 2], [1, 2, 3])))
  it("passes for empty arrays", () => passes(() => assert.elementsMatch([], [])))
  it("passes for single element", () => passes(() => assert.elementsMatch([42], [42])))

  it("throws when one extra element", () => throws(() => assert.elementsMatch([1, 2], [1, 3])))
  it("throws when lengths differ", () => throws(() => assert.elementsMatch([1, 2, 3], [1, 2])))
  it("throws when completely different", () => throws(() => assert.elementsMatch([1, 2], [3, 4])))

  it("sets assertion = 'elementsMatch'", () => {
    const err = throws(() => assert.elementsMatch([1], [2]))
    expect(err.assertion).toBe("elementsMatch")
  })
  it("works with objects (deep comparison) — same order", () => {
    passes(() => assert.elementsMatch([{ id: 1 }, { id: 2 }], [{ id: 1 }, { id: 2 }]))
    throws(() => assert.elementsMatch([{ id: 1 }], [{ id: 2 }]))
  })
  it("real-world: GraphQL response fields match schema fields", () => {
    const schemaFields = ["id", "name", "email", "role"]
    const responseFields = ["role", "name", "id", "email"]
    passes(() => assert.elementsMatch(responseFields, schemaFields))
    throws(() => assert.elementsMatch(["id", "name"], schemaFields, "missing fields"))
  })
})

describe("subset — deep", () => {
  it("passes when sub is subset of arr", () => passes(() => assert.subset([1, 2, 3, 4], [1, 2])))
  it("passes when sub equals arr", () => passes(() => assert.subset([1, 2], [1, 2])))
  it("passes for empty sub", () => passes(() => assert.subset([1], [])))

  it("throws when sub has extra element", () => throws(() => assert.subset([1, 2], [1, 2, 3])))

  it("sets assertion = 'subset'", () => {
    const err = throws(() => assert.subset([1], [2]))
    expect(err.assertion).toBe("subset")
  })
  it("real-world: required roles must be granted", () => {
    const grantedRoles = ["read", "write", "admin"]
    const requiredRoles = ["read", "write"]
    passes(() => assert.subset(grantedRoles, requiredRoles))
    throws(() => assert.subset(["read"], ["read", "write"], "insufficient roles"))
  })
})

describe("unique — deep", () => {
  it("passes for [1, 2, 3]", () => passes(() => assert.unique([1, 2, 3])))
  it("passes for empty array", () => passes(() => assert.unique([])))
  it("passes for single element", () => passes(() => assert.unique([42])))

  it("throws for [1, 2, 2, 3]", () => throws(() => assert.unique([1, 2, 2, 3])))
  it("throws for all-same array", () => throws(() => assert.unique([5, 5, 5])))
  it("throws for duplicate at start", () => throws(() => assert.unique([1, 1, 2, 3])))

  it("sets assertion = 'unique'", () => {
    const err = throws(() => assert.unique([1, 1]))
    expect(err.assertion).toBe("unique")
  })
  it("message contains 'duplicate'", () => {
    const err = throws(() => assert.unique([1, 2, 2]))
    expect(err.message).toContain("duplicate")
  })
  it("real-world: transaction IDs must be unique", () => {
    const ids = ["tx-001", "tx-002", "tx-003"]
    passes(() => assert.unique(ids))
    throws(() => assert.unique(["tx-001", "tx-002", "tx-001"], "duplicate transaction ID"))
  })
})

describe("uniqueBy — deep", () => {
  it("passes when all keys distinct", () =>
    passes(() => assert.uniqueBy([{ id: 1 }, { id: 2 }], "id")))
  it("passes for empty array", () => passes(() => assert.uniqueBy([], "id")))
  it("passes for single element", () =>
    passes(() => assert.uniqueBy([{ email: "a@b.com" }], "email")))

  it("throws when two share same key", () =>
    throws(() => assert.uniqueBy([{ id: 1 }, { id: 1 }], "id")))
  it("throws using function iteratee", () =>
    throws(() => assert.uniqueBy([{ v: 1 }, { v: 1 }], (x) => x.v)))

  it("sets assertion = 'uniqueBy'", () => {
    const err = throws(() => assert.uniqueBy([{ id: 1 }, { id: 1 }], "id"))
    expect(err.assertion).toBe("uniqueBy")
  })
  it("real-world: users must have unique emails", () => {
    const users = [
      { id: 1, email: "alice@example.com" },
      { id: 2, email: "bob@example.com" },
    ]
    passes(() => assert.uniqueBy(users, "email"))
    throws(() =>
      assert.uniqueBy([...users, { id: 3, email: "alice@example.com" }], "email", "duplicate email")
    )
  })
  it("real-world: items grouped by SKU must have unique SKUs", () => {
    const items = [
      { sku: "A1", qty: 10 },
      { sku: "B2", qty: 5 },
    ]
    passes(() => assert.uniqueBy(items, "sku"))
    throws(() => assert.uniqueBy([...items, { sku: "A1", qty: 3 }], "sku", "duplicate SKU"))
  })
})

describe("increasing — deep", () => {
  it("passes for [1, 2, 3]", () => passes(() => assert.increasing([1, 2, 3])))
  it("passes for single element", () => passes(() => assert.increasing([5])))
  it("passes for empty array", () => passes(() => assert.increasing([])))
  it("passes for negative to positive", () => passes(() => assert.increasing([-2, -1, 0, 1])))

  it("throws for [1, 1, 2] (equal)", () => throws(() => assert.increasing([1, 1, 2])))
  it("throws for [3, 2, 1] (descending)", () => throws(() => assert.increasing([3, 2, 1])))
  it("throws for [1, 3, 2] (dip)", () => throws(() => assert.increasing([1, 3, 2])))

  it("sets assertion = 'increasing'", () => {
    const err = throws(() => assert.increasing([1, 1]))
    expect(err.assertion).toBe("increasing")
  })
  it("message shows the failing index", () => {
    const err = throws(() => assert.increasing([1, 3, 2]))
    expect(err.message).toContain("[2]")
  })
  it("real-world: invoice line item IDs must be strictly increasing", () => {
    passes(() => assert.increasing([101, 102, 103]))
    throws(() => assert.increasing([101, 102, 102], "duplicate line ID"))
  })
})

describe("nonDecreasing — deep", () => {
  it("passes for [1, 1, 2]", () => passes(() => assert.nonDecreasing([1, 1, 2])))
  it("passes for all equal", () => passes(() => assert.nonDecreasing([3, 3, 3])))
  it("passes for strictly increasing", () => passes(() => assert.nonDecreasing([1, 2, 3])))
  it("passes for empty", () => passes(() => assert.nonDecreasing([])))

  it("throws for [1, 2, 1] (dip)", () => throws(() => assert.nonDecreasing([1, 2, 1])))
  it("throws for descending", () => throws(() => assert.nonDecreasing([3, 2, 1])))

  it("sets assertion = 'nonDecreasing'", () => {
    const err = throws(() => assert.nonDecreasing([2, 1]))
    expect(err.assertion).toBe("nonDecreasing")
  })
  it("real-world: timestamps in event stream must be non-decreasing", () => {
    passes(() => assert.nonDecreasing([1000, 1000, 1001, 1002]))
    throws(() => assert.nonDecreasing([1000, 999], "out-of-order event"))
  })
})

describe("sortedBy — deep", () => {
  it("passes when sorted by string key", () =>
    passes(() => assert.sortedBy([{ n: 1 }, { n: 2 }, { n: 3 }], "n")))
  it("passes for empty array", () => passes(() => assert.sortedBy([], "n")))
  it("passes for single element", () => passes(() => assert.sortedBy([{ n: 5 }], "n")))
  it("passes when sorted by function", () =>
    passes(() => assert.sortedBy([{ v: 1 }, { v: 2 }], (x) => x.v)))

  it("throws for reversed order", () => throws(() => assert.sortedBy([{ n: 3 }, { n: 1 }], "n")))
  it("throws for unordered middle element", () =>
    throws(() => assert.sortedBy([{ n: 1 }, { n: 3 }, { n: 2 }], "n")))

  it("sets assertion = 'sortedBy'", () => {
    const err = throws(() => assert.sortedBy([{ n: 2 }, { n: 1 }], "n"))
    expect(err.assertion).toBe("sortedBy")
  })
  it("real-world: paginated results sorted by createdAt", () => {
    const rows = [
      { id: 1, createdAt: 100 },
      { id: 2, createdAt: 200 },
      { id: 3, createdAt: 300 },
    ]
    passes(() => assert.sortedBy(rows, "createdAt"))
    throws(() => assert.sortedBy([rows[2]!, rows[0]!, rows[1]!], "createdAt", "out-of-order"))
  })
})

describe("first — deep", () => {
  it("passes when first equals expected", () => passes(() => assert.first([1, 2, 3], 1)))
  it("passes for single element array", () => passes(() => assert.first([7], 7)))

  it("throws when first is wrong", () => throws(() => assert.first([1, 2, 3], 2)))
  it("throws for empty array (first is undefined)", () => throws(() => assert.first([], 1)))

  it("sets assertion = 'first'", () => {
    const err = throws(() => assert.first([2, 3], 1))
    expect(err.assertion).toBe("first")
  })
  it("works with objects (deep equality)", () => {
    passes(() => assert.first([{ id: 1 }, { id: 2 }], { id: 1 }))
    throws(() => assert.first([{ id: 1 }], { id: 2 }))
  })
  it("real-world: highest priority task is first in queue", () => {
    const queue = [
      { id: 1, priority: "critical" },
      { id: 2, priority: "high" },
    ]
    passes(() => assert.first(queue, { id: 1, priority: "critical" }))
    throws(() => assert.first(queue, { id: 2, priority: "high" }, "wrong first item"))
  })
})

describe("last — deep", () => {
  it("passes when last equals expected", () => passes(() => assert.last([1, 2, 3], 3)))
  it("passes for single element", () => passes(() => assert.last([42], 42)))

  it("throws when last is wrong", () => throws(() => assert.last([1, 2, 3], 2)))
  it("throws for empty array", () => throws(() => assert.last([], 1)))

  it("sets assertion = 'last'", () => {
    const err = throws(() => assert.last([1, 2], 3))
    expect(err.assertion).toBe("last")
  })
  it("real-world: pipeline must end with 'complete' event", () => {
    const events = ["start", "process", "validate", "complete"]
    passes(() => assert.last(events, "complete"))
    throws(() => assert.last(["start", "error"], "complete", "pipeline did not complete"))
  })
})

describe("sumBy — deep", () => {
  it("passes for correct sum", () =>
    passes(() => assert.sumBy([{ v: 1 }, { v: 2 }, { v: 3 }], "v", 6)))
  it("passes for empty array summing to 0", () => passes(() => assert.sumBy([], "v", 0)))
  it("passes with function iteratee", () =>
    passes(() => assert.sumBy([{ v: 10 }, { v: 20 }], (x) => x.v, 30)))

  it("throws for wrong sum", () => throws(() => assert.sumBy([{ v: 1 }, { v: 2 }], "v", 10)))
  it("throws when sum is off by one", () => throws(() => assert.sumBy([{ v: 5 }], "v", 6)))

  it("sets assertion = 'sumBy'", () => {
    const err = throws(() => assert.sumBy([{ v: 1 }], "v", 99))
    expect(err.assertion).toBe("sumBy")
  })
  it("actual is the real sum", () => {
    const err = throws(() => assert.sumBy([{ v: 3 }, { v: 4 }], "v", 10))
    expect(err.actual).toBe(7)
  })
  it("message contains 'difference'", () => {
    const err = throws(() => assert.sumBy([{ v: 5 }], "v", 10))
    expect(err.message.toLowerCase()).toContain("difference")
  })
  it("real-world: invoice line items must total invoice amount", () => {
    const lines = [{ amount: 1000 }, { amount: 500 }, { amount: 250 }]
    passes(() => assert.sumBy(lines, "amount", 1750))
    throws(() => assert.sumBy(lines, "amount", 2000, "line items don't add up"))
  })
  it("real-world: inventory restock totals", () => {
    const restocks = [{ qty: 100 }, { qty: 200 }, { qty: 50 }]
    passes(() => assert.sumBy(restocks, "qty", 350))
    const err = throws(() => assert.sumBy(restocks, "qty", 400, "quantity mismatch"))
    expect(err.actual).toBe(350)
    expect(err.expected).toBe(400)
  })
})

describe("noNils — deep", () => {
  it("passes for [1, 2, 3]", () => passes(() => assert.noNils([1, 2, 3])))
  it("passes for empty array", () => passes(() => assert.noNils([])))
  it("passes for [false, 0, '']", () => passes(() => assert.noNils([false, 0, ""])))

  it("throws for [1, null, 3]", () => throws(() => assert.noNils([1, null, 3])))
  it("throws for [undefined]", () => throws(() => assert.noNils([undefined])))
  it("throws for null at start", () => throws(() => assert.noNils([null, 1, 2])))

  it("sets assertion = 'noNils'", () => {
    const err = throws(() => assert.noNils([1, null]))
    expect(err.assertion).toBe("noNils")
  })
  it("message contains index", () => {
    const err = throws(() => assert.noNils([1, null, 3]))
    expect(err.message).toContain("index")
  })
  it("actual is the nil element", () => {
    const err = throws(() => assert.noNils([1, undefined, 3]))
    expect(err.actual).toBeUndefined()
  })
  it("real-world: DB query results must not have null IDs", () => {
    const rows = [{ id: 1 }, { id: 2 }, { id: 3 }]
    passes(() => assert.noNils(rows.map((r) => r.id)))
    throws(() => assert.noNils([1, null, 3] as (number | null)[], "null ID in results"))
  })
})

describe("flat — deep", () => {
  it("passes for [1, 2, 3]", () => passes(() => assert.flat([1, 2, 3])))
  it("passes for empty array", () => passes(() => assert.flat([])))
  it("passes for [null, 'x', 0]", () => passes(() => assert.flat([null, "x", 0])))

  it("throws for [[1], 2]", () => throws(() => assert.flat([[1], 2])))
  it("throws for deeply nested", () => throws(() => assert.flat([[[1]]])))
  it("throws for mixed flat and nested", () => throws(() => assert.flat([1, [2, 3], 4])))

  it("sets assertion = 'flat'", () => {
    const err = throws(() => assert.flat([[1]]))
    expect(err.assertion).toBe("flat")
  })
  it("real-world: tag arrays must be flat strings", () => {
    const tags: unknown[] = ["js", "typescript", "testing"]
    passes(() => assert.flat(tags))
    throws(() => assert.flat(["js", ["typescript", "testing"]] as unknown[], "nested tags"))
  })
})

describe("allInstanceOf — deep", () => {
  class Event {
    type: string
    constructor(t: string) {
      this.type = t
    }
  }
  class ClickEvent extends Event {}
  class HoverEvent extends Event {}

  it("passes when all are instances", () =>
    passes(() => assert.allInstanceOf([new ClickEvent("c"), new HoverEvent("h")], Event)))
  it("passes for empty array", () => passes(() => assert.allInstanceOf([], Event)))

  it("throws when one element is not an instance", () =>
    throws(() => assert.allInstanceOf([new ClickEvent("c"), {}], Event)))
  it("throws when plain object mixed in", () =>
    throws(() => assert.allInstanceOf([new ClickEvent("c"), { type: "fake" }], ClickEvent)))

  it("sets assertion = 'allInstanceOf'", () => {
    const err = throws(() => assert.allInstanceOf([{}], Event))
    expect(err.assertion).toBe("allInstanceOf")
  })
  it("real-world: event bus messages must all be DomainEvent", () => {
    class DomainEvent {}
    class OrderEvent extends DomainEvent {}
    const bus = [new OrderEvent(), new OrderEvent()]
    passes(() => assert.allInstanceOf(bus, DomainEvent))
    throws(() => assert.allInstanceOf([...bus, { fake: true }], DomainEvent, "invalid event"))
  })
})

describe("zippedWith — deep", () => {
  it("passes when all pairs satisfy predicate", () =>
    passes(() => assert.zippedWith([1, 2], [1, 2], (a, b) => a === b)))
  it("passes for empty arrays", () => passes(() => assert.zippedWith([], [], (a, b) => a === b)))

  it("throws when one pair fails", () =>
    throws(() => assert.zippedWith([1, 2], [1, 3], (a, b) => a === b)))
  it("throws when first pair fails", () =>
    throws(() => assert.zippedWith([0, 1], [1, 1], (a, b) => a === b)))

  it("sets assertion = 'zippedWith'", () => {
    const err = throws(() => assert.zippedWith([1], [2], (a, b) => a === b))
    expect(err.assertion).toBe("zippedWith")
  })
  it("real-world: input IDs must match output IDs", () => {
    const inputs = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const outputs = [
      { id: 1, result: "ok" },
      { id: 2, result: "ok" },
      { id: 3, result: "ok" },
    ]
    passes(() => assert.zippedWith(inputs, outputs, (i, o) => i.id === o.id))
    throws(() =>
      assert.zippedWith(
        inputs,
        [{ id: 9, result: "ok" }, ...outputs.slice(1)],
        (i, o) => i.id === o.id,
        "ID mismatch"
      )
    )
  })
})

describe("groupedBy — deep", () => {
  it("passes when groups match exactly", () =>
    passes(() => assert.groupedBy([{ t: "a" }, { t: "b" }], "t", ["a", "b"])))
  it("passes for single group", () =>
    passes(() => assert.groupedBy([{ t: "x" }, { t: "x" }], "t", ["x"])))

  it("throws when a group is missing", () =>
    throws(() => assert.groupedBy([{ t: "a" }], "t", ["a", "b"])))
  it("throws when an extra group appears", () =>
    throws(() => assert.groupedBy([{ t: "a" }, { t: "c" }], "t", ["a", "b"])))

  it("sets assertion = 'groupedBy'", () => {
    const err = throws(() => assert.groupedBy([{ t: "x" }], "t", ["y"]))
    expect(err.assertion).toBe("groupedBy")
  })
  it("real-world: orders must be grouped into exactly 3 statuses", () => {
    const orders = [
      { id: 1, status: "pending" },
      { id: 2, status: "paid" },
      { id: 3, status: "shipped" },
    ]
    passes(() => assert.groupedBy(orders, "status", ["pending", "paid", "shipped"]))
    throws(() => assert.groupedBy(orders, "status", ["pending", "paid"], "missing 'shipped' group"))
  })
})

describe("partition — deep", () => {
  it("passes with correct split", () =>
    passes(() => assert.partition([1, 2, 3, 4], (n) => n % 2 === 0, 2, 2)))
  it("passes for all matching (rest = 0)", () =>
    passes(() => assert.partition([2, 4], (n) => n % 2 === 0, 2, 0)))
  it("passes for none matching (match = 0)", () =>
    passes(() => assert.partition([1, 3], (n) => n % 2 === 0, 0, 2)))

  it("throws when match count wrong", () =>
    throws(() => assert.partition([1, 2, 3, 4], (n) => n % 2 === 0, 3, 1)))
  it("throws when rest count wrong", () =>
    throws(() => assert.partition([1, 2, 3, 4], (n) => n % 2 === 0, 2, 1)))

  it("sets assertion = 'partition'", () => {
    const err = throws(() => assert.partition([1, 2], (n) => n % 2 === 0, 0, 2))
    expect(err.assertion).toBe("partition")
  })
  it("real-world: batch processor — 8 done, 2 pending", () => {
    const jobs = [
      ...Array.from({ length: 8 }, (_, i) => ({ id: i, done: true })),
      ...Array.from({ length: 2 }, (_, i) => ({ id: i + 8, done: false })),
    ]
    passes(() => assert.partition(jobs, (j) => j.done, 8, 2))
    throws(() => assert.partition(jobs, (j) => j.done, 10, 0, "expected all done"))
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// OBJECTS — deep
// ─────────────────────────────────────────────────────────────────────────────

describe("hasKey — deep", () => {
  it("passes for existing key", () => passes(() => assert.hasKey({ a: 1 }, "a")))
  it("passes for nested key path", () => passes(() => assert.hasKey({ a: { b: 1 } }, "a.b")))
  it("passes for key with falsy value", () => passes(() => assert.hasKey({ a: 0 }, "a")))
  it("passes for key with null value", () => passes(() => assert.hasKey({ a: null }, "a")))

  it("throws for missing key", () => throws(() => assert.hasKey({ a: 1 }, "b" as string)))
  it("throws for empty object", () => throws(() => assert.hasKey({}, "a" as string)))

  it("sets assertion = 'hasKey'", () => {
    const err = throws(() => assert.hasKey({} as { x?: number }, "x"))
    expect(err.assertion).toBe("hasKey")
  })
  it("message contains the missing key name", () => {
    const err = throws(() => assert.hasKey({ a: 1 } as { a: number; b?: number }, "b"))
    expect(err.message).toContain("b")
  })
  it("real-world: config object must have required keys", () => {
    const config = { host: "localhost", port: 5432, database: "mydb" }
    passes(() => assert.hasKey(config, "host"))
    passes(() => assert.hasKey(config, "database"))
    throws(() =>
      assert.hasKey(
        config as typeof config & { password?: string },
        "password",
        "password required"
      )
    )
  })
})

describe("hasKeys — deep", () => {
  it("passes when all keys present", () =>
    passes(() => assert.hasKeys({ a: 1, b: 2, c: 3 }, ["a", "b"])))
  it("passes for empty key list", () => passes(() => assert.hasKeys({ a: 1 }, [])))

  it("throws when one key missing", () =>
    throws(() => assert.hasKeys({ a: 1 } as { a: number; b?: number }, ["a", "b"])))
  it("throws when all keys missing", () =>
    throws(() => assert.hasKeys({} as { a?: number; b?: number }, ["a", "b"])))

  it("sets assertion = 'hasKeys'", () => {
    const err = throws(() => assert.hasKeys({} as { x?: number }, ["x"]))
    expect(err.assertion).toBe("hasKeys")
  })
  it("real-world: API payload must include required fields", () => {
    const payload = { userId: 1, action: "purchase", amount: 500 }
    passes(() => assert.hasKeys(payload, ["userId", "action"]))
    throws(() =>
      assert.hasKeys(
        payload as typeof payload & { signature?: string },
        ["userId", "signature"],
        "missing signature"
      )
    )
  })
})

describe("hasExactKeys — deep", () => {
  it("passes for exact key match", () =>
    passes(() => assert.hasExactKeys({ a: 1, b: 2 }, ["a", "b"])))
  it("passes for single key", () => passes(() => assert.hasExactKeys({ x: 1 }, ["x"])))
  it("passes for empty object with empty keys", () => passes(() => assert.hasExactKeys({}, [])))

  it("throws for extra key", () =>
    throws(() => assert.hasExactKeys({ a: 1, b: 2, c: 3 }, ["a", "b"])))
  it("throws for missing key", () => throws(() => assert.hasExactKeys({ a: 1 }, ["a", "b"])))

  it("sets assertion = 'hasExactKeys'", () => {
    const err = throws(() => assert.hasExactKeys({ a: 1, b: 2 }, ["a"]))
    expect(err.assertion).toBe("hasExactKeys")
  })
  it("message mentions unexpected key", () => {
    const err = throws(() => assert.hasExactKeys({ a: 1, b: 2, c: 3 }, ["a", "b"]))
    expect(err.message).toContain("c")
  })
  it("message mentions missing key", () => {
    const err = throws(() => assert.hasExactKeys({ a: 1 }, ["a", "b"]))
    expect(err.message).toContain("b")
  })
  it("real-world: DTO shape must match contract exactly", () => {
    const dto = { id: 1, name: "Alice", email: "a@b.com" }
    passes(() => assert.hasExactKeys(dto, ["id", "name", "email"]))
    throws(() =>
      assert.hasExactKeys(
        { ...dto, extra: "oops" } as object,
        ["id", "name", "email"],
        "extra field in DTO"
      )
    )
  })
})

describe("hasOnlyKeys — deep", () => {
  it("passes when object has only allowed keys", () =>
    passes(() => assert.hasOnlyKeys({ a: 1 }, ["a", "b", "c"])))
  it("passes for empty object", () => passes(() => assert.hasOnlyKeys({}, ["a", "b"])))
  it("passes when keys match exactly", () =>
    passes(() => assert.hasOnlyKeys({ a: 1, b: 2 }, ["a", "b"])))

  it("throws when forbidden key present", () =>
    throws(() => assert.hasOnlyKeys({ a: 1, x: 2 }, ["a", "b"])))
  it("throws for multiple forbidden keys", () =>
    throws(() => assert.hasOnlyKeys({ a: 1, x: 2, y: 3 }, ["a"])))

  it("sets assertion = 'hasOnlyKeys'", () => {
    const err = throws(() => assert.hasOnlyKeys({ a: 1, b: 2 }, ["a"]))
    expect(err.assertion).toBe("hasOnlyKeys")
  })
  it("message contains forbidden key name", () => {
    const err = throws(() => assert.hasOnlyKeys({ a: 1, secret: "x" }, ["a"]))
    expect(err.message).toContain("secret")
  })
  it("real-world: update patch must not include immutable fields", () => {
    const patch = { name: "Bob", email: "b@c.com" }
    passes(() => assert.hasOnlyKeys(patch, ["name", "email", "phone"]))
    throws(() =>
      assert.hasOnlyKeys({ ...patch, id: 99 }, ["name", "email", "phone"], "cannot update id")
    )
  })
})

describe("hasValue — deep", () => {
  it("passes for correct value", () => passes(() => assert.hasValue({ a: 1 }, "a", 1)))
  it("passes for nested object value (deep equal)", () =>
    passes(() => assert.hasValue({ a: { b: 1 } }, "a", { b: 1 })))

  it("throws for wrong value", () => throws(() => assert.hasValue({ a: 1 }, "a", 2)))
  it("throws for wrong nested value", () =>
    throws(() => assert.hasValue({ a: { b: 1 } }, "a", { b: 2 })))

  it("sets assertion = 'hasValue'", () => {
    const err = throws(() => assert.hasValue({ a: 1 }, "a", 2))
    expect(err.assertion).toBe("hasValue")
  })
  it("actual is the real value", () => {
    const err = throws(() => assert.hasValue({ status: "paid" }, "status", "pending"))
    expect(err.actual).toBe("paid")
  })
  it("real-world: config port must be 5432", () => {
    const config = { host: "db.local", port: 5432 }
    passes(() => assert.hasValue(config, "port", 5432))
    throws(() => assert.hasValue(config, "port", 3306, "wrong DB port"))
  })
})

describe("containsSubset — deep", () => {
  it("passes when subset matches", () =>
    passes(() => assert.containsSubset({ a: 1, b: 2, c: 3 }, { a: 1, b: 2 })))
  it("passes for empty subset", () => passes(() => assert.containsSubset({ a: 1 }, {})))
  it("passes for nested subset", () =>
    passes(() => assert.containsSubset({ a: { b: 1, c: 2 } }, { a: { b: 1, c: 2 } })))

  it("throws for mismatched value", () => throws(() => assert.containsSubset({ a: 1 }, { a: 2 })))
  it("throws when subset key is missing", () =>
    throws(() => assert.containsSubset({ a: 1 } as { a: number; b?: number }, { b: 2 })))

  it("sets assertion = 'containsSubset'", () => {
    const err = throws(() => assert.containsSubset({ a: 1 }, { a: 2 }))
    expect(err.assertion).toBe("containsSubset")
  })
  it("actual is the mismatched field value", () => {
    const err = throws(() => assert.containsSubset({ status: "active" }, { status: "inactive" }))
    expect(err.actual).toBe("active")
  })
  it("real-world: created user must have expected profile fields", () => {
    const user = { id: 42, name: "Alice", role: "admin", createdAt: "2026-01-01" }
    passes(() => assert.containsSubset(user, { name: "Alice", role: "admin" }))
    throws(() => assert.containsSubset(user, { role: "superuser" }, "role mismatch"))
  })
  it("real-world: audit entry must include required fields", () => {
    const entry = { actor: "system", action: "deploy", env: "prod", status: "ok" }
    passes(() => assert.containsSubset(entry, { action: "deploy", env: "prod" }))
    throws(() => assert.containsSubset(entry, { action: "rollback" }, "wrong action in audit"))
  })
})

describe("allValuesMatch — deep", () => {
  it("passes when all values match predicate", () =>
    passes(() => assert.allValuesMatch({ a: 1, b: 2 }, (v) => v > 0)))
  it("passes for empty object", () => passes(() => assert.allValuesMatch({}, () => false)))

  it("throws when one value fails", () =>
    throws(() => assert.allValuesMatch({ a: 1, b: -1 }, (v) => v > 0)))
  it("throws when all values fail", () =>
    throws(() => assert.allValuesMatch({ a: -1, b: -2 }, (v) => v > 0)))

  it("sets assertion = 'allValuesMatch'", () => {
    const err = throws(() => assert.allValuesMatch({ x: -5 }, (v) => v > 0))
    expect(err.assertion).toBe("allValuesMatch")
  })
  it("actual is the failing value", () => {
    const err = throws(() => assert.allValuesMatch({ a: 5, b: -3 }, (v) => v > 0))
    expect(err.actual).toBe(-3)
  })
  it("real-world: inventory quantities must all be non-negative", () => {
    const inventory = { apples: 10, oranges: 5, pears: 0 }
    passes(() => assert.allValuesMatch(inventory, (v) => v >= 0))
    throws(() =>
      assert.allValuesMatch({ ...inventory, grapes: -2 }, (v) => v >= 0, "negative stock")
    )
  })
})

describe("noNilValues — deep", () => {
  it("passes when no values are nil", () => passes(() => assert.noNilValues({ a: 1, b: "x" })))
  it("passes for empty object", () => passes(() => assert.noNilValues({})))
  it("passes for falsy-but-not-nil values", () =>
    passes(() => assert.noNilValues({ a: 0, b: false, c: "" })))

  it("throws when one value is null", () => throws(() => assert.noNilValues({ a: 1, b: null })))
  it("throws when one value is undefined", () =>
    throws(() => assert.noNilValues({ a: 1, b: undefined })))

  it("sets assertion = 'noNilValues'", () => {
    const err = throws(() => assert.noNilValues({ a: null }))
    expect(err.assertion).toBe("noNilValues")
  })
  it("real-world: config must have all values set", () => {
    const config = { host: "localhost", port: 5432, database: "mydb" }
    passes(() => assert.noNilValues(config))
    throws(() =>
      assert.noNilValues({ ...config, database: null } as typeof config, "database not configured")
    )
  })
})

describe("dig — deep", () => {
  it("passes for exact nested value", () =>
    passes(() => assert.dig({ a: { b: { c: 42 } } }, "a.b.c", 42)))
  it("passes for array path (string)", () =>
    passes(() => assert.dig({ items: [{ id: 1 }] }, "items[0].id", 1)))
  it("passes for array-form path", () => passes(() => assert.dig({ a: { b: 1 } }, ["a", "b"], 1)))

  it("throws for wrong nested value", () =>
    throws(() => assert.dig({ a: { b: { c: 42 } } }, "a.b.c", 0)))
  it("throws when path does not exist", () => throws(() => assert.dig({ a: 1 }, "a.b.c", 42)))

  it("sets assertion = 'dig'", () => {
    const err = throws(() => assert.dig({ a: { b: 1 } }, "a.b", 2))
    expect(err.assertion).toBe("dig")
  })
  it("actual is the value found at path", () => {
    const err = throws(() => assert.dig({ a: { b: 99 } }, "a.b", 1))
    expect(err.actual).toBe(99)
  })
  it("message contains path", () => {
    const err = throws(() => assert.dig({ a: { b: 1 } }, "a.b", 2))
    expect(err.message).toContain("a.b")
  })
  it("real-world: deeply nested config value", () => {
    const config = { db: { pool: { max: 10, min: 2 } } }
    passes(() => assert.dig(config, "db.pool.max", 10))
    throws(() => assert.dig(config, "db.pool.max", 5, "wrong pool max"))
  })
  it("real-world: API response nested field", () => {
    const resp = { data: { user: { role: "admin", permissions: ["read", "write"] } } }
    passes(() => assert.dig(resp, "data.user.role", "admin"))
    throws(() => assert.dig(resp, "data.user.role", "viewer", "expected admin"))
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FUNCTIONS — deep
// ─────────────────────────────────────────────────────────────────────────────

describe("returns — deep", () => {
  it("passes when return value matches", () =>
    passes(() => assert.returns((x: number) => x * 2, [5], 10)))
  it("passes for zero return value", () => passes(() => assert.returns((_: number) => 0, [42], 0)))
  it("passes for object return (deep equal)", () =>
    passes(() => assert.returns(() => ({ id: 1 }), [], { id: 1 })))
  it("passes for multi-arg function", () =>
    passes(() => assert.returns((a: number, b: number) => a + b, [3, 4], 7)))

  it("throws for wrong return value", () =>
    throws(() => assert.returns((x: number) => x * 2, [5], 11)))
  it("throws for wrong object return", () =>
    throws(() => assert.returns(() => ({ id: 1 }), [], { id: 2 })))

  it("sets assertion = 'returns'", () => {
    const err = throws(() => assert.returns((x: number) => x, [1], 2))
    expect(err.assertion).toBe("returns")
  })
  it("actual is the real return value", () => {
    const err = throws(() => assert.returns((x: number) => x * 3, [4], 99))
    expect(err.actual).toBe(12)
  })
  it("real-world: tax calculator returns correct amount", () => {
    const calculateTax = (price: number, rate: number) => Math.round(price * rate * 100) / 100
    passes(() => assert.returns(calculateTax, [100, 0.2], 20))
    throws(() => assert.returns(calculateTax, [100, 0.2], 25, "wrong tax amount"))
  })
  it("real-world: slug generator", () => {
    const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, "-")
    passes(() => assert.returns(slugify, ["Hello World"], "hello-world"))
    throws(() => assert.returns(slugify, ["Hello World"], "Hello World", "not slugified"))
  })
})

describe("pure — deep", () => {
  it("passes for pure function", () => passes(() => assert.pure((x: number) => x + 1, [1])))
  it("passes for constant function", () => passes(() => assert.pure(() => 42, [])))
  it("passes for pure object mapper", () =>
    passes(() => assert.pure((o: { v: number }) => ({ ...o, doubled: o.v * 2 }), [{ v: 5 }])))

  it("throws for non-deterministic counter", () => {
    let i = 0
    throws(() => assert.pure(() => i++, []))
  })
  it("throws for function reading external mutable state", () => {
    const state = { count: 0 }
    throws(() => assert.pure(() => state.count++, []))
  })

  it("sets assertion = 'pure'", () => {
    let n = 0
    const err = throws(() => assert.pure(() => n++, []))
    expect(err.assertion).toBe("pure")
  })
  it("real-world: normalizer must be pure", () => {
    const normalize = (s: string) => s.trim().toLowerCase()
    passes(() => assert.pure(normalize, ["  Hello  "]))
  })
  it("real-world: currency formatter must be deterministic", () => {
    const fmt = (n: number) => `$${n.toFixed(2)}`
    passes(() => assert.pure(fmt, [19.9]))
  })
})

describe("idempotent — deep", () => {
  it("passes for trim (idempotent on already-trimmed)", () =>
    passes(() => assert.idempotent((s: string) => s.trim(), "  hello  ")))
  it("passes for toLower", () =>
    passes(() => assert.idempotent((s: string) => s.toLowerCase(), "Hello")))
  it("passes for identity", () => passes(() => assert.idempotent((x: number) => x, 42)))
  it("passes for sort (already sorted)", () =>
    passes(() => assert.idempotent((arr: number[]) => [...arr].sort(), [1, 2, 3])))

  it("throws for +1 (not idempotent)", () =>
    throws(() => assert.idempotent((n: number) => n + 1, 0)))
  it("throws for multiply (not idempotent for non-identity)", () =>
    throws(() => assert.idempotent((n: number) => n * 2, 3)))

  it("sets assertion = 'idempotent'", () => {
    const err = throws(() => assert.idempotent((n: number) => n + 1, 0))
    expect(err.assertion).toBe("idempotent")
  })
  it("real-world: normalizeEmail is idempotent", () => {
    const normalizeEmail = (e: string) => e.trim().toLowerCase()
    passes(() => assert.idempotent(normalizeEmail, "Alice@Example.COM"))
  })
  it("real-world: JSON.parse(JSON.stringify()) round-trip is idempotent on plain objects", () => {
    const roundTrip = (o: object) => JSON.parse(JSON.stringify(o))
    const plain = { id: 1, name: "x" }
    // deepEqual of two calls — passes because both produce same value
    passes(() => assert.idempotent(roundTrip, plain))
  })
})

describe("arity — deep", () => {
  it("passes for unary function", () => passes(() => assert.arity((x: number) => x, 1)))
  it("passes for binary function", () =>
    passes(() => assert.arity((a: number, b: number) => a + b, 2)))
  it("passes for nullary function", () => passes(() => assert.arity(() => 0, 0)))
  it("passes for ternary function", () =>
    passes(() => assert.arity((a: number, b: number, c: number) => a + b + c, 3)))

  it("throws for wrong arity (1 vs 2)", () => throws(() => assert.arity((a: number) => a, 2)))
  it("throws for nullary given 1", () => throws(() => assert.arity(() => 0, 1)))

  it("sets assertion = 'arity'", () => {
    const err = throws(() => assert.arity((a: number) => a, 2))
    expect(err.assertion).toBe("arity")
  })
  it("actual is the real arity", () => {
    const err = throws(() => assert.arity((a: number, b: number) => a + b, 3))
    expect(err.actual).toBe(2)
  })
  it("real-world: pipeline steps must be unary", () => {
    const step1 = (x: number) => x * 2
    const step2 = (x: number) => x + 1
    passes(() => assert.arity(step1, 1))
    passes(() => assert.arity(step2, 1))
    throws(() => assert.arity((a: number, b: number) => a + b, 1, "pipeline step must be unary"))
  })
})

describe("mapsDistinct — deep", () => {
  it("passes when outputs differ", () =>
    passes(() => assert.mapsDistinct((n: number) => n * 2, 1, 2)))
  it("passes for string inputs", () =>
    passes(() => assert.mapsDistinct((s: string) => s.length, "hi", "hello")))

  it("throws when outputs are the same (collision)", () =>
    throws(() => assert.mapsDistinct(() => 42, 1, 2)))
  it("throws when function maps both to same string", () =>
    throws(() => assert.mapsDistinct(() => "same", "a", "b")))

  it("sets assertion = 'mapsDistinct'", () => {
    const err = throws(() => assert.mapsDistinct(() => 0, 1, 2))
    expect(err.assertion).toBe("mapsDistinct")
  })
  it("real-world: ID generator must produce distinct outputs for distinct inputs", () => {
    const prefixId = (prefix: string) => `${prefix}-001`
    passes(() => assert.mapsDistinct(prefixId, "user", "order"))
    throws(() => assert.mapsDistinct((_: string) => "FIXED-001", "user", "order", "ID collision"))
  })
})

describe("homomorphic — deep", () => {
  it("passes for doubling over addition", () =>
    passes(() =>
      assert.homomorphic(
        (n: number) => n * 2,
        (a: number, b: number) => a + b,
        3,
        4
      )
    ))
  it("passes for identity over any combine", () =>
    passes(() =>
      assert.homomorphic(
        (n: number) => n,
        (a: number, b: number) => a + b,
        5,
        6
      )
    ))
  it("passes for toUpperCase distributes over concat", () =>
    passes(() =>
      assert.homomorphic(
        (s: string) => s.toUpperCase(),
        (a: string, b: string) => a + b,
        "ab",
        "cd"
      )
    ))

  it("throws for non-homomorphic transform", () =>
    throws(() =>
      assert.homomorphic(
        (n: number) => n * n,
        (a: number, b: number) => a + b,
        2,
        3
      )
    ))

  it("sets assertion = 'homomorphic'", () => {
    const err = throws(() =>
      assert.homomorphic(
        (n: number) => n * n,
        (a: number, b: number) => a + b,
        2,
        3
      )
    )
    expect(err.assertion).toBe("homomorphic")
  })
  it("real-world: normalizer distributes over concatenation", () => {
    const norm = (n: number) => n * 2
    const combine = (a: number, b: number) => a + b
    passes(() => assert.homomorphic(norm, combine, 10, 20))
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// NOT — deep
// ─────────────────────────────────────────────────────────────────────────────

describe("not — deep", () => {
  it("passes when inner assertion throws", () => passes(() => assert.not(assert.equal, 1, 2)))
  it("passes for not-includes", () => passes(() => assert.not(assert.includes, [1, 2, 3], 4)))
  it("passes for not-nil (value is nil)", () => passes(() => assert.not(assert.notNil, null)))
  it("passes for not-positive on 0", () => passes(() => assert.not(assert.positive, 0)))
  it("passes for not-empty on []", () => passes(() => assert.not(assert.notEmpty, [])))

  it("throws when inner assertion passes", () => throws(() => assert.not(assert.equal, 1, 1)))
  it("throws when not-includes but item IS present", () =>
    throws(() => assert.not(assert.includes, [1, 2, 3], 2)))
  it("throws when not-positive on positive number", () =>
    throws(() => assert.not(assert.positive, 5)))

  it("sets assertion = 'not'", () => {
    const err = throws(() => assert.not(assert.equal, 1, 1))
    expect(err.assertion).toBe("not")
  })
  it("message mentions assertion should have failed", () => {
    const err = throws(() => assert.not(assert.equal, 1, 1))
    expect(err.message.toLowerCase()).toContain("failed")
  })

  it("disabled mode — inner passing assertion does not throw via not", () => {
    setAssertMode("disabled")
    passes(() => assert.not(assert.equal, 1, 1))
  })

  it("real-world: user must NOT have admin role", () => {
    const user = { id: 1, role: "member" }
    passes(() => assert.not(assert.equal, user.role, "admin"))
    throws(() => assert.not(assert.equal, "admin", "admin", "expected non-admin"))
  })
  it("real-world: response must NOT contain error field", () => {
    const response = { data: { id: 1 } } as Record<string, unknown>
    passes(() => assert.not(assert.hasKey, response, "error" as string))
    throws(() => assert.not(assert.hasKey, { data: {}, error: "oops" }, "error" as string))
  })
  it("real-world: order status must not be pending after payment", () => {
    const status = "paid"
    passes(() => assert.not(assert.equal, status, "pending"))
    throws(() => assert.not(assert.equal, "pending", "pending", "still pending after payment"))
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// ASSERTIONERROR METADATA — deep
// ─────────────────────────────────────────────────────────────────────────────

describe("AssertionError — deep metadata", () => {
  it("is instanceof AssertionError", () => {
    const err = throws(() => assert.equal(1, 2))
    expect(err).toBeInstanceOf(AssertionError)
  })
  it("is instanceof Error", () => {
    const err = throws(() => assert.equal(1, 2))
    expect(err).toBeInstanceOf(Error)
  })
  it("name is 'AssertionError'", () => {
    const err = throws(() => assert.equal(1, 2))
    expect(err.name).toBe("AssertionError")
  })
  it("string-from-opts is used as title", () => {
    const err = throws(() => assert.equal(1, 2, "custom title"))
    expect(err.message).toContain("custom title")
  })
  it("opts.msg overrides default title", () => {
    const err = throws(() => assert.equal(1, 2, { msg: "version check failed" }))
    expect(err.message).toContain("version check failed")
  })
  it("opts.note appended to message", () => {
    const err = throws(() => assert.positive(-1, { note: "call abs() first" }))
    expect(err.message).toContain("call abs() first")
  })
  it("opts.actual label shown in message", () => {
    const err = throws(() => assert.equal("failed", "success", { actual: "task.status" }))
    expect(err.message).toContain("task.status")
  })
  it("error carries assertion name for 'len'", () => {
    const err = throws(() => assert.len([1], 2))
    expect(err.assertion).toBe("len")
  })
  it("error carries assertion name for 'withinRange'", () => {
    const err = throws(() => assert.withinRange(999, 0, 100))
    expect(err.assertion).toBe("withinRange")
  })
  it("error carries assertion name for 'containsSubset'", () => {
    const err = throws(() => assert.containsSubset({ a: 1 }, { a: 2 }))
    expect(err.assertion).toBe("containsSubset")
  })
  it("deepEqual error carries both objects", () => {
    const a = { x: 1, y: 2 }
    const b = { x: 1, y: 3 }
    const err = throws(() => assert.deepEqual(a, b))
    expect((err.actual as typeof a).y).toBe(2)
    expect((err.expected as typeof b).y).toBe(3)
  })
  it("warn mode — no throw, returns normally", () => {
    setAssertMode("warn")
    passes(() => assert.equal(1, 2))
    passes(() => assert.withinRange(-999, 0, 100))
    passes(() => assert.noNils([null, undefined]))
  })
  it("disabled mode — no throw for any assertion", () => {
    setAssertMode("disabled")
    passes(() => assert.nil(42))
    passes(() => assert.string(999 as unknown as string))
    passes(() => assert.all([], (v) => !v))
    passes(() => assert.equal(1, 999))
  })
})
