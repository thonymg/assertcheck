---
layout: home

hero:
  name: "assertcheck"
  text: "Define what your code must never accept."
  tagline: Production-grade assertion library for TypeScript. Explicit contracts, fail-fast execution, richly formatted errors — zero overhead when silent.
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: Why assertcheck?
      link: /guide/negative-space
    - theme: alt
      text: API reference
      link: /api/index

features:
  - title: Negative Space Programming
    details: Assertions define the invalid states your code must never see — making contracts explicit, executable, and impossible to ignore. The boundary between valid and invalid is the most important line you write.
    link: /guide/negative-space
    linkText: Learn the principle
  - title: Fail-fast by default
    details: Violations fire at their origin, not three layers later. Control enforcement per environment with a single call to modeAssertIn() — no code changes between dev, staging, and production.
  - title: Richly formatted errors
    details: ELM-inspired output with diffs, labels, and notes. ANSI colours on TTY, plain text in pipes and CI, collapsible groups in browser DevTools. Respects NO_COLOR.
  - title: Chainable API
    details: check(value).noNils().uniqueBy("id").all(u => u.active) — fluent, readable, type-safe. Declare all invariants on a value in one place.
  - title: Zero overhead when disabled
    details: In "disabled" mode every assertion is a no-op. No string formatting, no object allocations. Production builds pay nothing.
---
