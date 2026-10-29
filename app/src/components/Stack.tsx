import { useRef } from 'react';
import { stack } from '../content';
import { useReveal } from '../lib/reveal';

export default function Stack() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section className="kit" id="stack" ref={root} data-shot="stack">
      <header className="sec-head sec-head--row">
        <h2 className="sec-title sec-title--sm" data-reveal="mask">
          <span className="mask">
            <span>{stack.title[0]}</span>
          </span>
          <span className="mask">
            <span>
              <em>{stack.title[1]}</em>
            </span>
          </span>
        </h2>
      </header>

      <div className="kit-groups">
        {stack.groups.map((g, gi) => (
          <div key={g.name} className="kit-group" data-reveal="stagger">
            <h3>
              <span>{String(gi + 1).padStart(2, '0')}</span>
              {g.name}
            </h3>
            <ul>
              {g.items.map((it) => (
                <li key={it.what}>
                  <b>{it.what}</b>
                  <span>{it.with}</span>
                  <i>{it.yrs}</i>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
