import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import './Nav.css';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/episodes', label: 'Episodes' },
  { to: '/reading-list', label: 'Reading list' },
  { to: '/about', label: 'About' },
  // WROMANCEL is a separate app served via a Netlify proxy, NOT a React route.
  // It must be a real anchor so the browser navigates (and the proxy fires),
  // rather than a NavLink that React Router would try to resolve client-side.
  { to: '/wromancel', label: 'Play WROMANCEL', external: true },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close the mobile menu whenever the route changes (i.e. after tapping a link).
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Close on Escape, and lock body scroll while the menu is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const renderLink = (l) =>
    l.external ? (
      <a
        key={l.to}
        href={l.to}
        className="nav__link"
        // Force a real, full-page navigation. /wromancel is a Netlify proxy to a
        // separate app, not a React route — without this, the SPA can intercept
        // the first click and render a blank page until a manual reload triggers
        // a true HTTP request. This guarantees the browser hits the proxy.
        onClick={(e) => {
          e.preventDefault();
          setOpen(false);
          window.location.assign(l.to);
        }}
      >
        {l.label}
      </a>
    ) : (
      <NavLink
        key={l.to}
        to={l.to}
        end={l.end}
        className={({ isActive }) => 'nav__link' + (isActive ? ' is-active' : '')}
        onClick={() => setOpen(false)}
      >
        {l.label}
      </NavLink>
    );

  return (
    <header className="nav">
      <div className="wrap nav__inner">
        <Link to="/" className="nav__brand">
          <img src="/logo.png" alt="" className="nav__logo" />
          <span className="nav__name">Trigger Warnings</span>
        </Link>

        {/* Desktop links (hidden on mobile via CSS) */}
        <nav className="nav__links" aria-label="Primary">
          {links.map(renderLink)}
        </nav>

        {/* Hamburger toggle (hidden on desktop via CSS) */}
        <button
          className="nav__toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={'nav__toggle-bar' + (open ? ' is-open-1' : '')} />
          <span className={'nav__toggle-bar' + (open ? ' is-open-2' : '')} />
          <span className={'nav__toggle-bar' + (open ? ' is-open-3' : '')} />
        </button>
      </div>

      {/* Mobile dropdown panel */}
      <div
        className={'nav__mobile' + (open ? ' is-open' : '')}
        id="mobile-menu"
        hidden={!open}
      >
        <nav className="nav__mobile-links" aria-label="Mobile">
          {links.map(renderLink)}
        </nav>
      </div>

      {/* Tap-outside backdrop */}
      {open && <div className="nav__backdrop" onClick={() => setOpen(false)} />}
    </header>
  );
}
