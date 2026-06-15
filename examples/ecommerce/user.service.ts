// ── UserService ───────────────────────────────────────────────────────────────
// Contrats déclarés avec assert sync — les invariants métier en entrée de chaque méthode.

import { assert } from "../../src/index.ts"
import { db } from "./db.ts"
import type { User } from "./types.ts"
import { UserNotFoundError } from "./types.ts"

export const UserService = {
  /**
   * Récupère un utilisateur actif.
   * Contrats :
   *  - userId est une string non-vide
   *  - l'utilisateur existe en base
   *  - l'utilisateur est actif
   */
  async getActiveUser(userId: string): Promise<User> {
    // ── Précondition sur l'argument ───────────────────────────────────────────
    assert.notEmpty(userId, {
      msg: "userId must not be empty",
      note: "check the JWT decode step before calling getActiveUser()",
    })
    assert.string(userId, "userId must be a string")

    // ── Récupération ──────────────────────────────────────────────────────────
    const user = await db.users.findById(userId)

    // ── Postconditions sur le résultat ────────────────────────────────────────
    assert.notNil(user, {
      msg: `User not found: ${userId}`,
      note: "the userId came from a JWT — check token expiry and user deletion",
    })

    assert.equal(user.active, true, {
      msg: `User account is disabled: ${userId}`,
      actual: "user.active",
      note: "check if the account was suspended in the admin panel",
    })

    return user
  },

  /**
   * Vérifie qu'un utilisateur peut effectuer un paiement.
   * Contrat : l'utilisateur doit avoir un compte Stripe associé.
   */
  assertCanPay(user: User): asserts user is User & { stripeCustomerId: string } {
    assert.notNil(user.stripeCustomerId, {
      msg: `User ${user.id} has no Stripe account`,
      note: "user must complete onboarding before placing an order",
    })

    assert.equal(user.role, "customer", {
      msg: "only customers can place orders",
      actual: "user.role",
      note: "admins use a separate invoicing flow",
    })
  },
}
