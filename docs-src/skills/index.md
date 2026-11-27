<script setup>
const skills = [
  {
    name: 'assertcheck-new',
    desc: 'For code you are about to write. Contract table first (preconditions, postconditions, forbidden states), then the guard block, the logic and the postconditions. Also picks the most specific assert.* for any invariant.',
    link: '/skills/new',
    linkText: 'View skill',
    icon: 'ri:code-s-slash-line',
  },
  {
    name: 'assertcheck-existing',
    desc: 'For code that already exists: a file, a folder, the whole project, or only the lines you changed. A deterministic scanner finds silent failures and gives the exact assertion for each one.',
    link: '/skills/existing',
    linkText: 'View skill',
    icon: 'ri:search-eye-line',
  },
]
</script>

# AI Skills

assertcheck ships two **agent skills**, one per situation:

<Links :items="skills" :grid="2" />

---

## Install

### Claude Code

```bash
/plugin install assertcheck --marketplace thonymg/assertcheck
```

Claude Code suggests the plugin by itself when a session reads a `package.json` that depends on `assertcheck`. To enable it for everyone who opens your project, commit this in `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "assertcheck": { "source": { "source": "github", "repo": "thonymg/assertcheck" } }
  },
  "enabledPlugins": { "assertcheck@assertcheck": true }
}
```

Claude Code asks each person to trust the folder and install the plugin once. It never installs anything silently.

### Other agents

```bash
npx skills add thonymg/assertcheck --skill='*'        # this project
npx skills add thonymg/assertcheck --skill='*' -g     # globally
npx skills add thonymg/assertcheck --skill='assertcheck-existing'   # one skill
```

Learn more at [vercel-labs/skills](https://github.com/vercel-labs/skills). The skills also ship inside the npm package, in `node_modules/assertcheck/skills`.

---

## Which one is triggered

| You say | Skill |
|---|---|
| "I'm building a new service for…" / "Write a spec for the payment module" | `assertcheck-new` |
| "Which assert function should I use for…" | `assertcheck-new` |
| "Audit this folder" / "Why does this fail silently?" | `assertcheck-existing` |
| "I'm adding a parameter to this method" | `assertcheck-existing` |

---

## Why a script for existing code

Detecting silent failures is a job for a parser, not for a model reading files. The scanner in `assertcheck-existing` uses the TypeScript compiler, so results are identical on every run, a whole project takes under a second, and the agent only decides what to do with each finding. The same script runs in CI without any agent: [see the scanner reference](/skills/existing#the-scanner).
