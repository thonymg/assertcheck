[**assertcheck v0.2.152**](../_generated.md)

***

[assertcheck](../_generated.md) / setAssertMode

# Function: setAssertMode()

```ts
function setAssertMode(mode): void;
```

Defined in: [src/mode.ts:144](https://github.com/thonymg/assertcheck/blob/daa9b6ef77bd456225b8daa3fa0b54ae5ed8bb68/src/mode.ts#L144)

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
