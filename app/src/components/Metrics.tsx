import { useRef, type CSSProperties } from 'react';
import type { Metric } from '../content';
import { useInView } from '../lib/inView';

/* Before and after, as bars: a ghost for where it was, ink for where it is. */
export default function Metrics({ items }: { items: Metric[] }) {
  const root = useRef<HTMLDListElement>(null);
  const on = useInView(root, 0.5);

  return (
    <dl ref={root} className={`metrics ${on ? 'is-on' : ''}`}>
      {items.map((m, i) => (
        <div key={m.label} className="metric" style={{ '--from': m.a ?? 0, '--to': m.b, '--d': `${0.15 + i * 0.18}s` } as CSSProperties}>
          <dt>{m.label}</dt>
          <dd>
            <span className="metric-track" aria-hidden="true">
              {m.a !== undefined && <i className="metric-was" />}
              <i className="metric-now" />
            </span>
            <span className="metric-nums">
              {m.from && (
                <>
                  <s>{m.from}</s>
                  <span aria-hidden="true">→</span>
                </>
              )}
              <b>{m.to}</b>
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
