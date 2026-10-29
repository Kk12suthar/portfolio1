import { useRef } from 'react';
import { transformer } from '../content';
import { useReveal } from '../lib/reveal';
import PipelineDemo from './PipelineDemo';

const host = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');

export default function Transformer() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section className="tf" id="transformer" ref={root} data-shot="transformer">
      <header className="tf-head">
        <h2 className="tf-title" data-reveal="mask">
          <span className="mask">
            <span>
              {transformer.name}
            </span>
          </span>
        </h2>
        <p className="tf-tagline" data-reveal="mask">
          <span className="mask">
            <span>{transformer.tagline[0]}</span>
          </span>
          <span className="mask">
            <span>
              <em>{transformer.tagline[1]}</em>
            </span>
          </span>
        </p>
      </header>

      <div className="tf-cols">
        <p className="lead" data-reveal>
          {transformer.lead}
        </p>
        <div className="tf-links" data-reveal="stagger">
          <a className="arrow-link" href={transformer.live} target="_blank" rel="noreferrer">
            Open the live app <i>↗</i>
          </a>
          <a className="arrow-link" href={transformer.code} target="_blank" rel="noreferrer">
            Code on GitHub <i>↗</i>
          </a>
        </div>
      </div>

      <div className="tf-demo" data-reveal>
        <PipelineDemo />
        <p className="fig-note">
          An illustration of one run. The real one is at{' '}
          <a href={transformer.live} target="_blank" rel="noreferrer">
            {host(transformer.live)}
          </a>
          .
        </p>
      </div>

      <ul className="tags tags--credits" aria-label="Built with" data-reveal="stagger">
        {transformer.tags.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </section>
  );
}
