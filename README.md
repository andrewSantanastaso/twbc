# Trigger Warnings Book Club — website

A React + Vite site for the Trigger Warnings Book Club podcast, hosted by CJ and Holly.
Warm, cozy theme derived from the show's logo (rosy berry, soft slate-purple, warm cream).

## Pages
- **Home** — hero, latest episodes, "what to expect"
- **Episodes** — full archive with search; each links out to Spotify
- **Reading list** — "the shelf": the book-discussion episodes, derived from the feed
- **About** — host bios + Spotify / RSS subscribe links

## Run it
```bash
npm install
npm run dev        # local dev at http://localhost:5173
npm run build      # production build into dist/
npm run preview    # preview the build
```

## How episodes work
Episodes come from your podcast **RSS feed**, fetched once at **build time** —
so the site captures your entire back catalog automatically and stays fully
static (no live server, no CORS proxy, nothing to break at runtime).

- `scripts/fetch-feed.mjs` fetches the feed and writes `src/data/episodes.json`.
- It runs automatically before every build (the `prebuild` script), or on demand:
  ```bash
  npm run fetch-feed
  ```
- The committed `src/data/episodes.json` is a **fallback**, so the site still
  builds if a build ever runs without network access. A failed fetch never wipes
  it — it just keeps what's there.

Each episode's "Listen" button links to its public episode page (the `<link>`
from the feed, i.e. the Spotify/Anchor episode page).

### Refreshing after you publish a new episode
Just rebuild — `npm run build` re-fetches the feed first. To refresh without a
full build, run `npm run fetch-feed`.

> The feed URL lives at the top of `scripts/fetch-feed.mjs` (`RSS_URL`).
> Note: fetching the feed only works where there's network access to anchor.fm —
> i.e. your machine or your CI/host, not inside a restricted sandbox.

### Automatic refresh (optional)
If you'd rather not rebuild manually, most hosts can rebuild on a schedule:
Netlify and Cloudflare Pages support **scheduled build hooks** (e.g. every 6h),
and Vercel supports cron-triggered deploy hooks. Point one at your deploy and the
site re-bakes the latest feed on its own — still static, still zero servers.

## Editing content
- **Episodes** → generated from RSS into `src/data/episodes.json`; change the feed
  URL in `scripts/fetch-feed.mjs` if it ever moves. To hand-edit or add one
  manually, edit `src/data/episodes.json` directly (a later fetch will overwrite it).
- **Reading list / "the shelf"** → shows all episodes from the feed; no separate
  data. A dedicated books data source can be swapped in here later to organize by
  book/author instead of by episode (see `src/pages/ReadingList.jsx`).
- **Colors / fonts** → `src/theme.css`  (all theme tokens are at the top in `:root`)
- **Copy on Home / About** → `src/pages/Home.jsx`, `src/pages/About.jsx`
- **Spotify show + RSS links** → top of `src/pages/About.jsx`

## Hosting
The build output in `dist/` is fully static — deploys as-is to Netlify, Vercel,
Cloudflare Pages, or GitHub Pages. Because it uses client-side routing, add a
catch-all redirect so every path serves `index.html`:
- **Netlify**: a `public/_redirects` file containing `/*  /index.html  200`
- **Vercel / Cloudflare Pages**: works out of the box
- **GitHub Pages**: use a `404.html` fallback or hash routing
# twbc
