import { useEffect, useState, type MouseEvent } from 'react';
import { FILM_URL, type Mode } from '../content';

interface NavProps {
  mode: Mode;
  onToggle: (origin?: { x: number; y: number }) => void;
  onNavigate: (target: string) => void;
  onFilm: () => void;
}

const links = [
  { label: 'Work', href: '#work' },
  { label: 'Transformer', href: '#transformer' },
  { label: 'Kit', href: '#stack' },
  { label: 'Contact', href: '#contact' },
];

export const originOf = (e: MouseEvent<HTMLElement>) => {
  if (e.clientX || e.clientY) return { x: e.clientX, y: e.clientY };
  const r = e.currentTarget.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
};

export default function Nav({ mode, onToggle, onNavigate, onFilm }: NavProps) {
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [nameOpen, setNameOpen] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setNameOpen(false), 4200);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 40);
      setHidden(y > lastY + 2 && y > window.innerHeight * 0.6 && !open);
      if (y < lastY - 2) setHidden(false);
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [open]);

  const go = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    onNavigate(href);
  };

  const film = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    setOpen(false);
    onFilm();
  };

  const isLight = mode === 'calm';

  return (
    <header className={`nav ${solid ? 'is-solid' : ''} ${hidden ? 'is-hidden' : ''}`}>
      <a href={FILM_URL} className={`logo ${nameOpen ? 'is-open' : ''}`} onClick={film} aria-label="KiX. Back to the film">
        <span className="logo-mark">
          Ki<b>X</b>
        </span>
        <span className="logo-name">The Engineer Realm</span>
      </a>

      <nav aria-label="Sections">
        <ul className={`nav-links ${open ? 'is-open' : ''}`}>
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={(e) => go(e, l.href)}>
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a href={FILM_URL} onClick={film}>
              The film<sup>↖</sup>
            </a>
          </li>
        </ul>
      </nav>

      <div className="nav-right">
        <button
          type="button"
          className="mode"
          role="switch"
          aria-checked={isLight}
          aria-label={isLight ? 'Light side. Switch to the dark side' : 'Dark side. Switch to the light side'}
          onClick={(e) => onToggle(originOf(e))}
        >
          <span className="mode-label" aria-hidden="true">
            <span>Dark</span>
            <span>Light</span>
          </span>
          <span className="mode-orb" aria-hidden="true" />
        </button>
        <button type="button" className="menu-btn" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
    </header>
  );
}
