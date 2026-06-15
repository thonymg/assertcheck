// ── Domain types ─────────────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  role: "customer" | "admin"
  active: boolean
  stripeCustomerId: string | null
}

export interface Card {
  last4: string
  brand: "visa" | "mastercard" | "amex"
  expMonth: number
  expYear: number
}

export interface OrderItem {
  productId: string
  quantity: number
  unitPriceCents: number
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  status: "pending" | "paid" | "cancelled" | "refunded"
  totalCents: number
  createdAt: Date
}

export interface ChargeResult {
  chargeId: string
  amountCents: number
  status: "succeeded" | "failed"
}

// ── Typed errors ──────────────────────────────────────────────────────────────

export class UserNotFoundError extends Error {
  constructor(userId: string) {
    super(`User not found: ${userId}`)
    this.name = "UserNotFoundError"
  }
}

export class PaymentError extends Error {
  code: string
  constructor(message: string, code: string) {
    super(message)
    this.name = "PaymentError"
    this.code = code
  }
}

export class OrderError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "OrderError"
  }
}
