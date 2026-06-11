# Installation

## Requirements

- Node.js 18+ / Bun 1+ / Deno 1.38+
- TypeScript 5.0+
- `lodash` (peer dependency — must be installed separately)

## Package managers

::: code-group

```sh [npm]
npm install assertcheck lodash
npm install -D @types/lodash   # optional, for IDE support
```

```sh [yarn]
yarn add assertcheck lodash
```

```sh [pnpm]
pnpm add assertcheck lodash
```

```sh [bun]
bun add assertcheck lodash
```

:::

## JSR (Deno / Bun)

```sh
deno add jsr:assertcheck
bunx jsr add assertcheck
```

## TypeScript config

assertcheck uses `.ts` extensions in imports and requires `bundler` module resolution. Make sure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler"
  }
}
```

## Verify the install

```ts
import { assert } from "assertcheck"

assert.equal(1, 1) // passes silently
assert.equal(1, 2) // throws AssertionError with formatted output
```
