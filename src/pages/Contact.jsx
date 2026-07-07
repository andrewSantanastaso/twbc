import { useState } from 'react';
import { ScytheRule } from '../components/Scythe';
import Seo from '../components/Seo';
import './pages.css';
import './about.css';
import './contact.css';

const FORM_NAME = 'contact';

// Netlify Forms works by scraping the *static* HTML at build time for a form
// with a matching name — it never runs our React. So a hidden, plain-HTML
// version of this exact form (same name, same field names) lives in index.html
// for the build bot to find. This React form submits URL-encoded data to "/",
// which Netlify intercepts and files under that same form name.
function encode(data) {
  return Object.keys(data)
    .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
    .join('&');
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | ok | error
  const [botField, setBotField] = useState(''); // honeypot

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': FORM_NAME, 'bot-field': botField, ...form }),
      });
      if (!res.ok) throw new Error(`Bad response: ${res.status}`);
      setStatus('ok');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Contact form submit failed:', err);
      setStatus('error');
    }
  };

  return (
    <>
      <Seo
        title="Contact"
        description="Get in touch with Trigger Warnings Book Club — book recommendations, guest ideas, feedback, or just to say hi."
        path="/contact"
      />
      <section className="about-hero">
        <div className="wrap">
          <p className="eyebrow" style={{ marginBottom: 16 }}>Say hello</p>
          <h1>Got a book rec,<br />or a bone to pick?</h1>
        </div>
      </section>

      <section className="section">
        <div className="wrap about-body">
          <div className="about-lead">
            <p>
              Whether you want to recommend a book, pitch a trope for us to argue about,
              flag a correction, or just tell us we got an ending completely wrong — drop
              us a line. CJ, Holly, and Andrew read everything, even if it takes a bit to reply.
            </p>
            <ScytheRule />

            {status === 'ok' ? (
              <div className="contact-thanks" role="status">
                <h3>Message sent!</h3>
                <p>Thanks for reaching out — we'll get back to you soon.</p>
                <button className="contact-btn" onClick={() => setStatus('idle')}>
                  Send another
                </button>
              </div>
            ) : (
              <form
                name={FORM_NAME}
                method="POST"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                onSubmit={submit}
                className="contact-form"
                noValidate
              >
                {/* Honeypot: real users never see or fill this; bots often do. */}
                <p className="contact-hp" aria-hidden="true">
                  <label>
                    Don't fill this out:{' '}
                    <input
                      name="bot-field"
                      tabIndex={-1}
                      autoComplete="off"
                      value={botField}
                      onChange={(e) => setBotField(e.target.value)}
                    />
                  </label>
                </p>

                <div className="contact-row">
                  <label className="contact-label">
                    Name
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={update}
                      required
                      autoComplete="name"
                    />
                  </label>
                  <label className="contact-label">
                    Email
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={update}
                      required
                      autoComplete="email"
                    />
                  </label>
                </div>

                <label className="contact-label">
                  Subject
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={update}
                    placeholder="Book rec, feedback, guest idea…"
                  />
                </label>

                <label className="contact-label">
                  Message
                  <textarea
                    name="message"
                    rows={6}
                    value={form.message}
                    onChange={update}
                    required
                  />
                </label>

                {status === 'error' && (
                  <p className="contact-error" role="alert">
                    Something went wrong sending that. Please try again, or email us directly.
                  </p>
                )}

                <button
                  type="submit"
                  className="contact-btn"
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? 'Sending…' : 'Send message'}
                </button>
              </form>
            )}
          </div>

          <aside className="about-card">
            <h3>Other ways</h3>
            <p>Prefer to listen or follow along instead?</p>
            <a
              className="about-rss"
              href="https://open.spotify.com/show/31X8hxiQsxuUbJID6nPor0"
              target="_blank"
              rel="noreferrer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm4.6 14.4a.62.62 0 01-.86.21c-2.35-1.44-5.3-1.76-8.79-.96a.62.62 0 11-.28-1.22c3.81-.87 7.08-.5 9.72 1.11.3.18.39.57.21.86zm1.23-2.73a.78.78 0 01-1.07.26c-2.69-1.66-6.79-2.14-9.98-1.17a.78.78 0 11-.45-1.49c3.64-1.1 8.16-.57 11.25 1.33.36.22.48.7.25 1.07zm.1-2.84C14.8 8.98 9.3 8.8 6.16 9.76a.94.94 0 11-.54-1.8c3.6-1.09 9.67-.88 13.48 1.38a.94.94 0 11-.96 1.6z" fill="currentColor"/>
              </svg>
              Listen on Spotify
            </a>
            <a
              className="about-rss about-rss--alt"
              href="https://www.youtube.com/@TriggerWarningsBookClub"
              target="_blank"
              rel="noreferrer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21.6 7.2a2.5 2.5 0 00-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.84.43A2.5 2.5 0 002.4 7.2 26 26 0 002 12a26 26 0 00.4 4.8 2.5 2.5 0 001.76 1.77C5.75 19 12 19 12 19s6.25 0 7.84-.43a2.5 2.5 0 001.76-1.77A26 26 0 0022 12a26 26 0 00-.4-4.8zM10 15V9l5.2 3-5.2 3z" fill="currentColor"/>
              </svg>
              Watch on YouTube
            </a>
            <p className="about-fine" style={{ marginTop: 20 }}>
              We read every message, but we're a small show — replies can
              take a little while.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
