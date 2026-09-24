const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');

const projectRoot = path.resolve(__dirname, '..');

test('generator exits unsuccessfully when an SVG template is missing', (t) => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'language-icons-'));
  t.after(() => fs.rmSync(fixture, { recursive: true, force: true }));
  fs.mkdirSync(path.join(fixture, 'dist'));
  for (const file of ['one-color.svg', 'two-colors.svg']) {
    fs.copyFileSync(path.join(projectRoot, file), path.join(fixture, file));
  }
  for (const file of ['colors.json', 'index.js']) {
    fs.copyFileSync(path.join(projectRoot, 'dist', file), path.join(fixture, 'dist', file));
  }

  const result = spawnSync(process.execPath, [path.join(fixture, 'dist', 'index.js')], {
    cwd: fixture,
    encoding: 'utf8',
  });

  assert.notEqual(result.status, 0, `generator unexpectedly succeeded: ${result.stderr}`);
  assert.match(result.stderr, /ENOENT.*three-colors\.svg/);
});
