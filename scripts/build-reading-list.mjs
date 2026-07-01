#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
//  Build-time reading-list compiler.
//  Reads the Markdown files the CMS writes into content/reading-list/,
//  auto-fetches missing book covers from Google Books, and emits
//  src/data/reading-list.json for the app to import.
//
//  Cover priority per book:
//    1. Uploaded image (cover)         — admin uploaded one in the CMS
//    2. Manual URL (cover_url)         — admin pasted an override link
//    3. Google Books auto-fetch        — looked up by title + author
//    4. "" (empty)                     — page shows a placeholder card
//
//  Resilient by design: any lookup failure just leaves the cover empty
//  and logs it — the build never fails because of a cover miss.
//  Results are cached in scripts/.cover-cache.json to keep builds fast
//  and gentle on the API.
// ─────────────────────────────────────────────────────────────

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR = resolve(__dirname, '../content/reading-list');
const OUT = resolve(__dirname, '../src/data/reading-list.json');
const CACHE = resolve(__dirname, '.cover-cache.json');

// Optional: set GOOGLE_BOOKS_API_KEY in the environment for higher rate
// limits. Works fine without one for a small site.
const API_KEY = process.env.GOOGLE_BOOKS_API_KEY || '';

// ── frontmatter parser (string scalars + a `books:` list of maps) ──
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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Google Books cover lookup ──
async function fetchCover(title, author) {
  const terms = [`intitle:${title}`];
  if (author) terms.push(`inauthor:${author}`);
  const q = encodeURIComponent(terms.join(' '));
  let url = `https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=3&printType=books&country=US`;
  if (API_KEY) url += `&key=${API_KEY}`;

  // Retry a couple of times on rate-limit (429) or transient 5xx,
  // backing off longer each attempt.
  let res;
  for (let attempt = 0; attempt < 3; attempt++) {
    res = await fetch(url);
    if (res.ok) break;
    if (res.status === 429 || res.status >= 500) {
      await sleep(1500 * (attempt + 1)); // 1.5s, then 3s
      continue;
    }
    throw new Error(`HTTP ${res.status}`);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status} (after retries)`);
  const data = await res.json();
  const items = data.items || [];
  if (!items.length) return { cover: '', matched: null };

  // Score each result and pick the best real cover.
  // Google often returns a generic "image not available" graphic; those
  // URLs carry no zoom/edge params and the volume usually lacks an ISBN,
  // so we prefer results that have BOTH a thumbnail AND an industry ID.
  const candidates = [];
  for (const it of items) {
    const info = it.volumeInfo || {};
    const links = info.imageLinks || {};
    const raw = links.thumbnail || links.smallThumbnail || '';
    if (!raw) continue;

    const ids = info.industryIdentifiers || [];
    const isbn = ids.find((x) => x.type === 'ISBN_13' || x.type === 'ISBN_10');
    // Google placeholder thumbnails typically lack a real content id / are tiny.
    const looksReal = /books\.google\.com\/books\/content\?id=/.test(raw) && !!links.thumbnail;

    candidates.push({
      raw, info, isbn: isbn ? isbn.identifier : '',
      score: (isbn ? 2 : 0) + (looksReal ? 1 : 0),
    });
  }
  if (!candidates.length) return { cover: '', matched: null };

  candidates.sort((a, b) => b.score - a.score);
  const best = candidates[0];

  // Decide the cover, then VERIFY it's a real image (not Google's
  // "image not available" placeholder, which is a fixed ~128px-wide grey
  // graphic). We check the actual bytes' size as the reliable signal.
  let cover = '';
  if (best.score >= 1) {
    cover = best.raw
      .replace('http://', 'https://')
      .replace('&edge=curl', '')
      .replace('zoom=1', 'zoom=2');
  }

  // Verify — and fall back to Open Library by ISBN if Google's is bogus.
  cover = await verifyOrFallback(cover, best.isbn);

  return {
    cover,
    matched: `${best.info.title || '?'}${best.info.authors ? ' — ' + best.info.authors.join(', ') : ''}`,
  };
}

// Google's placeholder is a small grey "image not available" PNG (a few KB).
// Real covers are much larger. We HEAD/GET the image and judge by byte size,
// falling back to Open Library's ISBN cover (which 404s cleanly when missing).
async function verifyOrFallback(googleUrl, isbn) {
  const olUrl = isbn
    ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`
    : '';

  if (googleUrl) {
    try {
      const r = await fetch(googleUrl);
      if (r.ok) {
        const buf = Buffer.from(await r.arrayBuffer());
        // Google's "not available" graphic is ~2–8 KB. Real covers are >10 KB.
        if (buf.length > 10000) return googleUrl;
      }
    } catch { /* fall through to Open Library */ }
  }

  if (olUrl) {
    try {
      const r = await fetch(olUrl);
      // ?default=false makes OL return 404 (not a blank) when it has no cover.
      if (r.ok) {
        const len = Number(r.headers.get('content-length') || 0);
        if (len === 0 || len > 1000) return olUrl;
      }
    } catch { /* give up */ }
  }

  return ''; // no trustworthy cover — page shows the placeholder card
}

async function loadCache() {
  try { return JSON.parse(await readFile(CACHE, 'utf8')); }
  catch { return {}; }
}

async function main() {
  let files = [];
  try {
    files = (await readdir(DIR)).filter((f) => f.endsWith('.md'));
  } catch {
    process.stdout.write('No reading-list content yet — writing empty list.\n');
  }

  const cache = await loadCache();
  let apiCalls = 0, autoCovers = 0, misses = 0;

  const months = [];
  for (const file of files) {
    const raw = await readFile(join(DIR, file), 'utf8');
    const fm = parseFrontmatter(raw);
    if (!fm.month_label) continue;

    const books = [];
    for (const b of fm.books || []) {
      const title = b.title || '';
      const author = b.author || '';

      // Priority 1 & 2: explicit covers always win, no lookup needed
      let cover = b.cover || b.cover_url || '';

      // Priority 3: auto-fetch when no explicit cover was given
      if (!cover && title) {
        const key = `${title}|${author}`.toLowerCase();
        if (key in cache) {
          cover = cache[key];
          if (cover) autoCovers++; else misses++;
        } else {
          try {
            const { cover: c, matched } = await fetchCover(title, author);
            apiCalls++;
            await sleep(350); // small spacing to stay under rate limits
            cover = c;
            cache[key] = c;
            if (c) { autoCovers++; process.stdout.write(`  ✓ cover: "${title}" → ${matched}\n`); }
            else   { misses++;     process.stdout.write(`  · no cover found: "${title}" by ${author}\n`); }
          } catch (err) {
            misses++;
            process.stdout.write(`  ! lookup failed for "${title}": ${err.message} (left blank)\n`);
          }
        }
      }

      books.push({ title, author, cover, note: b.note || '' });
    }

    months.push({
      month: fm.month_label,
      order: fm.order_date || file.replace('.md', ''),
      intro: fm.intro || '',
      books,
    });
  }

  months.sort((a, b) => (b.order || '').localeCompare(a.order || ''));

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(months, null, 2) + '\n', 'utf8');
  try { await writeFile(CACHE, JSON.stringify(cache, null, 2) + '\n', 'utf8'); } catch {}

  process.stdout.write(
    `✓ Wrote ${months.length} month(s) to src/data/reading-list.json ` +
    `(${apiCalls} lookups, ${autoCovers} covers, ${misses} without)\n`
  );
}

main();
