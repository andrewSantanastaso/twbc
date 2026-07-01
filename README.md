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
- **Reading list** → managed through the CMS at `/admin` (no code). Each month is a
  form entry (title, author, cover image per book). Saving commits a Markdown file
  to `content/reading-list/`, which `scripts/build-reading-list.mjs` compiles into
  `src/data/reading-list.json` at build time. See "Reading List CMS" below.
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

## Reading List CMS (Decap)

The Reading List is edited through a browser form at **`/admin`** — no code, no redeploy by hand.
Saving an entry commits to GitHub, which triggers a Netlify rebuild automatically.

**Content flow:** CMS form → Markdown file in `content/reading-list/` → `scripts/build-reading-list.mjs` → `src/data/reading-list.json` → React page.

### One-time auth setup (required before `/admin` works)
Decap needs GitHub OAuth, with Netlify acting as the broker:

1. **Create a GitHub OAuth app:** GitHub → Settings → Developer settings → OAuth Apps → New.
   - Homepage URL: `https://triggerwarningsbookclub.com`
   - **Authorization callback URL:** `https://api.netlify.com/auth/done`  (exactly this)
   - Click Register, then **Generate a new client secret**. Copy the Client ID and secret.
2. **Give the keys to Netlify:** Netlify site → Site configuration → Access & security →
   OAuth → Install provider → GitHub → paste the Client ID and secret.
3. Visit `https://triggerwarningsbookclub.com/admin`, click **Login with GitHub**, authorize.

That's it — after this, editing is just filling out the form.

### Book covers (auto-fetched)
When you add a book, **leave the cover blank** — the build looks it up by title +
author on Google Books and fills the cover in automatically. Priority order:

1. **Uploaded image** — if you upload one in the CMS, it's used as-is.
2. **Cover URL override** — paste a direct image link in the "Cover URL override"
   field to force a specific cover (use this if the auto one looks wrong).
3. **Google Books auto-fetch** — the default; happens at build time.
4. If nothing is found, the card shows a tasteful placeholder.

Lookups are cached in `scripts/.cover-cache.json` (gitignored, rebuilt as needed)
so repeat builds are fast. A failed lookup never breaks the build — it just leaves
that cover blank and logs it. For higher API limits you can optionally set a
`GOOGLE_BOOKS_API_KEY` environment variable in Netlify, but it's not required.

### Updating the reading list each month
1. Go to `/admin` and log in.
2. **Reading List → New Month.** Enter the month (e.g. "August 2026"), pick any date in
   that month (for ordering), optionally an intro line.
3. Add books: title, author, upload a cover image, optional note.
4. **Publish.** The site rebuilds itself; the new month becomes the featured one and the
   previous month drops into the archive automatically.
