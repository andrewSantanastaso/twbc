import { NavLink, Link } from 'react-router-dom';
import './Nav.css';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/episodes', label: 'Episodes' },
  { to: '/reading-list', label: 'Reading list' },
  { to: '/about', label: 'About' },
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
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => 'nav__link' + (isActive ? ' is-active' : '')}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
