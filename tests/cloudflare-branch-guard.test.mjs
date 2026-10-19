import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, copyFile, readdir, rm, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

// Preview builds use this same entry point. Refusal must happen before imports,
// network CI checks or any mutation of a previous output directory.
for (const branch of ['suite/r3-2-integration', 'main', 'suite/unreviewed-preview']) {
  test(`Cloudflare refuses ${branch} before creating or replacing assets`, async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'suite-branch-guard-'));
    try {
      await mkdir(path.join(root, 'scripts'));
      await copyFile(new URL('../scripts/build.mjs', import.meta.url), path.join(root, 'scripts/build.mjs'));
      await mkdir(path.join(root, 'dist'));
      const sentinel = Buffer.from('previous output must remain untouched');
      await writeFile(path.join(root, 'dist/retained.txt'), sentinel);
      const outcome = spawnSync(process.execPath, ['scripts/build.mjs'], {
        cwd: root,
        env: { ...process.env, WORKERS_CI: '1', WORKERS_CI_BRANCH: branch, WORKERS_CI_COMMIT_SHA: 'a'.repeat(40) },
        encoding: 'utf8', timeout: 10_000,
      });
      assert.equal(outcome.error, undefined);
      assert.equal(outcome.status, 1);
      assert.ok(outcome.stderr.includes(`Refusing to build eu-v2-staging from unexpected Cloudflare branch: ${branch}.`));
      assert.equal(outcome.stdout, '');
      assert.deepEqual((await readdir(root)).sort(), ['dist', 'scripts']);
      assert.deepEqual(await readdir(path.join(root, 'dist')), ['retained.txt']);
      assert.deepEqual(await readFile(path.join(root, 'dist/retained.txt')), sentinel);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
}
