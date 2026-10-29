import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { numbers } from '../content';
import { reducedMotion, useReveal } from '../lib/reveal';

export default function Numbers() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  // each figure counts up from zero the first time it is seen
  useLayoutEffect(() => {
    if (!root.current || reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.num-value b').forEach((el) => {
        const end = Number(el.dataset.value);
        const n = { v: 0 };
        el.textContent = '0';
        gsap.to(n, {
          v: end,
          duration: 1.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          onUpdate: () => {
            el.textContent = String(Math.round(n.v));
          },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="nums" id="numbers" ref={root} data-shot="numbers">
      <dl className="num-grid" data-reveal="stagger">
        {numbers.stats.map((s) => (
          <div key={s.label} className="num">
            <dt className="num-value">
              <b data-value={s.value}>{s.value}</b>
              <span>{s.suffix}</span>
            </dt>
            <dd>{s.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
