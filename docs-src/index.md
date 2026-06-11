---
layout: home

hero:
  name: "assertcheck"
  text: "Define what your code must never accept."
  tagline: Production-grade · Negative Space Programming · Mode-aware · Richly formatted · Zero overhead when disabled.
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: Why assertcheck?
      link: /guide/negative-space
    - theme: alt
      text: API reference
      link: /api/

features:
  - icon: ⬛
    title: Negative Space Programming
    details: Assertions define the invalid states your code must never see — making contracts explicit, executable, and impossible to ignore. The boundary between valid and invalid is the most important line you write.
    link: /guide/negative-space
    linkText: Learn the principle
  - icon: 🛡️
    title: Fail-fast by default
    details: Assertions are always enabled — even in production. Violations fire at their origin, not three layers later. Control enforcement per-environment with a single call to modeAssertIn().
  - icon: 🎨
    title: Richly formatted errors
    details: ELM-inspired output with diffs, labels, notes, and ANSI colours. Plain text in pipes and CI. DevTools-friendly in the browser.
  - icon: 🔗
    title: Chainable API
    details: check(value).noNils().uniqueBy("id").all(u => u.active) — fluent, readable, type-safe. Declare your invariants in one place.
  - icon: ⚡
    title: Zero overhead in disabled mode
    details: When mode is "disabled", every assertion is a no-op. No string formatting, no allocations.
---
