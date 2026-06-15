// ── Simulated database / external services ────────────────────────────────────
// Remplace ici une vraie BDD ou un vrai SDK Stripe.

import type { User, Order, ChargeResult, OrderItem } from "./types.ts"
import { UserNotFoundError, PaymentError } from "./types.ts"

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

// ── Fake user store ───────────────────────────────────────────────────────────

const USERS: Record<string, User> = {
  usr_alice: {
    id: "usr_alice",
    email: "alice@example.com",
    role: "customer",
    active: true,
    stripeCustomerId: "cus_alice123",
  },
  usr_bob: {
    id: "usr_bob",
    email: "bob@example.com",
    role: "customer",
    active: false, // compte désactivé
    stripeCustomerId: "cus_bob456",
  },
  usr_admin: {
    id: "usr_admin",
    email: "admin@example.com",
    role: "admin",
    active: true,
    stripeCustomerId: null, // pas de stripe pour les admins
  },
}

export const db = {
  users: {
    findById: async (id: string): Promise<User | null> => {
      await delay(10)
      return USERS[id] ?? null
    },
  },
  orders: {
    create: async (order: Omit<Order, "id" | "createdAt">): Promise<Order> => {
      await delay(15)
      return { ...order, id: `ord_${Date.now()}`, createdAt: new Date() }
    },
    updateStatus: async (
      orderId: string,
      status: Order["status"]
    ): Promise<void> => {
      await delay(5)
      // In a real DB this would UPDATE orders SET status = ? WHERE id = ?
      void orderId
      void status
    },
  },
}

// ── Fake Stripe SDK ───────────────────────────────────────────────────────────

export const stripe = {
  charges: {
    create: async (params: {
      customer: string
      amountCents: number
      currency: string
    }): Promise<ChargeResult> => {
      await delay(50) // simule la latence réseau Stripe

      // Scénario de test : cus_bob456 est toujours décliné
      if (params.customer === "cus_bob456") {
        throw new PaymentError("Your card was declined.", "card_declined")
      }

      // Scénario de test : montant trop élevé
      if (params.amountCents > 99999_00) {
        throw new PaymentError(
          "Amount exceeds maximum charge limit.",
          "amount_too_large"
        )
      }

      return {
        chargeId: `ch_${Date.now()}`,
        amountCents: params.amountCents,
        status: "succeeded",
      }
    },
  },
}
