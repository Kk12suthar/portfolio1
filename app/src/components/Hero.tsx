import { useLayoutEffect, useRef, type MouseEvent } from 'react';
import gsap from 'gsap';
import { hero } from '../content';
import { reducedMotion } from '../lib/reveal';

interface HeroProps {
  ready: boolean;
  onNavigate: (target: string) => void;
}

export default function Hero({ ready, onNavigate }: HeroProps) {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      if (reducedMotion()) return;
      if (!ready) {
        gsap.set('.hero-title .mask > span', { yPercent: 115 });
        gsap.set('[data-hero-in]', { opacity: 0, y: 24 });
        return;
      }
      const tl = gsap.timeline({ delay: 0.15 });
      tl.to('.hero-title .mask > span', { yPercent: 0, duration: 1.6, ease: 'expo.out', stagger: 0.12 })
        .to('[data-hero-in]', { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08 }, 0.5);

      // the title drifts up a little slower than the page
      gsap.to('.hero-title', {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, [ready]);

  const go = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onNavigate(href);
  };

  return (
    <section className="hero" id="top" ref={root} data-shot="hero">
      <h1 className="hero-title">
        <span className="sr-only">Kishor Kumar, AI engineer</span>
        <span className="mask" aria-hidden="true">
          <span>Kishor</span>
        </span>
        <span className="mask" aria-hidden="true">
          <span className="sub">Kumar</span>
        </span>
      </h1>

      <div className="hero-foot">
        <div className="hero-copy">
          <p className="hero-lead" data-hero-in>
            {hero.lead}
          </p>
          <div className="hero-ctas" data-hero-in>
            <a className="arrow-link" href="#work" onClick={(e) => go(e, '#work')}>
              See the work <i>↓</i>
            </a>
            <a className="arrow-link" href="#contact" onClick={(e) => go(e, '#contact')}>
              Write to me <i>→</i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
