<script setup>
const sections = [
  {
    name: 'assert.*',
    desc: '50+ assertion methods — existence, types, equality, numerics, arrays, objects, functions, and negation.',
    link: '/api/@assertcheck/namespaces/assert/_generated',
    linkText: 'Browse all methods',
    icon: 'ri:shield-check-line',
  },
  {
    name: 'check()',
    desc: 'Fluent chainable API — wrap a value and declare multiple invariants in a single readable expression.',
    link: '/api/functions/check',
    linkText: 'Read the reference',
    icon: 'ri:link-m',
  },
  {
    name: 'Modes',
    desc: 'modeAssertIn(), setAssertMode(), getAssertMode() — control enforcement per environment from one entry point.',
    link: '/api/functions/modeAssertIn',
    linkText: 'Read the reference',
    icon: 'ri:settings-4-line',
  },
  {
    name: 'Errors & formatting',
    desc: 'AssertionError, buildBlock(), fmtValue() — access structured metadata and build custom assertion output.',
    link: '/api/classes/AssertionError',
    linkText: 'Read the reference',
    icon: 'ri:terminal-line',
  },
]
</script>

# API Reference

Complete reference for `AssertCheck`, generated from JSDoc in the source code.

<Links :items="sections" :grid="2" />

---

## Core exports

| Export | Description |
|---|---|
| [`assert`](/api/@assertcheck/namespaces/assert/_generated) | The main assertion namespace — all 50+ methods documented individually. |
| [`check()`](/api/functions/check) | Chainable wrapper — `check(arr).noNils().uniqueBy("id")` |
| [`modeAssertIn()`](/api/functions/modeAssertIn) | Set mode conditionally based on `NODE_ENV` |
| [`setAssertMode()`](/api/functions/setAssertMode) | Set mode directly — useful in tests |
| [`getAssertMode()`](/api/functions/getAssertMode) | Read current mode |

## Assertion categories

| Category | Methods |
|---|---|
| **Existence** | `nil`, `notNil`, `empty`, `notEmpty` |
| **Types** | `string`, `number`, `integer`, `finite`, `boolean`, `array`, `object`, `func`, `instanceOf` |
| **Equality** | `equal`, `deepEqual` |
| **Numerics** | `positive`, `negative`, `zero`, `greater`, `greaterOrEqual`, `less`, `lessOrEqual`, `withinRange`, `inDelta` |
| **Arrays** | `len`, `longerThan`, `shorterThan`, `includes`, `all`, `any`, `none`, `one`, `count`, `containsAll`, `containsNone`, `elementsMatch`, `subset`, `unique`, `uniqueBy`, `increasing`, `nonDecreasing`, `sortedBy`, `first`, `last`, `sumBy`, `noNils`, `flat`, `allInstanceOf`, `zippedWith`, `groupedBy`, `partition` |
| **Objects** | `hasKey`, `hasKeys`, `hasExactKeys`, `hasOnlyKeys`, `hasValue`, `containsSubset`, `allValuesMatch`, `noNilValues`, `dig` |
| **Functions** | `returns`, `pure`, `idempotent`, `arity`, `mapsDistinct`, `homomorphic` |
| **Negation** | `not` |

## Classes

| Class | Description |
|---|---|
| [`Checker`](/api/classes/Checker) | Base class for chainable checkers |
| [`ArrayChecker`](/api/classes/ArrayChecker) | Returned by `check()` when the value is an array |
| [`ObjectChecker`](/api/classes/ObjectChecker) | Returned by `check()` when the value is an object |
| [`AssertionError`](/api/classes/AssertionError) | Error thrown on assertion failure — carries `assertion`, `actual`, `expected`, `message` |

## Formatting primitives

| Export | Description |
|---|---|
| [`buildBlock()`](/api/functions/buildBlock) | Build a formatted error block string |
| [`fmtValue()`](/api/functions/fmtValue) | Format any value for display |
| `color` | ANSI colour helpers: `color.added`, `color.removed`, `color.index` |
| `parseOpts()` | Normalise `string \| AssertOptions \| undefined` → structured options |
| `fail()` | Throw or warn depending on current mode |
| `diffObjects()` | Generate diff rows between two objects |

## Types

| Type | Description |
|---|---|
| [`AssertOptions`](/api/interfaces/AssertOptions) | Options accepted by every assertion: `msg`, `note`, `actual` |
| [`AssertMode`](/api/type-aliases/AssertMode) | `"enabled"` \| `"warn"` \| `"disabled"` |
| [`Env`](/api/type-aliases/Env) | Environment label for `modeAssertIn()` |

---

> This reference is generated from JSDoc in the source. To regenerate after editing, run `bun run docs:api`.
