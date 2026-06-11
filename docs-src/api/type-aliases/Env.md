[**assertcheck v0.2.152**](../_generated.md)

***

[assertcheck](../_generated.md) / Env

# Type Alias: Env

```ts
type Env = "prod" | "dev" | "test" | "staging" | "ci";
```

Defined in: [src/types.ts:52](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/types.ts#L52)

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
