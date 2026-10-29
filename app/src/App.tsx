import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { Stream, SHOTS, supportsWebGL } from './lib/stream';
import { FILM_URL, type Mode } from './content';
import Nav from './components/Nav';
import Hero from './components/Hero';
import VoiceOver from './components/VoiceOver';
import Work from './components/Work';
import Transformer from './components/Transformer';
import Stack from './components/Stack';
import Numbers from './components/Numbers';
import Contact from './components/Contact';

gsap.registerPlugin(ScrollTrigger);

// shared with the film, so the side you picked there carries over
const THEME_STORAGE_KEY = 'kixai-emotional-mode';

const getInitialMode = (): Mode => {
  try {
    const q = new URLSearchParams(window.location.search).get('mode');
    if (q === 'rage' || q === 'calm') return q;
    return window.localStorage.getItem(THEME_STORAGE_KEY) === 'calm' ? 'calm' : 'rage';
  } catch {
    return 'rage';
  }
};

// another origin (local dev) cannot read our localStorage, so the side travels in the URL
const withMode = (url: string, mode: Mode) =>
  /^https?:/.test(url) && new URL(url).origin !== window.location.origin
    ? `${url}${url.includes('?') ? '&' : '?'}mode=${mode}`
    : url;

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function App() {
  const [mode, setMode] = useState<Mode>(getInitialMode);
  const [ready, setReady] = useState(false);
  const streamHost = useRef<HTMLDivElement>(null);
  const stream = useRef<Stream | null>(null);
  const lenis = useRef<Lenis | null>(null);
  const modeRef = useRef(mode);
  modeRef.current = mode;

  // the stream
  useEffect(() => {
    if (!streamHost.current || !supportsWebGL()) {
      document.documentElement.classList.add('no-webgl');
      return;
    }
    const s = new Stream(streamHost.current, getInitialMode());
    stream.current = s;
    s.arrive();
    if (import.meta.env.DEV) Object.assign(window, { __stream: s, __gsap: gsap, __st: ScrollTrigger });
    return () => {
      s.dispose();
      stream.current = null;
    };
  }, []);

  // the URL carried the side in; it has done its job
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('mode')) {
      window.history.replaceState(null, '', window.location.pathname + window.location.hash);
    }
    const t = window.setTimeout(() => setReady(true), 650);
    return () => window.clearTimeout(t);
  }, []);

  // smooth scroll on the gsap ticker; each section's position becomes a camera key
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    const reduce = prefersReducedMotion();
    const l = new Lenis({ lerp: reduce ? 1 : 0.085, smoothWheel: !reduce });
    lenis.current = l;
    l.on('scroll', (inst: Lenis) => {
      ScrollTrigger.update();
      stream.current?.setScroll(inst.progress);
    });
    const tick = (t: number) => l.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const keys = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const list = Array.from(document.querySelectorAll<HTMLElement>('[data-shot]'))
        .map((el) => {
          const top = el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.35;
          return { p: Math.min(1, Math.max(0, top / max)), shot: SHOTS[el.dataset.shot ?? ''] };
        })
        .filter((k) => k.shot);
      list[0].p = 0;
      stream.current?.setKeys(list);
    };
    ScrollTrigger.addEventListener('refresh', keys);
    ScrollTrigger.refresh();
    return () => {
      ScrollTrigger.removeEventListener('refresh', keys);
      gsap.ticker.remove(tick);
      l.destroy();
      lenis.current = null;
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', mode === 'calm' ? '#f4f4f1' : '#0b0a09');
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      /* private mode */
    }
    stream.current?.setMode(mode);
  }, [mode]);

  const toggleMode = useCallback(
    (origin?: { x: number; y: number }) => {
      const next: Mode = mode === 'rage' ? 'calm' : 'rage';
      const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
      if (!doc.startViewTransition || prefersReducedMotion()) {
        setMode(next);
        return;
      }
      const x = origin?.x ?? window.innerWidth / 2;
      const y = origin?.y ?? window.innerHeight / 2;
      const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      const root = document.documentElement.style;
      root.setProperty('--vt-x', `${x}px`);
      root.setProperty('--vt-y', `${y}px`);
      root.setProperty('--vt-r', `${r}px`);
      doc.startViewTransition(() => flushSync(() => setMode(next)));
    },
    [mode]
  );

  const goTo = useCallback((target: string) => {
    lenis.current?.scrollTo(target, { offset: 0, duration: 1.6 });
  }, []);

  const backToFilm = useCallback(async () => {
    const url = withMode(FILM_URL, modeRef.current);
    document.documentElement.classList.add('is-warping');
    lenis.current?.stop();
    await Promise.all([stream.current?.depart(), new Promise((r) => setTimeout(r, 1100))]);
    window.location.href = url;
  }, []);

  // coming back with the browser's back button restores a frozen page
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) window.location.reload();
    };
    window.addEventListener('pageshow', onShow);
    return () => window.removeEventListener('pageshow', onShow);
  }, []);

  return (
    <>
      <div className="world" ref={streamHost} aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <Nav mode={mode} onToggle={toggleMode} onNavigate={goTo} onFilm={backToFilm} />

      <main className="page">
        <Hero ready={ready} onNavigate={goTo} />
        <VoiceOver />
        <Work />
        <Transformer />
        <Stack />
        <Numbers />
        <Contact onFilm={backToFilm} onTop={() => goTo('#top')} />
      </main>

      <div className="warp-veil" aria-hidden="true" />
      <div className="arrive" aria-hidden="true" />
    </>
  );
}
