# AI Workflows

assertcheck ships five **Claude Code skills** — structured workflows that guide an AI assistant
through Negative Space Programming tasks. Each skill knows when to trigger, what to ask,
and what to produce.

They are designed to work together: use **spec** to design, **feature** to build,
**audit** to review, **refactor** to modify, and **selector** as a lookup at any point.

---

## The five skills

| Skill | When to use |
|---|---|
| [assertcheck-feature](./feature) | Starting a new function, class, or service from scratch |
| [assertcheck-audit](./audit) | Reviewing existing code to find unguarded boundaries |
| [assertcheck-spec](./spec) | Writing a technical spec with pre/postconditions before implementing |
| [assertcheck-refactor](./refactor) | Modifying existing code and adding guards to the change |
| [assertcheck-selector](./selector) | Picking the right `assert.*` call for a given invariant |

---

## How to trigger a skill

Say the trigger phrase in your AI assistant. Each skill listens for natural language:

```
"I'm building a new service for…"         → assertcheck-feature
"Review this code for unguarded inputs"   → assertcheck-audit
"Write a spec for the payment module"     → assertcheck-spec
"I'm adding a parameter to this method"   → assertcheck-refactor
"Which assert function should I use for…" → assertcheck-selector
```

Each skill begins with an **interview step** — it asks clarifying questions before
producing any output. This is intentional: the quality of the contract map depends
on understanding the feature's boundaries, not just its implementation.

---

## How they fit together

```
assertcheck-spec       → define what must NEVER happen
      ↓
assertcheck-feature    → build with a guard block first
      ↓
assertcheck-refactor   → modify without breaking contracts
      ↓
assertcheck-audit      → find gaps that slipped through
      ↑
assertcheck-selector   → available at every step as a lookup
```
