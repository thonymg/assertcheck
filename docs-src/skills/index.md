<script setup>
const skills = [
  {
    name: 'assertcheck-spec',
    desc: 'Define what a feature must NEVER accept before a single line of implementation. Produces a precondition/postcondition table and an implementation checklist — every invariant traceable to one assertion.',
    link: '/skills/spec',
    linkText: 'View skill',
    icon: 'ri:file-list-3-line',
  },
  {
    name: 'assertcheck-feature',
    desc: 'Build a new function, class, or service with the guard block first. Maps every input, prior state, and external response to an assertion — contract table before any code.',
    link: '/skills/feature',
    linkText: 'View skill',
    icon: 'ri:code-s-slash-line',
  },
  {
    name: 'assertcheck-audit',
    desc: 'Scan existing code for every unguarded boundary — nil dereferences, silent exits, absorbed errors. 6-category pass, risk-ranked report, ready-to-paste assertions.',
    link: '/skills/audit',
    linkText: 'View skill',
    icon: 'ri:search-eye-line',
  },
  {
    name: 'assertcheck-refactor',
    desc: 'Modify existing code without breaking contracts. Every change maps to a guard impact. Every removed safety check is replaced by an assertion — never silently deleted.',
    link: '/skills/refactor',
    linkText: 'View skill',
    icon: 'ri:git-merge-line',
  },
  {
    name: 'assertcheck-selector',
    desc: 'Instant lookup: which assert.* call for which invariant? Always picks the most specific assertion. Used internally by all other skills.',
    link: '/skills/selector',
    linkText: 'View skill',
    icon: 'ri:cursor-line',
  },
]
</script>

# AI Workflows

assertcheck ships five **Claude Code skills** — structured workflows that guide your AI assistant through Negative Space Programming tasks from spec to audit.

Each skill enforces a strict protocol: it interviews before producing output, runs a defined set of passes or phases in order, and validates its own output before delivering. They are designed to work together as a complete development workflow.

---

## The five skills

<Links :items="skills" :grid="2" />

---

## How they fit together

The skills follow the natural lifecycle of a feature:

```
assertcheck-spec       → define what must NEVER happen
      ↓
assertcheck-feature    → build with the guard block first
      ↓
assertcheck-refactor   → modify without breaking contracts
      ↓
assertcheck-audit      → find the gaps that slipped through
      ↑
assertcheck-selector   → lookup at every step
```

Start with **spec** before touching a keyboard. Use **feature** to scaffold. Use **refactor** when extending. Use **audit** before any release. **Selector** is always available as a lookup when you're not sure which assertion to reach for.

---

## How to trigger a skill

Each skill listens for natural-language triggers in your AI assistant:

| You say | Skill invoked |
|---|---|
| "I'm building a new service for…" | `assertcheck-feature` |
| "Review this code for unguarded inputs" | `assertcheck-audit` |
| "Write a spec for the payment module" | `assertcheck-spec` |
| "I'm adding a parameter to this method" | `assertcheck-refactor` |
| "Which assert function should I use for…" | `assertcheck-selector` |

Each skill begins with a mandatory **interview step** before producing any output — and runs a **self-check** on its own output before delivering. The quality of the contract map depends on understanding the feature's boundaries, not just its implementation.

---

## What skills produce

| Skill | Output |
|---|---|
| `assertcheck-spec` | Feature identity, preconditions table, postconditions table, state machine (if applicable), implementation checklist |
| `assertcheck-feature` | Contract table, guarded implementation (guard block + logic block), rejected-states summary |
| `assertcheck-audit` | Guard coverage score, risk-ranked findings table, proposed assertions, mindset note |
| `assertcheck-refactor` | Impact table, guard diff with `[EXISTING]` / `[NEW]` annotations, removed-safety `⚠` flags, caller note |
| `assertcheck-selector` | Most-specific assertion, `msg` / `note` phrasing, `assert.*` vs `check()` recommendation |

---

## Installation

Install all five skills into your current project:

```bash
npx skills add thonymg/assertcheck --skill='*'
bunx skills add thonymg/assertcheck --skill='*'
pnpx skills add thonymg/assertcheck --skill='*'
```

Install globally for use across all projects:

```bash
npx skills add thonymg/assertcheck --skill='*' -g
```

Install a single skill:

```bash
npx skills add thonymg/assertcheck --skill='assertcheck-audit'
```

Learn more at [vercel-labs/skills](https://github.com/vercel-labs/skills).

---

::: tip Built for Claude Code
These skills are designed for the [Claude Code](https://claude.ai/code) CLI. They work in any Claude-powered AI assistant that supports the skills protocol.
:::
