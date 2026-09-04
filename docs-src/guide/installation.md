# Installation

## Requirements

- Node.js 18+ / Bun 1+ / Deno 1.38+
- TypeScript 5.0+

`lodash` is a regular runtime dependency — your package manager installs it for you.

## Package managers

::: code-group

```sh [npm]
npm install assertcheck
```

```sh [yarn]
yarn add assertcheck
```

```sh [pnpm]
pnpm add assertcheck
```

```sh [bun]
bun add assertcheck
```

:::

## JSR (Deno / Bun / npm)

The package is published on JSR under the `@thonymg` scope.

```sh
deno add jsr:@thonymg/assertcheck
bunx jsr add @thonymg/assertcheck
npx jsr add @thonymg/assertcheck
```

When installed from JSR, import from `@thonymg/assertcheck`:

```ts
import { assert, check } from "@thonymg/assertcheck"
```

## Entry points

```ts
import { assert, check, AssertionError } from "assertcheck"   // everything you need
import type { AssertOptions } from "assertcheck"              // the opts type
```

Formatting primitives for [custom assertions](/guide/custom-assertions) are exported from the same root: `buildBlock`, `fmtValue`, `diffObjects`, `color`, `output`, `parseOpts`.

## TypeScript config

Any modern `moduleResolution` (`bundler`, `node16`, `nodenext`) works. Enable `strict` to get the full benefit of type narrowing.

```json
{
  "compilerOptions": {
    "strict": true,
    "module": "ESNext",
    "moduleResolution": "bundler"
  }
}
```

## Verify the install

```ts
import { assert } from "assertcheck"

assert.equal(1, 1) // passes silently
assert.equal(1, 2) // prints a formatted block and throws AssertionError
```

There is nothing to configure. Assertions are always enabled, in every environment.
