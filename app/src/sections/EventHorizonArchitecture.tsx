import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Database,
  Layers,
  Lock,
  Monitor,
  Network,
  Server,
  ShieldAlert,
} from 'lucide-react';
import './event-horizon-architecture.css';

gsap.registerPlugin(ScrollTrigger);

interface ArchitectureNode {
  id: string;
  name: string;
  subtitle: string;
  icon: ReactNode;
  x: number;
  y: number;
  tech: string[];
  description: string;
  flowSteps: string[];
  safeguard: string;
  outcome: string;
}

interface Connection {
  from: string;
  to: string;
  path: string;
}

const nodes: ArchitectureNode[] = [
  {
    id: 'workspace',
    name: 'WEB WORKSPACE',
    subtitle: 'Prepare · Visualize · Publish',
    icon: <Monitor size={19} />,
    x: 12,
    y: 21,
    tech: ['React', 'Vite', 'SSE', 'Typed workspace state'],
    description: 'One project workspace guides a dataset from upload and preparation through grounded dashboards and publishable reports.',
    flowSteps: [
      'Creates a project, folder, file, and isolated chat session.',
      'Routes each request to Prepare, Visualize, or Publish mode.',
      'Consumes streamed reasoning, tool, answer, and artifact events.',
      'Lets the user review prepared tables, chart previews, and report drafts.',
    ],
    safeguard: 'The browser never supplies trusted identity or database scope; the server injects user, folder, and session context.',
    outcome: 'A single conversational workflow replaces disconnected spreadsheet, charting, and reporting tools.',
  },
  {
    id: 'edge',
    name: 'SECURE EDGE',
    subtitle: 'Caddy · TLS · Reverse Proxy',
    icon: <Layers size={19} />,
    x: 38,
    y: 21,
    tech: ['Caddy', 'TLS', 'REST proxy', 'SSE proxy'],
    description: 'The public production edge serves the application and routes API and streaming traffic to private services on the GCP VM.',
    flowSteps: [
      'Terminates HTTPS for the deployed Event Horizon domain.',
      'Serves the built web application.',
      'Proxies REST traffic to the FastAPI backend.',
      'Keeps streaming connections open for agent events.',
    ],
    safeguard: 'Only the edge is public; backend, agent, and database services remain private inside the Docker network.',
    outcome: 'Users get one secure URL while the service boundary stays hidden and controlled.',
  },
  {
    id: 'api',
    name: 'CORE API',
    subtitle: 'FastAPI Control Plane',
    icon: <Server size={19} />,
    x: 64,
    y: 21,
    tech: ['FastAPI', 'Pydantic', 'RBAC', 'Streaming APIs'],
    description: 'The control plane owns authentication, projects, folders, files, sessions, dashboards, and the handoff into the agent runtime.',
    flowSteps: [
      'Authenticates the request and resolves membership permissions.',
      'Loads the current project, folder, file, and session scope.',
      'Validates writes before changing canonical workspace state.',
      'Streams agent events and artifact updates back to the client.',
    ],
    safeguard: 'Role checks, validated payloads, quotas, and server-injected context guard every request boundary.',
    outcome: 'All product surfaces share one authoritative access and state model.',
  },
  {
    id: 'store',
    name: 'WORKSPACE STORE',
    subtitle: 'PostgreSQL · Persistent Disk',
    icon: <Database size={19} />,
    x: 88,
    y: 21,
    tech: ['PostgreSQL', 'Transactions', 'Folder schemas', 'Artifact metadata'],
    description: 'PostgreSQL keeps canonical workspace records and folder-scoped data, while generated artifacts persist on the attached production disk.',
    flowSteps: [
      'Stores users, memberships, projects, folders, files, and sessions.',
      'Maps uploaded and prepared tables to their owning folder.',
      'Persists chart and report metadata against the active session.',
      'Commits validated changes transactionally and records audit context.',
    ],
    safeguard: 'Folder access checks, scoped identifiers, transactions, and isolated physical tables prevent cross-tenant access.',
    outcome: 'Every answer and artifact can be traced back to durable workspace state.',
  },
  {
    id: 'outputs',
    name: 'GROUNDED OUTPUTS',
    subtitle: 'Tables · Charts · Reports',
    icon: <Network size={19} />,
    x: 38,
    y: 76,
    tech: ['Prepared tables', 'ChartSpec', 'PDF', 'HTML', 'DOCX', 'PPTX'],
    description: 'Tool results become reviewable product artifacts: a prepared table, evidence-backed charts and KPIs, and report drafts ready for export.',
    flowSteps: [
      'Prepare creates one validated table without mutating uploaded sources.',
      'Visualize produces grounded chart and KPI previews from that table.',
      'Users explicitly persist the dashboard artifacts they approve.',
      'Publish composes report sections and validated export context.',
    ],
    safeguard: 'Artifacts carry folder, session, selected-table, and transform-revision context so stale evidence can be rejected.',
    outcome: 'The final deliverable stays connected to the exact data and tool evidence used to create it.',
  },
  {
    id: 'runtime',
    name: 'AGENT SERVICE',
    subtitle: 'FastAPI Stream Â· LangGraph',
    icon: <Cpu size={19} />,
    x: 64,
    y: 76,
    tech: ['FastAPI', 'LangGraph', 'Typed state', 'SSE events'],
    description: 'A single LangGraph workflow carries shared typed state through guards, context loading, routing, a bounded tool loop, and grounded finalization.',
    flowSteps: [
      'Runs input guard, context loader, intent router, data agent, tool executor, and finalizer nodes.',
      'Selects the system prompt and tools for the active workspace surface.',
      'Streams thinking, function requests, tool results, and artifacts.',
      'Stops after bounded LLM-to-tool round trips and answers from gathered evidence.',
    ],
    safeguard: 'Loop caps, grounding requirements, and a no-fabrication prompt block runaway execution and unsupported claims.',
    outcome: 'One inspectable graph supports three product modes without pretending MCP is another agent.',
  },
  {
    id: 'tools',
    name: 'TOOL BOUNDARY',
    subtitle: 'Surface-Scoped Registry',
    icon: <ShieldAlert size={19} />,
    x: 88,
    y: 76,
    tech: ['In-process tools', 'MCP-compatible', 'SELECT-only reads', 'Row caps'],
    description: 'The shared registry exposes only the tools allowed for Prepare, Visualize, or Publish, with the agent using the low-latency in-process provider.',
    flowSteps: [
      'Injects the active user, folder, session, and selected table.',
      'Filters tool schemas by the current surface before the LLM sees them.',
      'Validates transformation plans and constrains analytical SQL.',
      'Returns structured evidence and artifact events to LangGraph.',
    ],
    safeguard: 'Single-SELECT enforcement, folder scoping, statement timeouts, row caps, and access audits constrain every data operation.',
    outcome: 'The model can choose useful actions, but deterministic code defines what those actions are allowed to do.',
  },
];

