// ── OrderService ──────────────────────────────────────────────────────────────
// Montre assert sync pour valider les données métier (items, montants, structure).

import { assert } from "../../src/index.ts"
import { db } from "./db.ts"
import { stripe } from "./db.ts"
import { UserService } from "./user.service.ts"
import type { Order, OrderItem, ChargeResult } from "./types.ts"
import { PaymentError } from "./types.ts"

export const OrderService = {
  /**
   * Crée et paye une commande en une transaction logique.
   *
   * Flux :
   *  1. Valider les items (structure, quantités, prix)
   *  2. Récupérer l'utilisateur actif et vérifier ses droits
   *  3. Calculer le total
   *  4. Charger la carte via Stripe
   *  5. Persister la commande avec le statut "paid"
   */
  async placeOrder(userId: string, items: OrderItem[]): Promise<Order> {
    // ── 1. Validation des items ───────────────────────────────────────────────
    assert.notEmpty(items, {
      msg: "order must contain at least one item",
      note: "the UI should prevent submitting an empty cart",
    })

    assert.noNils(items, "order items must not contain null entries")

    assert.all(items, (item) => item.quantity > 0, {
      msg: "all item quantities must be positive",
      note: "check the cart reducer — quantity should never reach 0",
    })

    assert.all(items, (item) => item.unitPriceCents > 0, {
      msg: "all item prices must be positive",
      note: "prices come from the catalog — a zero price is a catalog data issue",
    })

    assert.all(items, (item) => Number.isInteger(item.unitPriceCents), {
      msg: "prices must be integer cents — no floating point",
      note: "never use floating point for money — always store cents",
    })

    assert.uniqueBy(items, "productId", {
      msg: "duplicate productId in order items",
      note: "merge quantities client-side before sending to the API",
    })

    // ── 2. Utilisateur ────────────────────────────────────────────────────────
    const user = await UserService.getActiveUser(userId)
    UserService.assertCanPay(user) // narrowing → user.stripeCustomerId: string

    // ── 3. Calcul du total ────────────────────────────────────────────────────
    const totalCents = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPriceCents,
      0
    )

    assert.positive(totalCents, {
      msg: "order total must be positive",
      note: "this should be impossible after item validation — something is wrong upstream",
    })

    assert.integer(totalCents, "total must be integer cents")

    // Limites Stripe : 50 centimes minimum, 999 999 $ maximum
    assert.greaterOrEqual(totalCents, 50, {
      msg: "order total below Stripe minimum (50 cents)",
      note: "combine small items or set a minimum order amount in the UI",
    })

    // ── 4. Paiement Stripe ────────────────────────────────────────────────────
    let charge: ChargeResult
    try {
      charge = await stripe.charges.create({
        customer: user.stripeCustomerId,
        amountCents: totalCents,
        currency: "usd",
      })
    } catch (err) {
      // On retransmet l'erreur Stripe avec contexte métier
      if (err instanceof PaymentError) {
        throw new PaymentError(
          `Payment failed for user ${userId}: ${err.message}`,
          err.code
        )
      }
      throw err
    }

    // Postcondition sur la réponse Stripe
    assert.equal(charge.status, "succeeded", {
      msg: "Stripe charge must be succeeded before persisting the order",
      actual: "charge.status",
      note: "Stripe never returns a non-succeeded charge without throwing — this is a Stripe SDK regression",
    })

    assert.equal(charge.amountCents, totalCents, {
      msg: "Stripe confirmed amount does not match requested amount",
      actual: "charge.amountCents",
      note: "potential Stripe API discrepancy — page the on-call immediately",
    })

    // ── 5. Persistance ────────────────────────────────────────────────────────
    const order = await db.orders.create({
      userId,
      items,
      status: "paid",
      totalCents,
    })

    // Postcondition finale
    assert.notEmpty(order.id, {
      msg: "persisted order must have an id",
      note: "DB returned an order without an id — check the insert trigger",
    })

    assert.equal(order.status, "paid", {
      msg: "persisted order must have status 'paid'",
      actual: "order.status",
    })

    return order
  },
}
