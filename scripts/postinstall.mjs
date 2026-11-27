// Prints a hint only: never writes outside node_modules, never fails the install.
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
// Skip when installing inside this repo (contributor setup).
if (process.env.INIT_CWD && resolve(process.env.INIT_CWD) === root) process.exit(0);

console.log(`
assertcheck: AI skills are not installed yet. To enable them:

  npx skills add thonymg/assertcheck --skill='*'      # this project
  npx skills add thonymg/assertcheck --skill='*' -g   # globally

Claude Code: /plugin install assertcheck --marketplace thonymg/assertcheck

Docs: https://thonymg.github.io/assertcheck/skills/
`);
