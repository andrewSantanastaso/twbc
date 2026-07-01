#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
//  Build-time reading-list compiler.
//  Reads the Markdown files the CMS writes into content/reading-list/
//  and emits src/data/reading-list.json for the app to import.
//  Runs automatically before every build (see package.json prebuild).
// ─────────────────────────────────────────────────────────────

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR = resolve(__dirname, '../content/reading-list');
const OUT = resolve(__dirname, '../src/data/reading-list.json');

// Minimal YAML-frontmatter parser tailored to this schema
// (string scalars + a `books:` list of maps). No external deps.
function parseFrontmatter(raw) {
  const m = raw.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!m) return {};
  const lines = m[1].split('\n');
  const data = { books: [] };
  let inBooks = false;
  let current = null;

  const unquote = (s) => s.trim().replace(/^["']|["']$/g, '');

  for (const line of lines) {
    if (/^books:\s*$/.test(line)) { inBooks = true; continue; }

    if (inBooks) {
      const item = line.match(/^\s*-\s+(\w+):\s*(.*)$/);
      const cont = line.match(/^\s{4,}(\w+):\s*(.*)$/);
      if (item) {
        if (current) data.books.push(current);
        current = {};
        current[item[1]] = unquote(item[2]);
      } else if (cont && current) {
        current[cont[1]] = unquote(cont[2]);
      } else if (/^\S/.test(line)) {
        // dedent back to top-level key ends the books list
        if (current) { data.books.push(current); current = null; }
        inBooks = false;
        const kv = line.match(/^(\w+):\s*(.*)$/);
        if (kv) data[kv[1]] = unquote(kv[2]);
      }
      continue;
    }

    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) data[kv[1]] = unquote(kv[2]);
  }
  if (current) data.books.push(current);
  return data;
}

async function main() {
  let files = [];
  try {
    files = (await readdir(DIR)).filter((f) => f.endsWith('.md'));
  } catch {
    process.stdout.write('No reading-list content yet — writing empty list.\n');
  }

  const months = [];
  for (const file of files) {
    const raw = await readFile(join(DIR, file), 'utf8');
    const fm = parseFrontmatter(raw);
    if (!fm.month_label) continue;
    months.push({
      month: fm.month_label,
      order: fm.order_date || file.replace('.md', ''),
      intro: fm.intro || '',
      books: (fm.books || []).map((b) => ({
        title: b.title || '',
        author: b.author || '',
        cover: b.cover || '',
        note: b.note || '',
      })),
    });
  }

  // newest month first
  months.sort((a, b) => (b.order || '').localeCompare(a.order || ''));

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(months, null, 2) + '\n', 'utf8');
  process.stdout.write(`✓ Wrote ${months.length} month(s) to src/data/reading-list.json\n`);
}

main();
