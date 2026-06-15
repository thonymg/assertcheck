// ── Tests du OrderService ─────────────────────────────────────────────────────
// Montre les assertions async en conditions réelles :
//   assert.resolves / resolvesNotNil / resolvesWith / resolvesSatisfying
//   assert.rejects / rejectsWithMessage / rejectsSatisfying / rejectsMatching

import { describe, it, expect } from "bun:test"
import { assert, withMode, AssertionError } from "../../src/index.ts"
import { OrderService } from "./order.service.ts"
import { UserService } from "./user.service.ts"
import { PaymentError, OrderError } from "./types.ts"

// ── Fixtures ──────────────────────────────────────────────────────────────────

const VALID_ITEMS = [
  { productId: "prod_shirt", quantity: 2, unitPriceCents: 2999 },
  { productId: "prod_hat", quantity: 1, unitPriceCents: 1500 },
]
// total = 2 * 2999 + 1 * 1500 = 7498 cents

// ─────────────────────────────────────────────────────────────────────────────
// UserService.getActiveUser — assert async resolves/rejects
// ─────────────────────────────────────────────────────────────────────────────

describe("UserService.getActiveUser", () => {
  it("resolves with the active user and narrows type", async () => {
    // assert.resolvesNotNil garantit que le retour est non-null
    // TypeScript sait ensuite que user est User (pas null)
    const user = await assert.resolvesNotNil(
      UserService.getActiveUser("usr_alice"),
      "usr_alice doit exister en base de test"
    )
    assert.equal(user.id, "usr_alice")
    assert.equal(user.active, true)
    assert.equal(user.role, "customer")
  })

  it("rejects with AssertionError for an unknown userId", async () => {
    // usr_unknown n'existe pas → assert.notNil dans getActiveUser throw
    await assert.rejects(
      UserService.getActiveUser("usr_unknown"),
      AssertionError,
      { msg: "unknown user must throw", note: "check fixtures" }
    )
  })

  it("rejects with a message mentioning the userId", async () => {
    await assert.rejectsMatching(
      UserService.getActiveUser("usr_unknown"),
      /usr_unknown/,
      "error message must include the userId for tracing"
    )
  })

  it("rejects for a disabled account", async () => {
    // usr_bob est active: false → assert.equal(user.active, true) throw
    await assert.rejects(
      UserService.getActiveUser("usr_bob"),
      AssertionError,
      "disabled account must be rejected"
    )
  })

  it("rejects with the right message for a disabled account", async () => {
    await assert.rejectsMatching(
      UserService.getActiveUser("usr_bob"),
      /disabled|active/i,
      "error must say the account is disabled"
    )
  })

  it("rejects for an empty userId", async () => {
    await assert.rejects(
      UserService.getActiveUser(""),
      AssertionError,
      "empty userId must be caught immediately"
    )
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// OrderService.placeOrder — happy path
// ─────────────────────────────────────────────────────────────────────────────

describe("OrderService.placeOrder — happy path", () => {
  it("resolves with a paid order", async () => {
    const order = await assert.resolvesNotNil(
      OrderService.placeOrder("usr_alice", VALID_ITEMS),
      "placeOrder must return a non-null order for alice"
    )

    assert.equal(order.status, "paid", {
      msg: "order must be paid after successful charge",
      actual: "order.status",
    })
    assert.notEmpty(order.id, "order must have an id")
    assert.equal(order.userId, "usr_alice")
    assert.equal(order.totalCents, 7498)
  })

  it("resolves with the correct total", async () => {
    await assert.resolvesSatisfying(
      OrderService.placeOrder("usr_alice", VALID_ITEMS),
      (order) => order.totalCents === 7498,
      "total doit être 2 * 2999 + 1 * 1500 = 7498 cents"
    )
  })

  it("resolves with items matching what was sent", async () => {
    await assert.resolvesSatisfying(
      OrderService.placeOrder("usr_alice", VALID_ITEMS),
      (order) =>
        order.items.length === VALID_ITEMS.length &&
        order.items.every((item, i) => item.productId === VALID_ITEMS[i]!.productId),
      "items must be persisted as-is"
    )
  })

  it("resolves with a createdAt date", async () => {
    await assert.resolvesSatisfying(
      OrderService.placeOrder("usr_alice", VALID_ITEMS),
      (order) => order.createdAt instanceof Date,
      "order must have a createdAt timestamp"
    )
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// OrderService.placeOrder — validation des items (erreurs synchrones)
// ─────────────────────────────────────────────────────────────────────────────

describe("OrderService.placeOrder — item validation", () => {
  it("rejects an empty items list", async () => {
    await assert.rejectsMatching(
      OrderService.placeOrder("usr_alice", []),
      /at least one item/,
      "empty cart must be caught before any DB call"
    )
  })

  it("rejects when a quantity is zero", async () => {
    const items = [{ productId: "prod_a", quantity: 0, unitPriceCents: 1000 }]
    await assert.rejectsSatisfying(
      OrderService.placeOrder("usr_alice", items),
      (err) => err instanceof AssertionError && err.message.includes("positive"),
      "zero quantity must throw with a clear message"
    )
  })

  it("rejects floating point prices", async () => {
    const items = [{ productId: "prod_a", quantity: 1, unitPriceCents: 9.99 }]
    await assert.rejectsSatisfying(
      OrderService.placeOrder("usr_alice", items),
      (err) => err instanceof AssertionError && err.message.includes("integer"),
      "float prices must be caught — always use cents"
    )
  })

  it("rejects duplicate productIds in the same order", async () => {
    const items = [
      { productId: "prod_shirt", quantity: 1, unitPriceCents: 2999 },
      { productId: "prod_shirt", quantity: 2, unitPriceCents: 2999 }, // doublon
    ]
    await assert.rejectsMatching(
      OrderService.placeOrder("usr_alice", items),
      /duplicate/i,
      "duplicate productId must be caught before the DB insert"
    )
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// OrderService.placeOrder — erreurs utilisateur
// ─────────────────────────────────────────────────────────────────────────────

describe("OrderService.placeOrder — user errors", () => {
  it("rejects for an unknown user", async () => {
    await assert.rejects(
      OrderService.placeOrder("usr_ghost", VALID_ITEMS),
      AssertionError,
      "unknown user must throw before reaching Stripe"
    )
  })

  it("rejects for a disabled user", async () => {
    // usr_bob est désactivé
    await assert.rejectsSatisfying(
      OrderService.placeOrder("usr_bob", VALID_ITEMS),
      (err) => err instanceof AssertionError && err.message.toLowerCase().includes("disabled"),
      "disabled user must be rejected with a clear message"
    )
  })

  it("rejects for an admin user (no Stripe account)", async () => {
    // usr_admin a stripeCustomerId: null
    await assert.rejectsSatisfying(
      OrderService.placeOrder("usr_admin", VALID_ITEMS),
      (err) => err instanceof AssertionError,
      "admin cannot place orders — no Stripe account"
    )
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// OrderService.placeOrder — erreurs Stripe (paiement)
// ─────────────────────────────────────────────────────────────────────────────

describe("OrderService.placeOrder — payment failures", () => {
  it("propagates PaymentError when Stripe declines the card", async () => {
    // usr_bob est décliné par Stripe dans notre fake (mais usr_bob est disabled)
    // On crée un scénario avec usr_alice mais un montant > 99999_00
    const hugeItems = [{ productId: "prod_jet", quantity: 1, unitPriceCents: 100000_00 }]

    await assert.rejects(
      OrderService.placeOrder("usr_alice", hugeItems),
      PaymentError,
      "amount exceeding limit must throw PaymentError"
    )
  })

  it("PaymentError message mentions the user and the cause", async () => {
    const hugeItems = [{ productId: "prod_jet", quantity: 1, unitPriceCents: 100000_00 }]

    await assert.rejectsMatching(
      OrderService.placeOrder("usr_alice", hugeItems),
      /usr_alice.*maximum|maximum.*usr_alice/i,
      "error message must include userId and cause for support tracing"
    )
  })

  it("PaymentError has the correct code", async () => {
    const hugeItems = [{ productId: "prod_jet", quantity: 1, unitPriceCents: 100000_00 }]

    await assert.rejectsSatisfying(
      OrderService.placeOrder("usr_alice", hugeItems),
      (err) => err instanceof PaymentError && err.code === "amount_too_large",
      "PaymentError.code must be 'amount_too_large' for Stripe limit exceeded"
    )
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// withMode — tester la résilience sans crasher le process
// ─────────────────────────────────────────────────────────────────────────────

describe("withMode — isolation dans les tests", () => {
  it("disabled mode: toutes les assertions sont des no-ops — le code s'exécute jusqu'au bout", async () => {
    // En mode disabled, assert.notEmpty / assert.positive / assert.greaterOrEqual
    // sont tous des no-ops.
    // Résultat : placeOrder avec items vides ne throw pas sur les validations —
    // il va jusqu'à stripe.charges.create avec amountCents=0, qui accepte.
    // C'est exactement ça le mode "disabled" : zéro protection, exécution totale.
    await withMode("disabled", async () => {
      const order = await OrderService.placeOrder("usr_alice", [])
      // L'ordre est créé malgré des items vides — les contrats sont éteints
      expect(order).toBeDefined()
      expect(order.totalCents).toBe(0)  // total calculé sur [] = 0
    })
  })

  it("mode is correctly restored after withMode block", async () => {
    const modeBefore = "enabled"
    await withMode("disabled", async () => {
      // mode disabled ici
    })
    // mode restauré automatiquement — pas besoin de afterEach
    await assert.rejects(
      UserService.getActiveUser(""),
      AssertionError,
      "assertions must be active again after withMode block"
    )
  })
})
