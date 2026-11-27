// Fixture for scan.test.ts. Lines marked `// expect: <rule>` must be reported,
// every other line must stay silent. Not imported anywhere.
// Excluded from Prettier (.prettierignore): it would move the expect comments.
type User = { id: string; name: string; email?: string }
type Status = "pending" | "paid"
declare function load(): Promise<User | null>
declare const users: (User | null)[]
declare const maybe: User | undefined

export async function silentExits(user: User | null, amount: number, items: string[], kind: unknown) {
  if (!user) return // expect: silent-exit
  if (amount <= 0) return null // expect: silent-exit
  if (items.length === 0) return [] // expect: silent-exit
  if (typeof kind !== "string") { console.warn("bad"); return } // expect: silent-exit
  if (user.name === "admin") return user // real value: a decision, not silent
  for (const u of users) {
    if (!u) continue // expect: silent-skip
  }
  if (!user.email) throw new Error("email required") // already loud
  return user
}

export function optionalParam(opts?: { verbose: boolean }) {
  if (!opts) return // expect: silent-exit
}

export async function swallowed() {
  try {
    await load()
  } catch (e) { // expect: swallowed-catch
    console.log(e)
  }
  try {
    await load()
  } catch (e) {
    throw new Error("load failed", { cause: e }) // rethrow: fine
  }
  const u = await load().catch(() => null) // expect: swallowed-promise
  return u
}

export function fallbacks(port: string | undefined, name: string | null) {
  const p = Number(port) || 3000 // expect: falsy-fallback
  const n = name ?? "anonymous" // expect: nullish-fallback
  const key = process.env.API_KEY // expect: unguarded-env
  const again = process.env.API_KEY // same var, same file: reported once
  return { p, n, key, again }
}

declare function failWith(msg: string): never
export function successExit(ok: boolean) {
  if (ok) return // success exit: the next statement fails loudly
  failWith("not ok")
}

export function stateGuard(order: { status: Status; vip: boolean }) {
  if (order.status !== "pending") return // expect: silent-exit
  if (order.vip === true) return // equality shortcut: business logic
}

export function bangs() {
  return maybe!.name // expect: non-null-bang
}

export function casts(raw: string) {
  const data = JSON.parse(raw) as User // expect: unchecked-cast
  const fixed = { a: 1 } as const
  const escape = raw as unknown as number // double cast: deliberate
  return { data, fixed, escape }
}

export function filters() {
  const a = users.filter(Boolean) // expect: nil-filter
  const b = users.filter((u) => u !== null) // expect: nil-filter
  const c = users.filter((u) => u?.name === "x")
  return { a, b, c }
}

export function label(s: Status) {
  switch (s) {
    case "pending": return "P"
    case "paid": return "OK"
    default: return "" // expect: silent-default
  }
}

export function chains(u: User | undefined) {
  const email = u?.email // expect: optional-chain
  const name = u?.name ?? "anon" // expect: nullish-fallback
  if (u?.name) return name
  // assertcheck-ignore
  const waived = u?.id
  return { email, waived }
}

export function repairs(ids: string[], qty: number, pct: number, delta: number) {
  const unique = [...new Set(ids)] // expect: dedupe
  const also = Array.from(new Set(ids)) // expect: dedupe
  const set = new Set(ids) // a Set used as a Set: fine
  const q = Math.max(0, qty) // expect: clamp
  const p = Math.min(1, Math.max(0, pct)) // expect: clamp
  const d = Math.abs(delta) // expect: clamp
  const biggest = Math.max(qty, pct) // two values, no bound: fine
  return { unique, also, set, q, p, d, biggest }
}

export function defaults(limit = 10, name: string = "") { // expect: default-param
  // price must be positive at this point // expect: comment-invariant
  return { limit, name }
}

// empty in, empty out: low only (hidden at the default level)
export function passthrough(raw: string, xs: number[], user: { name: string } | null) {
  const digits = raw.replace(/\D/g, "")
  if (!digits) return "" // expect: silent-exit
  if (xs.length === 0) return "" // a number[] mapped to "": a real silent exit // expect: silent-exit
  if (!user) return "" // expect: silent-exit
  return digits
}

// env vars the code already handles: no finding
export function envHandled(h: string) {
  const apiUrl = process.env.FX_API_URL
  if (!apiUrl || h !== apiUrl) throw new Error("refused")
  const dev = process.env.FX_DEV_URL ? process.env.FX_DEV_URL : "file://index.html"
  const id = process.env.FX_TENANT ?? h.toUpperCase()
  const port = process.env.FX_PORT ?? "3000" // expect: unguarded-env
  return { apiUrl, dev, id, port }
}

// lookup, business threshold, nothing-to-do list: low only
export function lowOnly(names: string[], parents: number, ids: string[]) {
  const found = names.find((n) => n === "x")
  if (!found) return null // expect: silent-exit
  if (parents > 2) return null // expect: silent-exit
  if (!ids.length) return // expect: silent-exit
  return found
}

// still real at the default level
export function stillReal(id: string, byId: Record<string, string | undefined>) {
  if (!id) return // expect: silent-exit
  const v = byId[id]
  if (!v) return // expect: silent-exit
  return v.length
}
