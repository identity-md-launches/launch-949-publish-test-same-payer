import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { test } from 'node:test';
import { build } from './build.ts';

test('empty export and existing file links; preserve bytes and escape names', async () => {
  await mkdir('test/scratch', { recursive: true });
  const root = await mkdtemp('test/scratch/build-');
  await mkdir(join(root, 'src'));
  await writeFile(join(root, 'src/index.html'), await readFile('src/index.html'));
  assert.deepEqual(await build(root), []);
  const empty = await readFile(join(root, 'dist/index.html'), 'utf8');
  assert.match(empty, /<h1>same payer takeover<\/h1>/);
  assert.doesNotMatch(empty, /<ul>|<script|<!-- FILES -->/);
  await mkdir(join(root, 'dist/line-1/nested'), { recursive: true });
  const names = ['a & <b> "quote" #?.txt', 'nested/café.txt', "$& $' $`.txt"];
  for (const name of names) await writeFile(join(root, 'dist/line-1', name), `Content: ${name}`);
  assert.deepEqual(await build(root), [...names].sort());
  const html = await readFile(join(root, 'dist/index.html'), 'utf8');
  assert.match(html, /a &amp; &lt;b&gt; &quot;quote&quot; #\?\.txt/);
  assert.doesNotMatch(html, /<b> "quote"/);
  for (const name of names) {
    const url = './line-1/' + name.split('/').map(encodeURIComponent).join('/');
    assert.ok(html.includes(url.replaceAll("'", '&#39;')));
    assert.equal(await readFile(join(root, 'dist/line-1', name), 'utf8'), `Content: ${name}`);
  }
  await build(root);
  assert.equal(await readFile(join(root, 'dist/index.html'), 'utf8'), html);
});