const connections: Connection[] = [
  { from: 'workspace', to: 'edge', path: 'M 120 130 L 380 130' },
  { from: 'edge', to: 'api', path: 'M 380 130 L 640 130' },
  { from: 'api', to: 'store', path: 'M 640 130 L 880 130' },
  { from: 'api', to: 'runtime', path: 'M 640 130 L 640 470' },
  { from: 'runtime', to: 'tools', path: 'M 640 470 L 880 470' },
  { from: 'tools', to: 'store', path: 'M 880 470 L 880 130' },
  { from: 'runtime', to: 'outputs', path: 'M 640 470 L 380 470' },
  { from: 'outputs', to: 'workspace', path: 'M 380 470 L 120 470 L 120 130' },
];

const metrics = [
  {
    icon: <Cpu size={16} />,
    title: 'ONE AGENT GRAPH',
    value: 'BOUNDED TOOL LOOP',
    description: 'Shared state moves through deterministic guards, context loading, an LLM-selected tool loop, and grounded finalization.',
  },
  {
    icon: <Lock size={16} />,
    title: 'TENANT BOUNDARIES',
    value: 'USER · FOLDER · SESSION',
    description: 'Identity and workspace context are injected server-side and checked again at the data and artifact boundaries.',
  },
  {
    icon: <CheckCircle2 size={16} />,
    title: 'GROUNDED DELIVERY',
    value: 'TABLES · CHARTS · REPORTS',
    description: 'Prepared data, visual analysis, and publishable reports remain tied to real tool evidence and transform revisions.',
  },
];

