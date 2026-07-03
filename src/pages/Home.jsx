import { Link } from 'react-router-dom';
import { episodes } from '../lib/episodes';
import { ScytheRule, Blade } from '../components/Scythe';
import EpisodeRow from '../components/EpisodeRow';
import Seo from '../components/Seo';
import './pages.css';

export default function Home() {
  const latest = episodes.slice(0, 4);

  return (
    <>
      <Seo path="/" />
      <section className="hero">
        <div className="wrap hero__inner">
          <div>
            <p className="eyebrow hero__eyebrow">A book club podcast</p>
            <h1>Best friends, <em>big</em> feelings, <em>spicy</em> books.</h1>
            <p className="hero__lead">
              CJ and Holly read everything from sports romance to fantasy to the
              darkest dark romance — spoilers, hot takes, and a lot of laughs.
            </p>
            <div className="hero__cta">
              <Link to="/episodes" className="btn">
                <svg width="16" height="16" viewBox="0 0 24 24"><path d="M7 5l12 7-12 7V5z" fill="currentColor"/></svg>
                Browse episodes
              </Link>
              <Link to="/reading-list" className="btn btn--ghost">The reading list</Link>
            </div>
          </div>
          <div className="hero__art">
            <img src="/logo.png" alt="Trigger Warnings Book Club logo" className="hero__logo" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section__head">
            <h2>Latest episodes</h2>
            <p>New episodes weekly. Tap any to listen on Spotify.</p>
          </div>
          {latest.map((e) => <EpisodeRow key={e.guid || e.url} ep={e} />)}
          <div style={{ marginTop: 32 }}>
            <Link to="/episodes" className="btn btn--dark">All episodes</Link>
          </div>
        </div>
      </section>

      <ScytheRule />

      <section className="section section--cream">
        <div className="wrap">
          <div className="section__head"><h2>What to expect</h2></div>
          <div className="features">
            <div className="feature">
              <Blade size={26} color="var(--berry)" />
              <h3>Every trope welcome</h3>
              <p>Sports romance, fantasy, magical realism, and the best (and worst) tropes — all on the table.</p>
            </div>
            <div className="feature">
              <Blade size={26} color="var(--berry)" />
              <h3>Spoilers, always</h3>
              <p>We go all in on endings and twists. Read along first, or come for the unfiltered reactions.</p>
            </div>
            <div className="feature">
              <Blade size={26} color="var(--berry)" />
              <h3>Read the warnings first</h3>
              <p>We love dark romance, so we flag the heavy stuff — listen and read with care.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
