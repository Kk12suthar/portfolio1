import { useRef } from 'react';
import { work } from '../content';
import { useReveal } from '../lib/reveal';
import Bpmn from './Bpmn';
import Metrics from './Metrics';

export default function Work() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  // told in order: read the diagram first, then write it
  const roles = [...work.roles].sort((a, b) => a.index.localeCompare(b.index));

  return (
    <section className="work" id="work" ref={root} data-shot="work">
      <header className="sec-head">
        <h2 className="sec-title sec-title--sm" data-reveal="mask">
          {work.title.map((l, i) => (
            <span key={l} className="mask">
              <span>{i === work.title.length - 1 ? <em>{l}</em> : l}</span>
            </span>
          ))}
        </h2>
        <p className="lead" data-reveal>
          {work.lead}
        </p>
      </header>

      {roles.map((r) => (
        <article key={r.id} className={`role role--${r.id}`}>
          <div className="role-meta" data-reveal="stagger">
            <span className="role-index">{r.index}</span>
            <p className="role-when">{r.when}</p>
            <p className="role-co">Accenture</p>
          </div>
          <div className="role-body" data-reveal="stagger">
            <h3 className="role-title">{r.title}</h3>
            <ul className="role-beats">
              {r.beats.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <Metrics items={r.metrics} />
            <ul className="tags" aria-label="Tools">
              {r.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div className="role-fig">
            <Bpmn variant={r.id} caption={r.fig} />
          </div>
        </article>
      ))}
    </section>
  );
}
