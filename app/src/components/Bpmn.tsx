import { useRef } from 'react';
import { delay, useInView } from '../lib/inView';

/* One invoice process, drawn twice:
 *   detect   — 2024: a scanned diagram, and YOLOv9 boxing every element
 *   generate — 2025: a sentence, and an LLM drawing the diagram from it */

type Variant = 'detect' | 'generate';

const PROMPT = 'Approve invoices under 5k. Escalate the rest.';

// element boxes, used for the shapes and for the detection boxes around them
// `under` puts the label below the box (the circles sit too close to their neighbours)
const EL = {
  start: { x: 30, y: 154, w: 32, h: 32, kind: 'start', conf: '0.99', under: true },
  receive: { x: 96, y: 142, w: 118, h: 56, kind: 'task', conf: '0.98', under: false },
  gate: { x: 244, y: 144, w: 52, h: 52, kind: 'gateway', conf: '0.97', under: false },
  approve: { x: 340, y: 62, w: 112, h: 52, kind: 'task', conf: '0.98', under: false },
  escalate: { x: 340, y: 226, w: 112, h: 52, kind: 'task', conf: '0.96', under: false },
  end: { x: 496, y: 154, w: 32, h: 32, kind: 'end', conf: '0.99', under: true },
};

// for "generate", the order things get drawn in
const ORDER: Record<keyof typeof EL, number> = { start: 0, receive: 1, gate: 2, approve: 3, escalate: 4, end: 5 };

const SCAN = 2.6;

export default function Bpmn({ variant, caption }: { variant: Variant; caption: string }) {
  const root = useRef<HTMLElement>(null);
  const on = useInView(root, 0.45);
  const gen = variant === 'generate';
  // generate: the prompt types first, then the diagram builds itself
  const t0 = gen ? 1.9 : 0;
  const at = (k: keyof typeof EL) => (gen ? t0 + ORDER[k] * 0.42 : 0);
  const flowAt = (n: number) => (gen ? t0 + 0.25 + n * 0.42 : 0);
  // detect: each box lands when the scan line passes it
  const boxAt = (k: keyof typeof EL) => 0.25 + ((EL[k].x + EL[k].w) / 560) * SCAN;

  return (
    <figure ref={root} className={`bp bp--${variant} ${on ? 'is-on' : ''}`}>
      <div className="bp-head">
        {gen ? (
          <p className="bp-prompt">
            <span aria-hidden="true">›</span>
            <span className="bp-type" style={{ ['--n' as string]: PROMPT.length }}>
              “{PROMPT}”
            </span>
          </p>
        ) : (
          <p className="bp-prompt">
            <span aria-hidden="true">›</span>
            <span>scan_0412.png · 6 elements</span>
          </p>
        )}
      </div>

      <svg viewBox="0 0 560 320" role="img" aria-label={gen ? `An invoice approval process, generated from the sentence: ${PROMPT}` : 'A scanned invoice approval diagram with each BPMN element boxed by the detector'}>
        <defs>
          <marker id={`arrow-${variant}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 10 5 0 10z" fill="currentColor" />
          </marker>
        </defs>

        {/* paper grid */}
        <g className="bp-grid">
          {Array.from({ length: 13 }, (_, i) => (
            <line key={`v${i}`} x1={i * 46 + 4} y1="0" x2={i * 46 + 4} y2="320" />
          ))}
          {Array.from({ length: 7 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 46 + 22} x2="560" y2={i * 46 + 22} />
          ))}
        </g>

        <g className="bp-shapes">
          <circle className="draw" pathLength={1} cx="46" cy="170" r="16" style={delay(at('start'))} />
          <rect className="draw" pathLength={1} x="96" y="142" width="118" height="56" rx="8" style={delay(at('receive'))} />
          <polygon className="draw" pathLength={1} points="270,144 296,170 270,196 244,170" style={delay(at('gate'))} />
          <path className="draw" pathLength={1} d="M262 162 278 178M278 162 262 178" style={delay(at('gate') + 0.2)} />
          <rect className="draw" pathLength={1} x="340" y="62" width="112" height="52" rx="8" style={delay(at('approve'))} />
          <rect className="draw" pathLength={1} x="340" y="226" width="112" height="52" rx="8" style={delay(at('escalate'))} />
          <circle className="draw end" pathLength={1} cx="512" cy="170" r="16" style={delay(at('end'))} />
        </g>

        <g className="bp-flows" style={{ color: 'currentColor' }}>
          <path className="draw" pathLength={1} d="M62 170H94" markerEnd={`url(#arrow-${variant})`} style={delay(flowAt(0))} />
          <path className="draw" pathLength={1} d="M214 170H242" markerEnd={`url(#arrow-${variant})`} style={delay(flowAt(1))} />
          <path className="draw" pathLength={1} d="M270 144V88H338" markerEnd={`url(#arrow-${variant})`} style={delay(flowAt(2))} />
          <path className="draw" pathLength={1} d="M270 196V252H338" markerEnd={`url(#arrow-${variant})`} style={delay(flowAt(2.3))} />
          <path className="draw" pathLength={1} d="M452 88H512V152" markerEnd={`url(#arrow-${variant})`} style={delay(flowAt(3.4))} />
          <path className="draw" pathLength={1} d="M452 252H512V188" markerEnd={`url(#arrow-${variant})`} style={delay(flowAt(4.4))} />
        </g>

        <g className="bp-text">
          <text className="fade" x="155" y="174" style={delay(at('receive') + 0.3)}>Receive invoice</text>
          <text className="fade small" x="270" y="132" style={delay(at('gate') + 0.3)}>under 5k?</text>
          <text className="fade small" x="290" y="80" style={delay(flowAt(2) + 0.3)}>yes</text>
          <text className="fade small" x="290" y="268" style={delay(flowAt(2.3) + 0.3)}>no</text>
          <text className="fade" x="396" y="92" style={delay(at('approve') + 0.3)}>Approve</text>
          <text className="fade" x="396" y="256" style={delay(at('escalate') + 0.3)}>Escalate</text>
        </g>

        {!gen && (
          <>
            <rect className="bp-scan" x="0" y="0" width="2" height="320" />
            <g className="bp-boxes">
              {(Object.keys(EL) as (keyof typeof EL)[]).map((k) => {
                const e = EL[k];
                const pad = 7;
                const label = `${e.kind} ${e.conf}`;
                const w = label.length * 6.1 + 10;
                // keep the tag inside the frame: right-align it on the right edge
                const tx = Math.min(e.x - pad, 556 - w);
                const ty = e.under ? e.y + e.h + pad : e.y - pad - 15;
                return (
                  <g key={k} className="bp-box" style={delay(boxAt(k))}>
                    <rect x={e.x - pad} y={e.y - pad} width={e.w + pad * 2} height={e.h + pad * 2} />
                    <rect className="tag" x={tx} y={ty} width={w} height="15" />
                    <text x={tx + 5} y={ty + 11}>
                      {label}
                    </text>
                  </g>
                );
              })}
            </g>
          </>
        )}
      </svg>

      <figcaption>
        <span>{caption}</span>
        <span className="bp-stamp" style={delay(gen ? t0 + 3.2 : SCAN + 0.6)}>
          {gen ? 'drawn in under 60 s' : '6 of 6 found'}
        </span>
      </figcaption>
    </figure>
  );
}
