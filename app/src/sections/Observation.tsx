import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Database, 
  Cpu, 
  Lock, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  Network, 
  Server, 
  Monitor,
  Layers
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface SystemNode {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ReactNode;
  x: number; // percentage X in viewBox
  y: number; // percentage Y in viewBox
  tech: string[];
  description: string;
  flowSteps: string[];
  safeguards: string;
  impact: string;
}

export default function Observation() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedNode, setSelectedNode] = useState<string>('client');
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Responsive layout check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Entrance scroll animation
  useEffect(() => {
    const currentSection = sectionRef.current;
    if (!currentSection) return;

    const revealEls = currentSection.querySelectorAll('.observation-reveal');

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: currentSection,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      });

      tl.fromTo(Array.from(revealEls),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.0, stagger: 0.15, ease: 'power3.out' }
      );

      tl.fromTo('.transform-dashboard',
        { opacity: 0, scale: 0.97, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
        },
        '-=0.6'
      );
    }, currentSection);

    return () => ctx.revert();
  }, []);

  const systemNodes: SystemNode[] = [
    {
      id: 'proxy',
      name: 'PROXY & GATEWAY',
      subtitle: 'Nginx TLS Router',
      icon: <Layers size={18} className="node-icon-inner" />,
      x: 12,    // 120 / 1000
      y: 21.7,  // 130 / 600
      tech: ['Nginx', 'TLS 1.3', 'HTTP/2 Cores', 'Reverse Proxy'],
      description: 'The secure inbound entry proxy handling TLS termination, cross-origin resource sharing (CORS) enforcement, and buffering SSE streaming packet lines.',
      flowSteps: [
        'Intercepts incoming client REST and Server-Sent Event (SSE) requests.',
        'Enforces secure CORS policies and rejects malformed host headers.',
        'Routes client traffic to available FastAPI ASGI worker runtimes.',
        'Buffers and streams raw SSE chunk lines with zero downstream buffering latency.'
      ],
      safeguards: 'Applies automated rate-limiting buckets per IP to prevent Denials of Service (DoS) and API extraction attempts.',
      impact: 'Provides a single, hardened entry point with high throughput capability for active client sessions.'
    },
    {
      id: 'client',
      name: 'CLIENT GATEWAY',
      subtitle: 'React SPA UI Layer',
      icon: <Monitor size={18} className="node-icon-inner" />,
      x: 38,    // 380 / 1000
      y: 21.7,  // 130 / 600
      tech: ['React 19', 'Vite', 'GSAP ScrollTrigger', 'ReadableStream API'],
      description: 'The front-end client layer executing session orchestration, demultiplexing event streams, and maintaining pessimistic concurrency checks.',
      flowSteps: [
        'Requests session lease activation via POST /api/transform/activate.',
        'Spawns a 5s heartbeat loop to refresh locks and prevent idle timeouts.',
        'Initiates chunked stream consumer at /adk-api/transform/stream.',
        'Decodes SSE text/event-stream lines (agent_thinking, function_request) to build the trace timeline.'
      ],
      safeguards: 'Automatically sends /deactivate lock release payload upon page unload or tab visibility shifts.',
      impact: 'Allows real-time transparency into nested subagent tool executions with zero loading screens.'
    },
    {
      id: 'lock',
      name: 'MUTEX LOCK MANAGER',
      subtitle: 'Distributed Lock State',
      icon: <Lock size={18} className="node-icon-inner" />,
      x: 38,    // 380 / 1000
      y: 75,    // 450 / 600
      tech: ['SQLAlchemy', 'Pessimistic Coordinator', 'Heartbeat Loop'],
      description: 'The concurrency protection service managing session soft-locks, preventing dual-user write operations on identical schema folders.',
      flowSteps: [
        'Checks lock status inside database metadata tables upon client entry.',
        'Allocates active locks dynamically, binding folders to specific user IDs.',
        'Monitors lock heartbeats, extending session scopes on valid updates.',
        'Releases Mutex holds instantly upon deactivation or heartbeats failure.'
      ],
      safeguards: 'Auto-expires orphaned locks after 15s of heartbeat loss to prevent permanent workspace lockdowns.',
      impact: 'Guarantees 100% collision-free session collaboration for multiple developers working on adjacent datasets.'
    },
    {
      id: 'backend',
      name: 'SERVICE GATEWAY',
      subtitle: 'FastAPI REST / SSE Gateway',
      icon: <Server size={18} className="node-icon-inner" />,
      x: 64,    // 640 / 1000
      y: 21.7,  // 130 / 600
      tech: ['FastAPI', 'Python 3.13', 'SQLAlchemy', 'Gemini Embedding API'],
      description: 'The central REST routing engine managing endpoint validation, vector-RAG preprocessing, and launching asynchronous agent runners.',
      flowSteps: [
        'Verifies concurrency lock validity via the Mutex Lock Manager.',
        'Embeds incoming user instructions via Gemini Vector Embedding API.',
        'Queries pgvector for relevant context chunks matching prompt semantics.',
        'Initializes the multi-agent runner, spawning production events into the SSE queue.'
      ],
      safeguards: 'Enforces strict payload bounds, validating incoming schemas using Pydantic baseline entities.',
      impact: 'Asynchronously routes requests without thread blocking, ensuring quick response times under loads.'
    },
    {
      id: 'orchestrator',
      name: 'COGNITIVE SYSTEM',
      subtitle: 'Google ADK Orchestrator',
      icon: <Cpu size={18} className="node-icon-inner" />,
      x: 64,    // 640 / 1000
      y: 75,    // 450 / 600
      tech: ['Google ADK', 'Gemini Pro', 'Langfuse Telemetry'],
      description: 'The supervisor-worker agent executor mapping instructions into Directed Acyclic Graphs (DAG) and tracing logic across subagents.',
      flowSteps: [
        'Decomposes instructions into target subagent plans (Analysis / DataOps).',
        'Injects retrieved RAG vector context blocks into the initial LLM session.',
        'Orchestrates subagent execution loops via a custom ContextVar queue.',
        'Forwards trace spans, latencies, and token usage statistics to Langfuse APM.'
      ],
      safeguards: 'Applies rigid execution steps limits and loops detection to block runaway costs.',
      impact: 'Coordinates specialized subagent teams to perform complex data actions with auto-refinement loops.'
    },
    {
      id: 'mcp',
      name: 'ISOLATION GUARD',
      subtitle: 'postgres_mcp4tables Server',
      icon: <ShieldAlert size={18} className="node-icon-inner" />,
      x: 88,    // 880 / 1000
      y: 75,    // 450 / 600
      tech: ['Model Context Protocol', 'SQL Regex Parser', 'Schema Allowlist'],
      description: 'The local stdio-based MCP query sanitizer acting as an AST/Regex firewall between subagents and the database schema layer.',
      flowSteps: [
        'Intercepts agent execute_sql commands over private stdio JSON-RPC.',
        'Parses target SQL strings using regex queries to identify target relations.',
        'Ensures query targets reside exclusively inside session tables allowlists.',
        'Injects default LIMIT limits and schema qualifiers (uploads_schema) automatically.'
      ],
      safeguards: 'Halts operations accessing system schemas (pg_catalog) and blocks shell commands.',
      impact: 'Secures database schemas against SQL/prompt injections and stops cross-tenant data leakage.'
    },
    {
      id: 'database',
      name: 'DATA VAULT',
      subtitle: 'PostgreSQL Relational DB',
      icon: <Database size={18} className="node-icon-inner" />,
      x: 88,    // 880 / 1000
      y: 21.7,  // 130 / 600
      tech: ['PostgreSQL 16', 'pgvector', 'Dual Schema Layout'],
      description: 'The multi-tenant database engine partitioning platform logs (app_schema) from dynamically generated user datasets (uploads_schema).',
      flowSteps: [
        'Persists platform lock states and file structures inside app_schema relations.',
        'Generates isolated dynamic schemas inside uploads_schema for tenant datasets.',
        'Executes pgvector cosine calculations (<=>) for embedding retrieval.',
        'Processes operations inside ACID transaction units, executing instant rollbacks on failures.'
      ],
      safeguards: 'Applies connection-pool validation limits and isolates write permissions strictly to the active schema.',
      impact: 'Maintains absolute transactional durability, ensuring dynamic cleaning operations never corrupt base data.'
    }
  ];

  const activeNode = systemNodes.find(n => n.id === selectedNode) || systemNodes[0];

  // Helper helper to render icons
  const renderIcon = (id: string) => {
    switch (id) {
      case 'proxy': return <Layers size={20} />;
      case 'client': return <Monitor size={20} />;
      case 'lock': return <Lock size={20} />;
      case 'backend': return <Server size={20} />;
      case 'orchestrator': return <Cpu size={20} />;
      case 'mcp': return <ShieldAlert size={20} />;
      case 'database': return <Database size={20} />;
      default: return <Database size={20} />;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="luxury-section luxury-section-dark"
      style={{
        paddingTop: '100px',
        paddingBottom: '100px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
        <p className="luxury-eyebrow observation-reveal" style={{ margin: 0, marginBottom: '20px' }}>
          SYSTEM DESIGN · PLATFORM ARCHITECTURE
        </p>
        <h2 className="section-headline observation-reveal" style={{ margin: 0, fontSize: '3.2rem', marginBottom: '50px' }}>
          TRANSFORMER BLUEPRINT
        </h2>

        <div
          className="transform-dashboard"
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1.4fr) minmax(0, 1fr)',
            gap: '40px',
            background: 'rgba(255, 255, 255, 0.01)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: isMobile ? '20px' : '40px',
            boxShadow: '0 30px 70px rgba(0, 0, 0, 0.4)',
          }}
        >
          {/* Left Column: Visual Architecture Diagram */}
          <div
            style={{
              position: 'relative',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '0px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minHeight: isMobile ? 'auto' : '560px',
              overflow: 'hidden',
            }}
          >
            <div style={{ 
              marginBottom: '20px', 
              fontFamily: "'IBM Plex Mono', monospace", 
              fontSize: '0.65rem', 
              letterSpacing: '0.15em', 
              color: 'rgba(255, 255, 255, 0.4)', 
              textTransform: 'uppercase' 
            }}>
              Interactive Architecture Topology
            </div>

            {isMobile ? (
              // Mobile View: Simplified vertical sequence
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {systemNodes.map((node) => {
                  const isSelected = selectedNode === node.id;
                  return (
                    <button
                      key={node.id}
                      onClick={() => setSelectedNode(node.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        background: isSelected ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
                        border: `1px solid ${isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.1)'}`,
                        padding: '16px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        width: '100%',
                      }}
                    >
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          border: `1px solid ${isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.2)'}`,
                          background: isSelected ? '#ffffff' : 'transparent',
                          color: isSelected ? '#000000' : '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.3s ease',
                          flexShrink: 0,
                        }}
                      >
                        {renderIcon(node.id)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontFamily: "'IBM Plex Mono', monospace", 
                          fontSize: '0.8rem', 
                          fontWeight: 500, 
                          color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                          letterSpacing: '0.05em'
                        }}>
                          {node.name}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.4)' }}>
                          {node.subtitle}
                        </div>
                      </div>
                      {isSelected && <ArrowRight size={14} style={{ color: '#ffffff' }} />}
                    </button>
                  );
                })}
              </div>
            ) : (
              // Desktop View: Responsive absolute coordinate map + animated SVG connections
              <div 
                style={{ 
                  position: 'relative', 
                  width: '100%', 
                  aspectRatio: '1000 / 600', 
                  margin: 'auto 0' 
                }}
              >
                {/* SVG Connections Layer */}
                <svg
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                  viewBox="0 0 1000 600"
                >
                  {/* Connection 1: Proxy -> Client */}
                  <path
                    d="M 120 130 L 380 130"
                    className={
                      (selectedNode === 'proxy' || selectedNode === 'client')
                        ? 'flow-line-active'
                        : 'flow-line'
                    }
                  />

                  {/* Connection 2: Client -> Backend */}
                  <path
                    d="M 380 130 L 640 130"
                    className={
                      (selectedNode === 'client' || selectedNode === 'backend')
                        ? 'flow-line-active'
                        : 'flow-line'
                    }
                  />

                  {/* Connection 3: Client -> Lock Coordinator */}
                  <path
                    d="M 380 130 L 380 450"
                    className={
                      (selectedNode === 'client' || selectedNode === 'lock')
                        ? 'flow-line-active'
                        : 'flow-line'
                    }
                  />

                  {/* Connection 4: Backend -> Database */}
                  <path
                    d="M 640 130 L 880 130"
                    className={
                      (selectedNode === 'backend' || selectedNode === 'database')
                        ? 'flow-line-active'
                        : 'flow-line'
                    }
                  />

                  {/* Connection 5: Backend -> Cognitive System */}
                  <path
                    d="M 640 130 L 640 450"
                    className={
                      (selectedNode === 'backend' || selectedNode === 'orchestrator')
                        ? 'flow-line-active'
                        : 'flow-line'
                    }
                  />

                  {/* Connection 6: Cognitive System -> Isolation Guard */}
                  <path
                    d="M 640 450 L 880 450"
                    className={
                      (selectedNode === 'orchestrator' || selectedNode === 'mcp')
                        ? 'flow-line-active'
                        : 'flow-line'
                    }
                  />

                  {/* Connection 7: Isolation Guard -> Database */}
                  <path
                    d="M 880 450 L 880 130"
                    className={
                      (selectedNode === 'mcp' || selectedNode === 'database')
                        ? 'flow-line-active'
                        : 'flow-line'
                    }
                  />
                </svg>

                {/* Node Cards */}
                {systemNodes.map((node) => {
                  const isSelected = selectedNode === node.id;
                  return (
                    <button
                      key={node.id}
                      onClick={() => setSelectedNode(node.id)}
                      style={{
                        position: 'absolute',
                        left: `${node.x}%`,
                        top: `${node.y}%`,
                        transform: 'translate(-50%, -50%)',
                        width: '160px',
                        height: '90px',
                        background: '#000000',
                        border: `1px solid ${isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.15)'}`,
                        boxShadow: isSelected ? '0 0 25px rgba(255, 255, 255, 0.2)' : 'none',
                        zIndex: 10,
                        padding: '12px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <div
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            background: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.05)',
                            border: `1px solid ${isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.15)'}`,
                            color: isSelected ? '#000000' : '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                          }}
                        >
                          {node.icon}
                        </div>
                        {isSelected && (
                          <span style={{ 
                            width: '5px', 
                            height: '5px', 
                            borderRadius: '50%', 
                            backgroundColor: '#ffffff',
                            boxShadow: '0 0 8px #ffffff'
                          }} />
                        )}
                      </div>
                      
                      <div>
                        <div style={{ 
                          fontFamily: "'IBM Plex Mono', monospace", 
                          fontSize: '0.65rem', 
                          fontWeight: 600, 
                          color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
                          letterSpacing: '0.05em' 
                        }}>
                          {node.name}
                        </div>
                        <div style={{ 
                          fontSize: '0.55rem', 
                          color: isSelected ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.35)', 
                          marginTop: '2px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {node.subtitle}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Spec Panel */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '24px',
              background: 'rgba(255, 255, 255, 0.01)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '30px',
            }}
          >
            {/* Header */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '0.7rem',
                    color: 'rgba(255, 255, 255, 0.45)',
                    letterSpacing: '0.2em',
                  }}
                >
                  SYSTEM LAYER SPECIFICATION
                </span>
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '0.65rem',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    padding: '2px 8px',
                    letterSpacing: '0.1em',
                  }}
                >
                  STABLE
                </span>
              </div>
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '2.2rem',
                  fontWeight: 300,
                  color: '#ffffff',
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                {activeNode.name}
              </h3>
              <p
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '0.8rem',
                  letterSpacing: '0.05em',
                  color: 'rgba(255, 255, 255, 0.6)',
                  margin: '4px 0 0 0',
                }}
              >
                {activeNode.subtitle}
              </p>
            </div>

            {/* Description */}
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.9rem',
                lineHeight: 1.7,
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0,
              }}
            >
              {activeNode.description}
            </p>

            {/* Technologies Used */}
            <div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.15em', color: 'rgba(255, 255, 255, 0.4)', marginBottom: '10px' }}>
                INTEGRATED STACK
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {activeNode.tech.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '0.65rem',
                      letterSpacing: '0.05em',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      padding: '4px 10px',
                      color: '#ffffff',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Flow Steps */}
            <div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.15em', color: 'rgba(255, 255, 255, 0.4)', marginBottom: '12px' }}>
                DATA FLOW STEPS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeNode.flowSteps.map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ 
                      fontFamily: "'IBM Plex Mono', monospace", 
                      fontSize: '0.65rem', 
                      color: 'rgba(255, 255, 255, 0.3)',
                      marginTop: '3px'
                    }}>
                      {idx + 1}.
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.5 }}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Safeguards */}
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Lock size={12} style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.15em', color: 'rgba(255, 255, 255, 0.4)' }}>
                  ARCHITECTURAL SAFEGUARDS
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.5, margin: 0 }}>
                {activeNode.safeguards}
              </p>
            </div>

            {/* User Impact */}
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <CheckCircle2 size={12} style={{ color: '#ffffff' }} />
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.15em', color: '#ffffff', fontWeight: 500 }}>
                  SYSTEM DESIGN IMPACT
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.5, margin: 0 }}>
                {activeNode.impact}
              </p>
            </div>
          </div>
        </div>

        {/* Global Architecture Metrics */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '30px',
            marginTop: '40px',
          }}
        >
          {[
            {
              title: 'DISTRIBUTED MUTEX',
              stat: '100% MUTUAL EXCLUSION',
              desc: 'SOFT-LOCK Heartbeat system handles workspace coordination, ensuring multiple users never execute concurrent mutations.',
              icon: <Lock size={16} />
            },
            {
              title: 'QUERY BOUNDARY GUARD',
              stat: 'ALLOWLIST ENFORCEMENT',
              desc: 'postgres_mcp4tables parses tool SQL code with regex match patterns to prevent cross-tenant database leakage.',
              icon: <ShieldAlert size={16} />
            },
            {
              title: 'TELEMETRY OBSERVABILITY',
              stat: 'LANGFUSE TRACING',
              desc: 'Instruments agent execution nodes to stream latency profiles, prompt structures, and evaluation metrics.',
              icon: <Network size={16} />
            }
          ].map((m) => (
            <div
              key={m.title}
              style={{
                background: 'rgba(255, 255, 255, 0.01)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '24px 30px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255, 255, 255, 0.45)' }}>
                {m.icon}
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.15em' }}>
                  {m.title}
                </span>
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', color: '#ffffff', fontWeight: 300, letterSpacing: '0.02em' }}>
                {m.stat}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)', lineHeight: 1.6, margin: 0 }}>
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Embedded CSS Animations for the connection paths */}
      <style>{`
        @keyframes flow-animation {
          from {
            stroke-dashoffset: 20;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        .flow-line {
          stroke: rgba(255, 255, 255, 0.15);
          stroke-width: 1.5;
          stroke-dasharray: 4 6;
          animation: flow-animation 1.5s linear infinite;
          transition: stroke 0.3s ease, stroke-width 0.3s ease;
        }
        .flow-line-active {
          stroke: #ffffff;
          stroke-width: 2.5;
          stroke-dasharray: 6 4;
          animation: flow-animation 0.8s linear infinite;
          filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.8));
          transition: stroke 0.3s ease, stroke-width 0.3s ease;
        }
        .node-icon-inner {
          transition: transform 0.3s ease;
        }
        button:hover .node-icon-inner {
          transform: scale(1.1);
        }
      `}</style>
    </section>
  );
}
