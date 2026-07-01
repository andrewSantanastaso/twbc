// ─────────────────────────────────────────────────────────────
//  Episode list.
//
//  This data is generated from the podcast RSS feed at build time
//  by scripts/fetch-feed.mjs — it writes src/data/episodes.json,
//  which is imported below. Run `npm run fetch-feed` (or just
//  `npm run build`, which does it automatically) to refresh.
//
//  The committed episodes.json is a fallback so the site works even
//  if a build runs without network access.
// ─────────────────────────────────────────────────────────────

import data from '../data/episodes.json';

export const episodes = data;
