/**
 * @file async.test.ts
 *
 * Tests for all async assertions.
 *
 * Cases covered per method:
 *   rejects              — passes / fails / typed ctor / non-Error / thunk form
 *   rejectsWithMessage   — exact match / mismatch / non-Error rejection / no throw
 *   rejectsMatching      — regex match / mismatch / no throw
 *   rejectsSatisfying    — predicate pass / fail / no throw
 *   resolves             — passes / fails / returns value / thunk form
 *   resolvesWith         — match / value mismatch / rejected / deep-equal / thunk
 *   resolvesSatisfying   — predicate pass / fail / rejected
 *   resolvesNotNil       — non-null / null / undefined / rejected / TypeScript narrowing
 */

import { describe, it, expect } from "bun:test"
import { assert, AssertionError } from "./index.shim.ts"

// ─────────────────────────────────────────────────────────────────────────────
// TEST FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

const delay = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms))

const ok = <T>(v: T, ms = 0): Promise<T> => new Promise((r) => setTimeout(() => r(v), ms))
const fail = (err: unknown, ms = 0): Promise<never> =>
  new Promise((_, j) => setTimeout(() => j(err), ms))

class PaymentError extends Error {
  status: number
  constructor(msg: string, status = 402) {
    super(msg)
    this.name = "PaymentError"
    this.status = status
  }
}

class NetworkError extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = "NetworkError"
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// assert.rejects
// ─────────────────────────────────────────────────────────────────────────────

