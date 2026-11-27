import { test } from 'node:test';
import { strict as nodeAssert } from 'node:assert';
import { cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const repository = fileURLToPath(new URL('../', import.meta.url));
test('production package declarations compile in an isolated strict consumer', () => {
  const root = mkdtempSync(join(tmpdir(), 'assertcheck-consumer-'));
  try {
    const pkg = JSON.parse(readFileSync(join(repository, 'package.json'), 'utf8'));
    const target = join(root, 'node_modules/assertcheck');
    mkdirSync(target, { recursive: true });
    cpSync(join(repository, 'dist'), join(target, 'dist'), { recursive: true });
    writeFileSync(join(target, 'package.json'), JSON.stringify(pkg));
    for (const dependency of Object.keys(pkg.dependencies)) {
      const destination = join(root, 'node_modules', dependency);
      mkdirSync(destination, { recursive: true });
      cpSync(join(repository, 'node_modules', dependency), destination, { recursive: true });
    }
    writeFileSync(join(root, 'consumer.mts'), 'import { assert, check } from "assertcheck"; assert.equal(1, 1); check([{ id: "a" }]).uniqueBy("id");');
    writeFileSync(join(root, 'tsconfig.json'), JSON.stringify({ compilerOptions: {
      target: 'ES2022', module: 'NodeNext', moduleResolution: 'NodeNext', strict: true,
      skipLibCheck: false, noEmit: true, types: [], typeRoots: ['./node_modules/@types'],
    }, files: ['consumer.mts'] }));
    const result = spawnSync(process.execPath, [join(repository, 'node_modules/typescript/bin/tsc'), '-p', root], { encoding: 'utf8' });
    nodeAssert.equal(result.status, 0, result.stdout + result.stderr);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
