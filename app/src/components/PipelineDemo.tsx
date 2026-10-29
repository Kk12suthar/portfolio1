import { useCallback, useEffect, useRef, useState } from 'react';
import { delay, useInView } from '../lib/inView';
import { reducedMotion } from '../lib/reveal';

/* A small, honest illustration of what Transformer does:
 * a messy orders.csv, one sentence, and the agents taking it from there. */

const ASK = 'Fix the dates, drop duplicates, and total spend by customer.';

type Row = { raw: [string, string, string]; clean: [string, string, string]; dupe?: boolean };

const ROWS: Row[] = [
  { raw: ['ravi sharma', '03/04/24', '$1,200'], clean: ['Ravi Sharma', '2024-04-03', '1,200.00'] },
  { raw: ['Ravi Sharma ', '2024-4-3', '1200.00'], clean: ['Ravi Sharma', '2024-04-03', '1,200.00'], dupe: true },
  { raw: ['ANITA DESAI', '4 Apr 2024', '850'], clean: ['Anita Desai', '2024-04-04', '850.00'] },
  { raw: ['anita desai', '2024/04/05', '850.0'], clean: ['Anita Desai', '2024-04-05', '850.00'] },
  { raw: ['Meera  Iyer', '5-4-2024', '2,310.5'], clean: ['Meera Iyer', '2024-04-05', '2,310.50'] },
];

const SUMMARY: [string, string, string][] = [
  ['Meera Iyer', '1', '2,310.50'],
  ['Anita Desai', '2', '1,700.00'],
  ['Ravi Sharma', '1', '1,200.00'],
];

const STAGES = ['orders.csv', 'Parse', 'Clean', 'Transform', 'MCP · role-based DB', 'orders_by_customer'];

const LOG: [string, string][] = [
  ['PARSE', 'orders.csv · 5 rows · 3 columns · 5 date formats'],
  ['CLEAN', '12 cells normalised · 1 duplicate dropped'],
  ['TRANSFORM', 'group by customer · sum(amount) · sort desc'],
  ['MCP', 'write analytics.orders_by_customer · role: analyst'],
  ['DONE', '3 rows ready'],
];

// step: 0 idle · 1 typing · 2 parse · 3 clean · 4 transform · 5 write · 6 done
const TIMELINE = [0, 0, 2400, 3500, 5600, 7000, 8000];

export default function PipelineDemo() {
  const root = useRef<HTMLDivElement>(null);
  const on = useInView(root, 0.4);
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState(0);
  const timers = useRef<number[]>([]);

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const run = useCallback(() => {
    clear();
    if (reducedMotion()) {
      setTyped(ASK.length);
      setStep(6);
      return;
    }
    setStep(1);
    setTyped(0);
    for (let i = 1; i <= ASK.length; i++) timers.current.push(window.setTimeout(() => setTyped(i), 300 + i * 28));
    for (let s = 2; s <= 6; s++) timers.current.push(window.setTimeout(() => setStep(s), TIMELINE[s]));
  }, []);

  useEffect(() => {
    if (on) run();
    return clear;
  }, [on, run]);

  // which pipeline stage is lit
  const stage = step <= 1 ? 0 : step >= 6 ? 5 : step - 1;

  return (
    <div ref={root} className={`demo step-${step}`}>
      <ol className="pipe" aria-label="Transformer pipeline">
        {STAGES.map((s, i) => (
          <li key={s} className={i < stage ? 'is-done' : i === stage ? 'is-live' : ''}>
            <span className="pipe-n">{String(i).padStart(2, '0')}</span>
            {s}
          </li>
        ))}
      </ol>

      <div className="demo-grid">
        <div className="demo-sheet">
          <p className="demo-ask">
            <span className="demo-who">YOU</span>
            <span>
              {ASK.slice(0, typed)}
              {step === 1 && <i className="caret" aria-hidden="true" />}
            </span>
          </p>

          <div className="sheet-stack">
            <table className={`sheet sheet--records ${step >= 4 ? 'is-out' : ''}`}>
              <caption className="sr-only">orders.csv, before and after cleaning</caption>
              <thead>
                <tr className={step === 2 ? 'is-scan' : ''}>
                  <th>customer</th>
                  <th>date</th>
                  <th>amount</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r, ri) => (
                  <tr key={ri} className={`${step >= 3 ? 'is-clean' : ''} ${r.dupe && step >= 3 ? 'is-dupe' : ''}`}>
                    {r.raw.map((v, ci) => (
                      <td key={ci} className={v !== r.clean[ci] ? 'is-dirty' : ''} style={delay(ri * 0.12 + ci * 0.06)}>
                        <span className="cell">
                          <span className="was">{v}</span>
                          <span className="now">{r.clean[ci]}</span>
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <table className={`sheet sheet--summary ${step >= 4 ? 'is-in' : ''}`} aria-hidden={step < 4}>
              <thead>
                <tr>
                  <th>customer</th>
                  <th>orders</th>
                  <th>total</th>
                </tr>
              </thead>
              <tbody>
                {SUMMARY.map((r, ri) => (
                  <tr key={r[0]} style={delay(0.25 + ri * 0.14)}>
                    {r.map((v, ci) => (
                      <td key={ci}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="demo-log" aria-live="polite">
          <p className="demo-log-head">agents.log</p>
          {LOG.map(([tag, line], i) => (
            <p key={tag} className={step >= i + 2 ? 'is-on' : ''}>
              <b>{tag}</b>
              <span>{line}</span>
            </p>
          ))}
          <button type="button" className="demo-again" onClick={run} disabled={step > 0 && step < 6}>
            Run it again
          </button>
        </div>
      </div>
    </div>
  );
}