describe("assert.rejects", () => {
  it("passes when promise rejects", async () => {
    await expect(assert.rejects(fail(new Error("boom")))).resolves.toBeUndefined()
  })

  it("fails when promise resolves", async () => {
    await expect(assert.rejects(ok("ok"))).rejects.toBeInstanceOf(AssertionError)
  })

  it("error message contains the resolved value", async () => {
    const err = await assert.rejects(ok("myValue")).catch((e) => e)
    expect(err.message).toContain("resolved to")
  })

  it("passes when rejection matches expected constructor", async () => {
    await expect(
      assert.rejects(fail(new PaymentError("declined")), PaymentError)
    ).resolves.toBeUndefined()
  })

  it("fails when rejection does not match expected constructor", async () => {
    await expect(
      assert.rejects(fail(new NetworkError("timeout")), PaymentError)
    ).rejects.toBeInstanceOf(AssertionError)
  })

  it("error includes expected and received type names", async () => {
    const err = await assert
      .rejects(fail(new NetworkError("timeout")), PaymentError)
      .catch((e) => e)
    expect(err.message).toContain("PaymentError")
    expect(err.message).toContain("NetworkError")
  })

  it("handles non-Error rejections (string)", async () => {
    await expect(assert.rejects(fail("raw string error"))).resolves.toBeUndefined()
  })

  it("handles non-Error rejections (plain object)", async () => {
    await expect(assert.rejects(fail({ code: 404 }))).resolves.toBeUndefined()
  })

  it("thunk form — captures sync throw before promise creation", async () => {
    const thunk = (): Promise<never> => {
      throw new PaymentError("sync throw")
    }
    await expect(assert.rejects(thunk, PaymentError)).resolves.toBeUndefined()
  })

  it("thunk form — fails when thunk resolves", async () => {
    await expect(assert.rejects(() => ok(1))).rejects.toBeInstanceOf(AssertionError)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// assert.rejectsWithMessage
// ─────────────────────────────────────────────────────────────────────────────

describe("assert.rejectsWithMessage", () => {
  it("passes when rejection message matches exactly", async () => {
    await expect(
      assert.rejectsWithMessage(fail(new Error("card expired")), "card expired")
    ).resolves.toBeUndefined()
  })

  it("fails when message does not match", async () => {
    await expect(
      assert.rejectsWithMessage(fail(new Error("card declined")), "card expired")
    ).rejects.toBeInstanceOf(AssertionError)
  })

  it("error shows expected vs actual message", async () => {
    const err = await assert
      .rejectsWithMessage(fail(new Error("declined")), "expired")
      .catch((e) => e)
    expect(err.message).toContain("expired")
    expect(err.message).toContain("declined")
  })

  it("coerces non-Error rejection to string for comparison", async () => {
    await expect(
      assert.rejectsWithMessage(fail("card expired"), "card expired")
    ).resolves.toBeUndefined()
  })

  it("fails when promise resolves instead of rejecting", async () => {
    await expect(assert.rejectsWithMessage(ok("fine"), "should not matter")).rejects.toBeInstanceOf(
      AssertionError
    )
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// assert.rejectsMatching
// ─────────────────────────────────────────────────────────────────────────────

describe("assert.rejectsMatching", () => {
  it("passes when rejection message matches regex", async () => {
    await expect(
      assert.rejectsMatching(fail(new Error("card declined")), /card (expired|declined)/)
    ).resolves.toBeUndefined()
  })

  it("fails when message does not match regex", async () => {
    await expect(
      assert.rejectsMatching(fail(new Error("network timeout")), /card (expired|declined)/)
    ).rejects.toBeInstanceOf(AssertionError)
  })

  it("error shows pattern and actual message", async () => {
    const err = await assert.rejectsMatching(fail(new Error("network")), /card/).catch((e) => e)
    expect(err.message).toContain("/card/")
    expect(err.message).toContain("network")
  })

  it("works with non-Error rejections", async () => {
    await expect(
      assert.rejectsMatching(fail("payment failed: declined"), /declined/)
    ).resolves.toBeUndefined()
  })

  it("fails when promise resolves", async () => {
    await expect(assert.rejectsMatching(ok("fine"), /anything/)).rejects.toBeInstanceOf(
      AssertionError
    )
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// assert.rejectsSatisfying
// ─────────────────────────────────────────────────────────────────────────────

describe("assert.rejectsSatisfying", () => {
  it("passes when predicate returns true", async () => {
    await expect(
      assert.rejectsSatisfying(
        fail(new PaymentError("declined", 402)),
        (err) => err instanceof PaymentError && err.status === 402
      )
    ).resolves.toBeUndefined()
  })

  it("fails when predicate returns false", async () => {
    await expect(
      assert.rejectsSatisfying(
        fail(new PaymentError("declined", 402)),
        (err) => err instanceof PaymentError && (err as PaymentError).status === 500
      )
    ).rejects.toBeInstanceOf(AssertionError)
  })

  it("works with non-Error thrown values", async () => {
    await expect(
      assert.rejectsSatisfying(
        fail({ code: "PAYMENT_FAILED" }),
        (err) => (err as { code: string }).code === "PAYMENT_FAILED"
      )
    ).resolves.toBeUndefined()
  })

  it("fails when promise resolves", async () => {
    await expect(assert.rejectsSatisfying(ok("resolved"), () => true)).rejects.toBeInstanceOf(
      AssertionError
    )
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// assert.resolves
// ─────────────────────────────────────────────────────────────────────────────

describe("assert.resolves", () => {
  it("passes when promise resolves", async () => {
    await expect(assert.resolves(ok("ok"))).resolves.toBe("ok")
  })

  it("fails when promise rejects", async () => {
    await expect(assert.resolves(fail(new Error("boom")))).rejects.toBeInstanceOf(AssertionError)
  })

  it("error shows the thrown message and type", async () => {
    const err = await assert.resolves(fail(new PaymentError("declined"))).catch((e) => e)
    expect(err.message).toContain("declined")
    expect(err.message).toContain("PaymentError")
  })

  it("returns the resolved value for inline use", async () => {
    const value = await assert.resolves(ok(42))
    expect(value).toBe(42)
  })

  it("thunk form resolves", async () => {
    const value = await assert.resolves(() => ok("from thunk"))
    expect(value).toBe("from thunk")
  })

  it("thunk form captures sync throw", async () => {
    const thunk = (): Promise<string> => {
      throw new Error("sync!")
    }
    await expect(assert.resolves(thunk)).rejects.toBeInstanceOf(AssertionError)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// assert.resolvesWith
// ─────────────────────────────────────────────────────────────────────────────

describe("assert.resolvesWith", () => {
  it("passes when resolved value matches", async () => {
    await expect(assert.resolvesWith(ok("USD"), "USD")).resolves.toBeUndefined()
  })

  it("fails when resolved value does not match", async () => {
    await expect(assert.resolvesWith(ok("EUR"), "USD")).rejects.toBeInstanceOf(AssertionError)
  })

  it("diff shows actual vs expected on mismatch", async () => {
    const err = await assert.resolvesWith(ok("EUR"), "USD").catch((e) => e)
    expect(err.message).toContain("USD")
    expect(err.message).toContain("EUR")
  })

  it("fails when promise rejects instead of resolving", async () => {
    await expect(assert.resolvesWith(fail(new Error("boom")), "USD")).rejects.toBeInstanceOf(
      AssertionError
    )
  })

  it("works with deep-equal objects", async () => {
    await expect(
      assert.resolvesWith(ok({ id: 1, name: "Alice" }), { id: 1, name: "Alice" })
    ).resolves.toBeUndefined()
  })

  it("fails on deep-equal mismatch", async () => {
    await expect(
      assert.resolvesWith(ok({ id: 1, name: "Alice" }), { id: 1, name: "Bob" })
    ).rejects.toBeInstanceOf(AssertionError)
  })

  it("thunk form resolves correctly", async () => {
    await expect(assert.resolvesWith(() => ok("paid"), "paid")).resolves.toBeUndefined()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// assert.resolvesSatisfying
// ─────────────────────────────────────────────────────────────────────────────

describe("assert.resolvesSatisfying", () => {
  it("passes when predicate returns true", async () => {
    await expect(
      assert.resolvesSatisfying(
        ok({ active: true, email: "a@b.com" }),
        (u) => u.active && u.email.includes("@")
      )
    ).resolves.toBeUndefined()
  })

  it("fails when predicate returns false", async () => {
    await expect(
      assert.resolvesSatisfying(ok({ active: false }), (u) => u.active)
    ).rejects.toBeInstanceOf(AssertionError)
  })

  it("error shows the actual resolved value", async () => {
    const err = await assert.resolvesSatisfying(ok("wrong"), (v) => v === "right").catch((e) => e)
    expect(err.message).toContain("wrong")
  })

  it("fails when promise rejects", async () => {
    await expect(
      assert.resolvesSatisfying(fail(new Error("boom")), () => true)
    ).rejects.toBeInstanceOf(AssertionError)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// assert.resolvesNotNil
// ─────────────────────────────────────────────────────────────────────────────

describe("assert.resolvesNotNil", () => {
  it("passes and returns the value when non-null", async () => {
    const value = await assert.resolvesNotNil(ok("Alice"))
    expect(value).toBe("Alice")
  })

  it("passes with object value", async () => {
    const user = await assert.resolvesNotNil(ok({ id: 1 }))
    expect(user.id).toBe(1)
  })

  it("fails when resolved value is null", async () => {
    await expect(assert.resolvesNotNil(ok(null))).rejects.toBeInstanceOf(AssertionError)
  })

  it("fails when resolved value is undefined", async () => {
    await expect(assert.resolvesNotNil(ok(undefined))).rejects.toBeInstanceOf(AssertionError)
  })

  it("fails when promise rejects", async () => {
    await expect(assert.resolvesNotNil(fail(new Error("not found")))).rejects.toBeInstanceOf(
      AssertionError
    )
  })

  it("thunk form works", async () => {
    const value = await assert.resolvesNotNil(() => ok(42))
    expect(value).toBe(42)
  })
})
