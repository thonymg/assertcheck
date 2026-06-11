[**@assertcheck/core v1.0.0**](../_generated.md)

***

[@assertcheck/core](../_generated.md) / setAssertMode

# Function: setAssertMode()

```ts
function setAssertMode(mode): void;
```

Defined in: src/mode.ts:144

Directly sets the global assertion mode, regardless of environment.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `mode` | [`AssertMode`](../type-aliases/AssertMode.md) | The desired [AssertMode](../type-aliases/AssertMode.md). |

## Returns

`void`

## Remarks

Prefer [modeAssertIn](modeAssertIn.md) for environment-conditional overrides.
Use `setAssertMode` only when you need unconditional control — for
example in test `beforeEach` / `afterEach` hooks.

## Example

```ts
// In a test file — save and restore around each test
beforeEach(() => { saved = getAssertMode(); setAssertMode("enabled") })
afterEach(()  => { setAssertMode(saved) })
```
