import { NavLink, Link } from "react-router-dom";
import "./Nav.css";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/episodes", label: "Episodes" },
  { to: "/reading-list", label: "Reading list" },
  { to: "/about", label: "About" },
  // WROMANCEL is a separate app served via a Netlify proxy, NOT a React route.
  // It must be a real anchor so the browser navigates (and the proxy fires),
  // rather than a NavLink that React Router would try to resolve client-side.
  { to: "/wromancel", label: "Play WROMANCEL", external: true },
];

export default function Nav() {
  return (
    <header className="nav">
      <div className="wrap nav__inner">
        <Link to="/" className="nav__brand">
          <img src="/logo.png" alt="" className="nav__logo" />
          <span className="nav__name">Trigger Warnings</span>
        </Link>
        <nav className="nav__links" aria-label="Primary">
          {links.map((l) =>
            l.external ? (
              <a
                key={l.to}
                href={l.to}
                className="nav__link"
                // Force a real, full-page navigation. /wromancel is a Netlify
                // proxy to a separate app, not a React route — without this, the
                // SPA can intercept the first click and render a blank page until
                // a manual reload triggers a true HTTP request. This guarantees
                // the browser hits the proxy on the first click.
                onClick={(e) => {
                  e.preventDefault();
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
                className={({ isActive }) =>
                  "nav__link" + (isActive ? " is-active" : "")
                }
              >
                {l.label}
              </NavLink>
            ),
          )}
        </nav>
      </div>
    </header>
  );
}
