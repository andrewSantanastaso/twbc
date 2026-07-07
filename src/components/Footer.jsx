import { Link } from "react-router-dom";
import { ScytheRule } from "./Scythe";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <ScytheRule />
        <div className="foot__inner">
          <div className="foot__brand">
            <img src="/logo.png" alt="" className="foot__logo" />
            <div>
              <p className="foot__name">Trigger Warnings</p>
              <p className="foot__tag">Book Club</p>
            </div>
          </div>
          <nav className="foot__links" aria-label="Footer">
            <Link to="/episodes">Episodes</Link>
            <Link to="/reading-list">Reading list</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>
        <div className="foot__social">
          <a
            href="https://open.spotify.com/show/31X8hxiQsxuUbJID6nPor0"
            target="_blank"
            rel="noreferrer"
            aria-label="Listen on Spotify"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm4.6 14.4a.62.62 0 01-.86.21c-2.35-1.44-5.3-1.76-8.79-.96a.62.62 0 11-.28-1.22c3.81-.87 7.08-.5 9.72 1.11.3.18.39.57.21.86zm1.23-2.73a.78.78 0 01-1.07.26c-2.69-1.66-6.79-2.14-9.98-1.17a.78.78 0 11-.45-1.49c3.64-1.1 8.16-.57 11.25 1.33.36.22.48.7.25 1.07zm.1-2.84C14.8 8.98 9.3 8.8 6.16 9.76a.94.94 0 11-.54-1.8c3.6-1.09 9.67-.88 13.48 1.38a.94.94 0 11-.96 1.6z" fill="currentColor"/>
            </svg>
          </a>
          <a
            href="https://www.youtube.com/@TriggerWarningsBookClub"
            target="_blank"
            rel="noreferrer"
            aria-label="Watch on YouTube"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21.6 7.2a2.5 2.5 0 00-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.84.43A2.5 2.5 0 002.4 7.2 26 26 0 002 12a26 26 0 00.4 4.8 2.5 2.5 0 001.76 1.77C5.75 19 12 19 12 19s6.25 0 7.84-.43a2.5 2.5 0 001.76-1.77A26 26 0 0022 12a26 26 0 00-.4-4.8zM10 15V9l5.2 3-5.2 3z" fill="currentColor"/>
            </svg>
          </a>
        </div>
        <p className="foot__fine">
          © {new Date().getFullYear()} Trigger Warnings Book Club.
        </p>
      </div>
    </footer>
  );
}
