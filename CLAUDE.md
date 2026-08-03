# CLAUDE.md — TWBC Site

## Project

Marketing/content site for **Trigger Warnings Book Club (TWBC)**, a romance and
literary fiction podcast hosted by CJ and Holly. Andrew is the producer, editor,
and sole developer. Tone of the show is cozy and humor-forward; the site should
match that.

Live at **triggerwarningsbookclub.com**.

## Stack

- React + Vite SPA, React Router, `react-helmet-async` for head management
- Deployed on **Netlify** from GitHub repo `andrewSantanastaso/twbc` (branch `main`)
- **Decap CMS** with GitHub OAuth via Netlify — CJ and Holly are intended future
  non-GitHub editors (discussed, not yet implemented)
- GA4 measurement ID: `G-ST5T912VSQ`
- Sibling project **WROMANCEL** (Node/Express + Postgres on Railway) is proxied
  through this site at `/wromancel` — see that repo's CLAUDE.md

## Layout

```
src/
  App.jsx, main.jsx, theme.css
  components/   Nav, Footer, EpisodeRow, Scythe, Seo
  pages/        Home, Episodes, ReadingList, About, Contact
  data/         episodes.json, reading-list.json
  lib/          episodes.js
content/        CMS-managed content
scripts/        build-time scripts (RSS fetch)
public/         logo.png (500x500 circular badge), static assets
```

## Brand

| Token | Value |
|---|---|
| Rosy berry | `#B14C7E` |
| Slate-purple | `#6E72A0` |
| Warm cream | `#FBF3EC` |

- Display font: **Fraunces**. Body font: **Inter**.
- Recurring visual motif: the scythe blade (`components/Scythe.jsx`).
- Logo: `public/logo.png` — circular badge, 500×500.

## Working principles

Andrew values **reliability and simplicity over cleverness** and low ongoing
maintenance. Present honest tradeoffs before implementing — do not jump straight
to a solution. When in doubt, pick the more boring, more defensible option.

## Hard-won lessons (do not relitigate)

- **Book covers are manual.** Three attempts at auto-fetching covers (Google
  Books, Open Library) all failed in production. Manual cover uploads via the CMS
  is the settled approach.
- **Spotify links, not an embedded player.** Linking out eliminates CORS/proxy
  complexity entirely.
- **RSS is fetched at build time**, with a committed JSON fallback in
  `src/data/episodes.json`. No runtime dependency on the feed.
- **Netlify Forms + Vite** requires a hidden static form in `index.html`.
  Netlify's build bot scrapes static HTML and never runs React — a React-only
  form will silently never register.
- **`/wromancel` proxy ordering.** Netlify processes `_redirects` before
  `netlify.toml`. Both files need matching proxy rules or the SPA catch-all
  intercepts `/wromancel` first.

## Git workflow

```bash
git add <specific-file> <specific-file>   # NEVER `git add .`
git commit -m "..."
git pull --rebase origin main
git push
```

- Never `git add .` — the SSD generates `._*` AppleDouble junk files that will
  get committed.
- Always pull **after** committing. The CMS makes its own commits and pulling
  first can leave you detached.

## npm gotcha

This repo commits an `.npmrc` with `include=dev`. If installs ever drop
devDependencies, prefix with `NODE_ENV=development` — some tool environments
inherit `NODE_ENV=production` and silently skip dev deps.

## External resources

- Podcast RSS: `https://anchor.fm/s/f2a61290/podcast/rss`
- Spotify show: `https://open.spotify.com/show/31X8hxiQsxuUbJID6nPor0`
- YouTube: `https://www.youtube.com/@TriggerWarningsBookClub`
- UTM convention: `utm_source=[platform]&utm_medium=[type]&utm_campaign=[descriptor]`

## Open threads

- OG image swap in `index.html` (file provided, commit pending)
- Instagram bio link (pending account access recovery)
- Adding CJ and Holly as non-GitHub CMS editors
