[**@assertcheck/core v1.0.0**](../_generated.md)

***

[@assertcheck/core](../_generated.md) / Env

# Type Alias: Env

```ts
type Env = "prod" | "dev" | "test" | "staging" | "ci";
```

Defined in: src/types.ts:52

The set of environment names recognised by [modeAssertIn](../functions/modeAssertIn.md).

## Remarks

These map to common `NODE_ENV` values and their aliases:

| `Env`         | Matches `NODE_ENV`                     |
|---------------|----------------------------------------|
| `"prod"`      | `"production"`, `"prod"`               |
| `"dev"`       | `"development"`, `"dev"`               |
| `"test"`      | `"test"`                               |
| `"staging"`   | `"staging"`, `"stage"`                 |
| `"ci"`        | `"ci"`                                 |
