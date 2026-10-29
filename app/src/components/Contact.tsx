import { useRef, useState, type MouseEvent } from 'react';
import { contact, FILM_URL } from '../content';
import { useReveal } from '../lib/reveal';

export default function Contact({ onFilm, onTop }: { onFilm: () => void; onTop: () => void }) {
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  useReveal(root);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${contact.email}`;
    }
  };

  const film = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    onFilm();
  };

  return (
    <section className="contact" id="contact" ref={root} data-shot="contact">
      <h2 className="sec-title" data-reveal="mask">
        <span className="mask">
          <span>{contact.title[0]}</span>
        </span>
        <span className="mask">
          <span>
            <em>{contact.title[1]}</em>
          </span>
        </span>
      </h2>
      <p className="lead" data-reveal>
        {contact.lead}
      </p>

      <div className="mail" data-reveal>
        <a className="mail-link" href={`mailto:${contact.email}`}>
          {contact.email}
        </a>
        <button type="button" className="mail-copy" onClick={copy} aria-live="polite">
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <ul className="contact-links" data-reveal="stagger">
        {contact.links.map((l) => (
          <li key={l.label}>
            <a className="arrow-link" href={l.href} target="_blank" rel="noreferrer">
              {l.label} <i>↗</i>
            </a>
          </li>
        ))}
        <li>
          <a className="arrow-link" href={FILM_URL} onClick={film}>
            Back to the film <i>↖</i>
          </a>
        </li>
      </ul>

      <footer className="foot">
        <div className="foot-row">
          <p>© {new Date().getFullYear()} Kishor Kumar Suthar</p>
          <button type="button" className="arrow-link" onClick={onTop}>
            Top <i>↑</i>
          </button>
        </div>
      </footer>
    </section>
  );
}
