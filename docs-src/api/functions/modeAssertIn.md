[**assertcheck v0.2.152**](../_generated.md)

***

[assertcheck](../_generated.md) / modeAssertIn

# Function: modeAssertIn()

```ts
function modeAssertIn(env, mode): void;
```

Defined in: [src/mode.ts:123](https://github.com/thonymg/assertcheck/blob/fb514a0b33c45a051bb86cba2282fd5e4dfae3f9/src/mode.ts#L123)

Overrides the assertion mode **only when the current runtime environment
matches `env`**. Does nothing otherwise.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `env` | [`Env`](../type-aliases/Env.md) | The target environment label. |
| `mode` | [`AssertMode`](../type-aliases/AssertMode.md) | The [AssertMode](../type-aliases/AssertMode.md) to activate when `env` matches. |

## Returns

`void`

## Remarks

This is the **only recommended way** to change the assertion mode.
Call it once at your application entry point; every module picks up the
change automatically because mode state is module-level.

The mapping between `env` labels and `NODE_ENV` values:

| `env`       | Matches `NODE_ENV`            |
|-------------|-------------------------------|
| `"prod"`    | `"production"`, `"prod"`      |
| `"dev"`     | `"development"`, `"dev"`      |
| `"test"`    | `"test"`                      |
| `"staging"` | `"staging"`, `"stage"`        |
| `"ci"`      | `"ci"`                        |

You can call `modeAssertIn` multiple times for different environments —
only the one that matches the current `NODE_ENV` takes effect:

```ts
modeAssertIn("prod",    "warn")     // soft landing in production
modeAssertIn("ci",      "enabled")  // explicit — same as the default
modeAssertIn("dev",     "enabled")  // explicit — same as the default
```

## Examples

```ts
// app.ts — call once, at the very top of your entry point
import { modeAssertIn } from "assertcheck"

modeAssertIn("prod", "warn")
// → if NODE_ENV is "production" or "prod": mode becomes "warn"
// → any other NODE_ENV: mode stays "enabled" (the default)
```

```ts
// Multiple overrides for different envs
modeAssertIn("prod",    "warn")
modeAssertIn("staging", "warn")
modeAssertIn("ci",      "disabled") // fast CI run — no output
```
