import { useState } from 'react';
import months from '../data/reading-list.json';
import './pages.css';
import './reading.css';

export default function ReadingList() {
  const current = months[0];
  const archive = months.slice(1);
  const [openMonth, setOpenMonth] = useState(null);

  if (!current) {
    return (
      <section className="section">
        <div className="wrap">
          <div className="section__head">
            <div>
              <p className="eyebrow" style={{ marginBottom: 12 }}>Build your TBR</p>
              <h2>Reading list</h2>
            </div>
          </div>
          <div className="state"><p>This month's picks are coming soon — check back shortly.</p></div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="wrap">
        <div className="section__head">
          <div>
            <p className="eyebrow" style={{ marginBottom: 12 }}>What we're reading</p>
            <h2>{current.month}</h2>
          </div>
          {current.intro && <p>{current.intro}</p>}
        </div>

        <div className="bookgrid">
          {current.books.map((b, i) => <BookCard key={i} book={b} />)}
        </div>

        {archive.length > 0 && (
          <div className="archive">
            <h3 className="archive__title">Past months</h3>
            {archive.map((m) => (
              <div className="archive__month" key={m.order}>
                <button
                  className="archive__toggle"
                  onClick={() => setOpenMonth(openMonth === m.order ? null : m.order)}
                  aria-expanded={openMonth === m.order}
                >
                  <span>{m.month}</span>
                  <span className="archive__count">{m.books.length} book{m.books.length === 1 ? '' : 's'}</span>
                  <svg className={'archive__chev' + (openMonth === m.order ? ' is-open' : '')} width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                {openMonth === m.order && (
                  <div className="bookgrid bookgrid--archive">
                    {m.books.map((b, i) => <BookCard key={i} book={b} />)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function BookCard({ book }) {
  const query = encodeURIComponent(`${book.title} ${book.author || ''}`.trim());
  const goodreads = `https://www.goodreads.com/search?q=${query}`;

  return (
    <a
      className="bookcard"
      href={goodreads}
      target="_blank"
      rel="noreferrer"
      aria-label={`${book.title}${book.author ? ' by ' + book.author : ''} — view on Goodreads`}
    >
      <div className="bookcard__cover">
        {book.cover
          ? <img
              src={book.cover}
              alt={`${book.title} cover`}
              loading="lazy"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          : <div className="bookcard__placeholder" aria-hidden="true">
              <svg width="34" height="34" viewBox="0 0 24 24"><path d="M4 5a2 2 0 012-2h9a2 2 0 012 2v15l-6-3-6 3V5z" fill="currentColor" opacity="0.35"/></svg>
            </div>}
        <span className="bookcard__hover" aria-hidden="true">View on Goodreads</span>
      </div>
      <div className="bookcard__body">
        <h4 className="bookcard__title">{book.title}</h4>
        {book.author && <p className="bookcard__author">{book.author}</p>}
        {book.note && <span className="bookcard__note">{book.note}</span>}
      </div>
    </a>
  );
}
