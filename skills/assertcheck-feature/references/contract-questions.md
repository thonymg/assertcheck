# Contract Questions — Per Feature Type

Before writing assertions, answer these questions. Each answer maps to a guard.

---

## HTTP Handler / Controller

| Question | If "yes" → assert |
|:---------|:-----------------|
| Does the body have required fields? | `assert.hasKeys(req.body, [...])` |
| Are any fields typed (string, number…)? | `assert.string / assert.number / …` |
| Can any field be empty but shouldn't be? | `assert.notEmpty(field)` |
| Is the user required to be authenticated? | `assert.notNil(req.session?.userId)` |
| Is the user required to have a role? | `assert.equal(user.role, "admin")` |
| Are URL params expected to match a format? | `assert.string(req.params.id)` |

---

## Service Method / Use Case

| Question | If "yes" → assert |
|:---------|:-----------------|
| Does this method receive an ID and fetch an entity? | `assert.notNil(entity, { msg: "… must exist", actual: "…Id" })` |
| Is the entity expected to be in a specific state? | `assert.equal(entity.status, "expectedState")` |
| Does this method mutate state? | assert current state BEFORE mutation |
| Does this call an external service? | assert response shape AFTER the call |
| Does this return a computed value? | `assert` the output if type alone is insufficient |

---

## Utility Function (pure)

| Question | If "yes" → assert |
|:---------|:-----------------|
| Does it receive a string that must be non-empty? | `assert.string + assert.notEmpty` |
| Does it receive a number with a valid range? | `assert.number + assert.greater / assert.inDelta` |
| Does it receive an array that must not be empty? | `assert.array + assert.notEmpty` |
| Does it receive an object with required keys? | `assert.hasKeys(obj, requiredKeys)` |
| Can the inputs be combined in a way that is logically invalid? | one assertion per invalid combo |

---

## Class Constructor

| Question | If "yes" → assert |
|:---------|:-----------------|
| Are injected dependencies required (not optional)? | `assert.notNil(dep, "ClassName requires a depName")` |
| Are config options required to have specific keys? | `assert.hasKeys(config, [...])` |
| Are numeric config values bounded? | `assert.withinRange / assert.greater` |

---

## Environment / Config bootstrap

| Question | If "yes" → assert |
|:---------|:-----------------|
| Is an env variable required? | `assert.notNil(process.env.VAR)` |
| Must an env variable be a specific format? | `assert.string + assert.notEmpty` |
| Are multiple env variables required together? | one `assert.notNil` per variable — never combine |
