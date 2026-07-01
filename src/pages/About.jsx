import { ScytheRule } from '../components/Scythe';
import './pages.css';
import './about.css';

const SPOTIFY_SHOW = 'https://open.spotify.com/show/31X8hxiQsxuUbJID6nPor0';
const RSS_URL = 'https://anchor.fm/s/f2a61290/podcast/rss';

export default function About() {
  return (
    <>
      <section className="about-hero">
        <div className="wrap">
          <p className="eyebrow" style={{ marginBottom: 16 }}>About the club</p>
          <h1>Two best friends,<br />one very long TBR.</h1>
        </div>
      </section>

      <section className="section">
        <div className="wrap about-body">
          <div className="about-lead">
            <p>
              Trigger Warnings Book Club is hosted by CJ and Holly — two best friends
              who share a love of reading. Each week they dig into books they've loved,
              books they want to read, the best and worst tropes, and a whole lot of
              sports romance and fantasy.
            </p>
            <p>
              It's called Trigger Warnings Book Club because they especially love dark
              romance — so expect honest discussion, plenty of spoilers, and a heads-up
              on the heavy stuff. Andrew keeps the whole thing running as editor and
              resident non-reader.
            </p>
            <ScytheRule />
            <p className="about-feed-desc">
              New episodes drop weekly. Read along, then come argue about the ending with us.
            </p>
          </div>

          <aside className="about-card">
            <h3>Follow along</h3>
            <p>Listen and subscribe wherever you get your podcasts:</p>
            <a className="about-rss" href={SPOTIFY_SHOW} target="_blank" rel="noreferrer">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm4.6 14.4a.62.62 0 01-.86.21c-2.35-1.44-5.3-1.76-8.79-.96a.62.62 0 11-.28-1.22c3.81-.87 7.08-.5 9.72 1.11.3.18.39.57.21.86zm1.23-2.73a.78.78 0 01-1.07.26c-2.69-1.66-6.79-2.14-9.98-1.17a.78.78 0 11-.45-1.49c3.64-1.1 8.16-.57 11.25 1.33.36.22.48.7.25 1.07zm.1-2.84C14.8 8.98 9.3 8.8 6.16 9.76a.94.94 0 11-.54-1.8c3.6-1.09 9.67-.88 13.48 1.38a.94.94 0 11-.96 1.6z" fill="currentColor"/>
              </svg>
              Listen on Spotify
            </a>
            <a className="about-rss about-rss--alt" href={RSS_URL} target="_blank" rel="noreferrer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 19a2 2 0 100-4 2 2 0 000 4z" fill="currentColor"/>
                <path d="M4 11a9 9 0 019 9M4 5a15 15 0 0115 15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
              </svg>
              RSS feed
            </a>
            <p className="about-fine">Paste the RSS link into Apple Podcasts, Overcast, or Pocket Casts.</p>
          </aside>
        </div>
      </section>
    </>
  );
}
