function formatDate(raw) {
  if (!raw) return '';
  const d = new Date(raw + 'T12:00:00');
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function EpisodeRow({ ep }) {
  const label = [ep.season && `S${ep.season}`, ep.episode && `E${ep.episode}`]
    .filter(Boolean).join('');

  return (
    <article className="epcard">
      <div>
        <div className="epcard__tag">
          {label && <span className="epcard__season">{label}</span>}
          {ep.date && <span className="epcard__date">{formatDate(ep.date)}</span>}
        </div>
        <h3 className="epcard__title">{ep.title}</h3>
        {ep.description && <p className="epcard__desc">{ep.description}</p>}
      </div>
      <div className="epcard__right">
        {ep.duration && <span className="epcard__dur">{ep.duration}</span>}
        <a
          className="epcard__play"
          href={ep.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`Listen to ${ep.title} on Spotify`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm4.6 14.4a.62.62 0 01-.86.21c-2.35-1.44-5.3-1.76-8.79-.96a.62.62 0 11-.28-1.22c3.81-.87 7.08-.5 9.72 1.11.3.18.39.57.21.86zm1.23-2.73a.78.78 0 01-1.07.26c-2.69-1.66-6.79-2.14-9.98-1.17a.78.78 0 11-.45-1.49c3.64-1.1 8.16-.57 11.25 1.33.36.22.48.7.25 1.07zm.1-2.84C14.8 8.98 9.3 8.8 6.16 9.76a.94.94 0 11-.54-1.8c3.6-1.09 9.67-.88 13.48 1.38a.94.94 0 11-.96 1.6z" fill="currentColor"/>
          </svg>
          Listen
        </a>
      </div>
    </article>
  );
}
