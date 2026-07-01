#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
//  Build-time RSS fetch.
//  Pulls the FULL episode catalog from the podcast RSS feed and
//  writes it to src/data/episodes.json. Runs automatically before
//  every build (see package.json "prebuild"), or on demand:
//
//      npm run fetch-feed
//
//  Runs in Node (server-side) so there is NO CORS issue — that
//  only affects browsers. The site itself stays fully static.
// ─────────────────────────────────────────────────────────────

import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RSS_URL = 'https://anchor.fm/s/f2a61290/podcast/rss';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../src/data/episodes.json');

// ── tiny helpers ──────────────────────────────────────────────
const stripCdata = (s = '') =>
  s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');

const decodeEntities = (s = '') =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));

const clean = (s = '') =>
  decodeEntities(stripCdata(s))
    .replace(/<[^>]+>/g, ' ')      // drop any HTML tags
    .replace(/\s+/g, ' ')
    .trim();

function tag(block, name) {
  // matches <name ...>...</name> (namespaced names allowed via escaped colon)
  const re = new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'i');
  const m = block.match(re);
  return m ? m[1] : '';
}

function attr(block, name, attrName) {
  const re = new RegExp(`<${name}\\b[^>]*\\b${attrName}=["']([^"']*)["']`, 'i');
  const m = block.match(re);
  return m ? m[1] : '';
}

function toISODate(rfc) {
  const d = new Date(rfc);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function fmtDuration(raw) {
  if (!raw) return '';
  raw = raw.trim();
  let secs;
  if (raw.includes(':')) {
    const p = raw.split(':').map(Number);
    secs = p.reduce((acc, n) => acc * 60 + n, 0);
  } else {
    secs = parseInt(raw, 10);
  }
  if (!secs || Number.isNaN(secs)) return '';
  const m = Math.round(secs / 60);
  return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m} min`;
}

// Pull "S2E4" style season/episode if present in itunes tags
function seasonEp(block) {
  const s = tag(block, 'itunes:season').trim();
  const e = tag(block, 'itunes:episode').trim();
  return {
    season: s ? Number(s) : undefined,
    episode: e ? Number(e) : undefined,
  };
}

// ── main ──────────────────────────────────────────────────────
async function main() {
  process.stdout.write(`Fetching feed: ${RSS_URL}\n`);

  let xml;
  try {
    const res = await fetch(RSS_URL, {
      headers: { 'User-Agent': 'TWBC-FeedFetch/1.0 (+build)' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    xml = await res.text();
  } catch (err) {
    console.error(`\n✖ Could not fetch the feed: ${err.message}`);
    console.error('  Keeping the existing src/data/episodes.json (if any).');
    console.error('  Check your connection or the RSS_URL in scripts/fetch-feed.mjs.\n');
    process.exit(1);
  }

  const items = xml.split(/<item\b/i).slice(1).map((chunk) => '<item' + chunk.split(/<\/item>/i)[0] + '</item>');

  const episodes = items.map((block) => {
    const { season, episode } = seasonEp(block);
    const link = clean(tag(block, 'link')) || attr(block, 'enclosure', 'url');
    return {
      title: clean(tag(block, 'title')),
      date: toISODate(clean(tag(block, 'pubDate'))),
      duration: fmtDuration(tag(block, 'itunes:duration')),
      description: clean(tag(block, 'description') || tag(block, 'itunes:summary')),
      url: link,
      guid: clean(tag(block, 'guid')),
      season,
      episode,
    };
  }).filter((e) => e.title);

  // newest first (feeds are usually already in this order, but be safe)
  episodes.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(episodes, null, 2) + '\n', 'utf8');

  process.stdout.write(`✓ Wrote ${episodes.length} episodes to src/data/episodes.json\n`);
}

main();
