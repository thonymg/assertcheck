# Guard Templates — Ready-to-Use Guard Blocks

Copy and adapt these templates. Replace `<…>` placeholders with your actual names.

---

## HTTP handler — body validation

```ts
async function handle<Action>(req: Request, res: Response) {
  // ── guards ────────────────────────────────────────────────────
  assert.notNil(req.body, "request body is required")
  assert.hasKeys(req.body, ["<field1>", "<field2>"], "body must have required fields")
  assert.string(req.body.<field1>, "<field1> must be a string")
  assert.notEmpty(req.body.<field1>, "<field1> must not be empty")

  // ── logic ─────────────────────────────────────────────────────
}
```

---

## Service method — entity + state guard

```ts
async function <action><Entity>(id: string): Promise<<ReturnType>> {
  // ── guards ────────────────────────────────────────────────────
  assert.string(id,    "<entityName>Id must be a string")
  assert.notEmpty(id,  "<entityName>Id must not be empty")

  const entity = await repo.findById(id)
  assert.notNil(entity, {
    msg:    "<Entity> must exist before <action>",
    actual: "<entityName>Id",
    note:   "verify the id comes from a valid creation flow",
  })
  assert.equal(entity.status, "<expectedStatus>", {
    msg:  "<Entity> must be in <expectedStatus> state before <action>",
    note: "call <transitionMethod>() to reach <expectedStatus>",
  })

  // ── logic ─────────────────────────────────────────────────────
}
```

---

## Class constructor — dependency injection guard

```ts
class <ServiceName> {
  constructor(
    private readonly <dep1>: <Dep1Type>,
    private readonly <dep2>: <Dep2Type>,
  ) {
    // ── guards ────────────────────────────────────────────────────
    assert.notNil(<dep1>, "<ServiceName> requires a <dep1>")
    assert.notNil(<dep2>, "<ServiceName> requires a <dep2>")
  }
}
```

---

## Utility function — array pipeline

```ts
function <process><Entities>(items: <ItemType>[]): <ReturnType>[] {
  // ── guards ────────────────────────────────────────────────────
  check(items)
    .notEmpty("<entities> must not be empty")
    .all(i => /* condition */, "all <entities> must satisfy <invariant>")

  // ── logic ─────────────────────────────────────────────────────
}
```

---

## Environment bootstrap — startup guard

```ts
function loadConfig(): Config {
  // ── guards ────────────────────────────────────────────────────
  assert.notNil(process.env.<VAR1>, {
    msg:  "<VAR1> environment variable is required",
    note: "add it to your .env file — see .env.example",
  })
  assert.notNil(process.env.<VAR2>, {
    msg:  "<VAR2> environment variable is required",
    note: "generate one with: openssl rand -hex 32",
  })

  // ── logic ─────────────────────────────────────────────────────
  return { <field1>: process.env.<VAR1>, <field2>: process.env.<VAR2> }
}
```

---

## Integration point — external service call

```ts
const response = await <externalService>.<method>(payload)

// ── integration guard ──────────────────────────────────────────
assert.notNil(response.<requiredField>, {
  msg:  "<externalService> must return a <requiredField>",
  note: "check <externalService> logs if this fires",
})
assert.equal(response.status, "<expectedStatus>", {
  msg:  "<externalService> call must succeed",
  note: "inspect response.error for the failure reason",
})
```
