<script setup>
const skills = [
  {
    name: 'assertcheck-spec',
    desc: 'Define what a feature must NEVER accept before writing a single line of implementation. Produces a precondition/postcondition table traceable to assertions.',
    link: '/skills/spec',
    linkText: 'View skill',
    icon: 'ri:file-list-3-line',
  },
  {
    name: 'assertcheck-feature',
    desc: 'Build a new function, class, or service with the guard block first. Maps every input, prior state, and external response to an assertion before the logic is written.',
    link: '/skills/feature',
    linkText: 'View skill',
    icon: 'ri:code-s-slash-line',
  },
  {
    name: 'assertcheck-audit',
    desc: 'Audit existing code for every unguarded boundary — nil dereferences, silent exits, absorbed errors, unchecked external responses. Risk-ranked, ready to fix.',
    link: '/skills/audit',
    linkText: 'View skill',
    icon: 'ri:search-eye-line',
  },
  {
    name: 'assertcheck-refactor',
    desc: 'Modify existing code without breaking contracts. Maps every change to a guard impact, promotes silent ifs to assertions, and flags every safety check removed.',
    link: '/skills/refactor',
    linkText: 'View skill',
    icon: 'ri:git-merge-line',
  },
  {
    name: 'assertcheck-selector',
    desc: 'Instant lookup: which assert.* call for which invariant? Covers existence, type, value, object shape, and collection checks. Used internally by all other skills.',
    link: '/skills/selector',
    linkText: 'View skill',
    icon: 'ri:cursor-line',
  },
]
</script>

# AI Workflows

assertcheck ships five **Claude Code skills** — structured workflows that guide your AI assistant through Negative Space Programming tasks from spec to audit.

Each skill knows when to trigger, what to ask, and what to produce. They are designed to work together as a complete development workflow.

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

Each skill begins with an **interview step** — it asks clarifying questions before producing any output. This is intentional: the quality of the contract map depends on understanding the feature's boundaries, not just its implementation.

---

## What skills produce

| Skill | Output |
|---|---|
| `assertcheck-spec` | Preconditions table, postconditions table, hard-NOs list, implementation checklist |
| `assertcheck-feature` | Contract map, guard block + logic block scaffold, rejected-states summary |
| `assertcheck-audit` | Annotated code, risk-ranked findings table, proposed guard blocks |
| `assertcheck-refactor` | Impact table, guard diff with `[EXISTING]` / `[NEW]` annotations, removed-safety flags |
| `assertcheck-selector` | Decision tree, assertion selection, `msg` and `note` phrasing guidance |

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
