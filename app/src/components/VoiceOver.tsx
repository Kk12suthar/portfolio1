import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { voiceOver } from '../content';
import { reducedMotion } from '../lib/reveal';

/* The "who I am" paragraph, set as voice-over. Words surface as you read. */
export default function VoiceOver() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!root.current || reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from('.vo-cue', {
        opacity: 0,
        y: 20,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.vo-cue', start: 'top 85%', once: true },
      });
      gsap.utils.toArray<HTMLElement>('.vo-text').forEach((p) => {
        gsap.fromTo(
          p.querySelectorAll('.w'),
          { opacity: 0.12 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.05,
            scrollTrigger: { trigger: p, start: 'top 82%', end: 'bottom 52%', scrub: true },
          }
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="vo" id="about" ref={root} data-shot="voice">
      {voiceOver.map((para, i) => (
        <p key={i} className={`vo-text ${i === 0 ? 'vo-text--first' : ''}`}>
          {para.split(' ').map((w, k) => (
            <span key={k} className="w">
              {w}{' '}
            </span>
          ))}
        </p>
      ))}
    </section>
  );
}
