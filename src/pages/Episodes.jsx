import { useState, useMemo, useEffect } from 'react';
import { episodes } from '../lib/episodes';
import EpisodeRow from '../components/EpisodeRow';
import './pages.css';

const PER_PAGE = 8;

export default function Episodes() {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);

  const items = useMemo(() => {
    if (!q.trim()) return episodes;
    const t = q.toLowerCase();
    return episodes.filter(
      (e) => e.title.toLowerCase().includes(t) || e.description.toLowerCase().includes(t)
    );
  }, [q]);

  const pageCount = Math.max(1, Math.ceil(items.length / PER_PAGE));

  // Reset to page 1 whenever the filter changes the result set
  useEffect(() => { setPage(1); }, [q]);

  // Guard against an out-of-range page (e.g. list shrank)
  const current = Math.min(page, pageCount);
  const start = (current - 1) * PER_PAGE;
  const visible = items.slice(start, start + PER_PAGE);

  const goTo = (n) => {
    setPage(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Compact page list: 1 … 4 5 [6] 7 8 … 20
  const pageList = buildPageList(current, pageCount);

  return (
    <section className="section">
      <div className="wrap">
        <div className="section__head">
          <div>
            <p className="eyebrow" style={{ marginBottom: 12 }}>The full archive</p>
            <h2>Episodes</h2>
          </div>
          <input
            type="search"
            placeholder="Search episodes…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search episodes"
            style={{
              border: '1px solid var(--line)', borderRadius: 40, padding: '11px 18px',
              fontFamily: 'var(--font-body)', fontSize: 14, minWidth: 220, background: '#fff',
            }}
          />
        </div>

        {items.length === 0 ? (
          <div className="state"><p>No episodes match "{q}".</p></div>
        ) : (
          <>
            {visible.map((e) => <EpisodeRow key={e.guid || e.url} ep={e} />)}

            {pageCount > 1 && (
              <nav className="pager" aria-label="Episode pages">
                <button
                  className="pager__arrow"
                  onClick={() => goTo(current - 1)}
                  disabled={current === 1}
                  aria-label="Previous page"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>

                {pageList.map((n, i) =>
                  n === '…' ? (
                    <span key={`gap-${i}`} className="pager__gap" aria-hidden="true">…</span>
                  ) : (
                    <button
                      key={n}
                      className={'pager__num' + (n === current ? ' is-active' : '')}
                      onClick={() => goTo(n)}
                      aria-label={`Page ${n}`}
                      aria-current={n === current ? 'page' : undefined}
                    >
                      {n}
                    </button>
                  )
                )}

                <button
                  className="pager__arrow"
                  onClick={() => goTo(current + 1)}
                  disabled={current === pageCount}
                  aria-label="Next page"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </nav>
            )}

            <p className="pager__count">
              Showing {start + 1}–{start + visible.length} of {items.length} episodes
            </p>
          </>
        )}
      </div>
    </section>
  );
}

// Returns a compact list like [1, '…', 4, 5, 6, '…', 20].
// Always shows first, last, current, and one neighbor on each side.
function buildPageList(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);

  const out = [];
  let prev = 0;
  for (const n of sorted) {
    if (n - prev > 1) out.push('…');
    out.push(n);
    prev = n;
  }
  return out;
}
