import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Trigger Warnings Book Club';
const SITE_URL = 'https://triggerwarningsbookclub.com';
const DEFAULT_DESC =
  'CJ and Holly, two best friends talking sports romance, fantasy, dark romance, and the best and worst tropes. New episodes weekly.';
const DEFAULT_OG = `${SITE_URL}/logo.png`;

/**
 * Per-page SEO tags: title, meta description, canonical URL, and Open Graph /
 * Twitter Card tags for link previews. Drop <Seo ... /> at the top of a page.
 *
 * Props:
 *  - title:  page title (shown as "Page — Trigger Warnings Book Club"). Omit on
 *            the home page to use the site name alone.
 *  - description: meta + OG description. Falls back to the site default.
 *  - path:   the page's path (e.g. "/episodes") for the canonical + og:url.
 *  - image:  absolute URL for the social preview image. Falls back to the logo.
 */
export default function Seo({ title, description, path = '/', image }) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
  const desc = description || DEFAULT_DESC;
  const url = SITE_URL + path;
  const img = image || DEFAULT_OG;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />

      {/* Open Graph (Facebook, Discord, iMessage, LinkedIn, etc.) */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />

      {/* Twitter / X card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />
    </Helmet>
  );
}