export default function EventHorizonArchitecture() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedNode, setSelectedNode] = useState('workspace');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1024px)');
    const sync = () => setIsMobile(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 78%',
          toggleActions: 'play none none reverse',
        },
      });

      timeline
        .fromTo('.eh-reveal', { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' })
        .fromTo('.eh-dashboard', { opacity: 0, y: 38, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'power3.out' }, '-=0.5');
    }, section);

    return () => context.revert();
  }, []);

  const activeNode = nodes.find((node) => node.id === selectedNode) ?? nodes[0];

  return (
    <section ref={sectionRef} id="architecture" className="luxury-section luxury-section-dark eh-section">
      <div className="eh-shell">
        <div className="eh-heading-row">
          <div>
            <p className="luxury-eyebrow eh-reveal eh-eyebrow">EVENT HORIZON · LIVE ON GCP</p>
            <h2 className="section-headline eh-reveal eh-title">SYSTEM BLUEPRINT</h2>
          </div>
          <div className="eh-actions eh-reveal">
            <a className="luxury-btn luxury-btn-primary" href="https://eventhorizon-35-223-47-158.sslip.io" target="_blank" rel="noopener noreferrer">
              OPEN LIVE APP <ArrowRight size={13} />
            </a>
            <a className="luxury-btn" href="https://github.com/Kk12suthar/Event-horizon" target="_blank" rel="noopener noreferrer">
              VIEW CODE <ArrowRight size={13} />
            </a>
          </div>
        </div>

        <p className="eh-intro eh-reveal">
          A production data workspace where one typed LangGraph flow coordinates surface-scoped tools across Prepare, Visualize, and Publish—without breaking user, folder, or session boundaries.
        </p>

        <div className="eh-dashboard">
          <div className="eh-topology-panel">
            <div className="eh-panel-label">
              <span>INTERACTIVE PRODUCTION TOPOLOGY</span>
              <span className="eh-live-indicator"><i /> VERIFIED LIVE</span>
            </div>

            {isMobile ? (
              <div className="eh-mobile-nodes">
                {nodes.map((node, index) => {
                  const selected = node.id === selectedNode;
                  return (
                    <button key={node.id} className={`eh-mobile-node${selected ? ' is-selected' : ''}`} onClick={() => setSelectedNode(node.id)}>
                      <span className="eh-mobile-index">0{index + 1}</span>
                      <span className="eh-node-icon">{node.icon}</span>
                      <span className="eh-mobile-copy">
                        <strong>{node.name}</strong>
                        <small>{node.subtitle}</small>
                      </span>
                      {selected && <ArrowRight size={14} />}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="eh-map">
                <svg className="eh-connections" viewBox="0 0 1000 600" aria-hidden="true">
                  {connections.map((connection) => {
                    const active = connection.from === selectedNode || connection.to === selectedNode;
                    return <path key={`${connection.from}-${connection.to}`} d={connection.path} className={active ? 'eh-flow-line is-active' : 'eh-flow-line'} />;
                  })}
                </svg>

                {nodes.map((node, index) => {
                  const selected = node.id === selectedNode;
                  return (
                    <button
                      key={node.id}
                      className={`eh-map-node${selected ? ' is-selected' : ''}`}
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                      onClick={() => setSelectedNode(node.id)}
                    >
                      <span className="eh-node-topline">
                        <span className="eh-node-icon">{node.icon}</span>
                        <span className="eh-node-number">0{index + 1}</span>
                      </span>
                      <span className="eh-node-name">{node.name}</span>
                      <span className="eh-node-subtitle">{node.subtitle}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <aside className="eh-spec-panel" aria-live="polite">
            <div className="eh-spec-kicker">
              <span>SYSTEM LAYER SPECIFICATION</span>
              <span className="eh-status">ACTIVE</span>
            </div>
            <div>
              <h3>{activeNode.name}</h3>
              <p className="eh-spec-subtitle">{activeNode.subtitle}</p>
            </div>
            <p className="eh-description">{activeNode.description}</p>

            <div>
              <p className="eh-label">INTEGRATED STACK</p>
              <div className="eh-tech-list">
                {activeNode.tech.map((item) => <span key={item}>{item}</span>)}
              </div>
            </div>

            <div>
              <p className="eh-label">RUNTIME FLOW</p>
              <ol className="eh-steps">
                {activeNode.flowSteps.map((step) => <li key={step}>{step}</li>)}
              </ol>
            </div>

            <div className="eh-note">
              <span><Lock size={12} /> ARCHITECTURAL SAFEGUARD</span>
              <p>{activeNode.safeguard}</p>
            </div>
            <div className="eh-note eh-note-emphasis">
              <span><CheckCircle2 size={12} /> SYSTEM OUTCOME</span>
              <p>{activeNode.outcome}</p>
            </div>
          </aside>
        </div>

        <div className="eh-metrics">
          {metrics.map((metric) => (
            <article key={metric.title}>
              <div className="eh-metric-label">{metric.icon}<span>{metric.title}</span></div>
              <h3>{metric.value}</h3>
              <p>{metric.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
