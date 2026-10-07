import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const escapeHtml = (value: string): string => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

async function filesIn(directory: string, prefix = ''): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    // Leave prohibited paths untouched, even if they appear inside line-1.
    if (['.git', '.github', 'node_modules'].includes(entry.name)
      || entry.name === '.env' || entry.name.startsWith('.env.')) continue;
    const name = prefix + entry.name;
    if (entry.isDirectory()) {
      files.push(...await filesIn(join(directory, entry.name), `${name}/`));
    } else if (entry.isFile()) {
      files.push(name);
    }
  }
  return files.sort();
}

export async function build(root = process.cwd()): Promise<string[]> {
  let files: string[];
  try {
    files = await filesIn(join(root, 'dist', 'line-1'));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    files = [];
  }
  const list = files.length === 0 ? '' : `<ul>\n${files.map((name) => {
    const href = './line-1/' + name.split('/').map(encodeURIComponent).join('/');
    return `        <li><a href="${escapeHtml(href)}"><bdi>${escapeHtml(name)}</bdi></a></li>`;
  }).join('\n')}\n      </ul>`;
  const template = await readFile(join(root, 'src', 'index.html'), 'utf8');
  if (!template.includes('<!-- FILES -->')) throw new Error('Missing FILES marker in src/index.html');
  await mkdir(join(root, 'dist'), { recursive: true });
  await writeFile(join(root, 'dist', 'index.html'), template.replace('<!-- FILES -->', () => list));
  return files;
}

if (import.meta.main) {
  const files = await build(resolve('.'));
  console.log(`Built dist/index.html; listed ${files.length} existing file(s).`);
}
