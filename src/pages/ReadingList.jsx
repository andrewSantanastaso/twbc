import { episodes } from '../lib/episodes';
import EpisodeRow from '../components/EpisodeRow';
import './pages.css';

export default function ReadingList() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="section__head">
          <div>
            <p className="eyebrow" style={{ marginBottom: 12 }}>Build your TBR</p>
            <h2>The shelf</h2>
          </div>
          <p>Every book and read we've talked through — tap any to listen.</p>
        </div>

        {episodes.length === 0 ? (
          <div className="state"><p>Nothing here yet — check back soon.</p></div>
        ) : (
          episodes.map((e) => <EpisodeRow key={e.guid || e.url} ep={e} />)
        )}
      </div>
    </section>
  );
}
