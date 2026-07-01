import { Link } from 'react-router-dom';
import { ScytheRule } from './Scythe';
import './Footer.css';

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
          </nav>
        </div>
        <p className="foot__fine">
          © {new Date().getFullYear()} Trigger Warnings Book Club. Hosted by CJ & Holly.
        </p>
      </div>
    </footer>
  );
}
