import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SkillItem {
  name: string;
  level: number;
  exp: string;
}

interface SkillCategory {
  id: string;
  name: string;
  description: string;
  skills: SkillItem[];
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'agentic',
    name: 'AGENTIC AI',
    description: 'Autonomous multi-agent orchestration, LLM pipelines, and cognitive architectures.',
    skills: [
      { name: 'Multi-Agent Orchestration (Langgraph, CrewAI, AutoGen)', level: 95, exp: '2+ years' },
      { name: 'LLM Fine-tuning & Optimization (LoRA, PEFT)', level: 88, exp: '1.5 years' },
      { name: 'RAG Systems & Vector Databases (Pinecone, pgvector)', level: 92, exp: '2 years' },
      { name: 'LLM APIs & Prompt Engineering (GPT-4, Gemini)', level: 98, exp: '2.5 years' },
      { name: 'Autonomous Tool Use / MCP Server Development', level: 90, exp: '1.5 years' },
    ]
  },
  {
    id: 'backend',
    name: 'CORE BACKEND',
    description: 'Scalable API architectures, high-performance database design, and asynchronous computing.',
    skills: [
      { name: 'Python (FastAPI, Flask, Django)', level: 96, exp: '3+ years' },
      { name: 'Database Management (PostgreSQL, Redis, MongoDB)', level: 90, exp: '2+ years' },
      { name: 'API Design & Microservices Architecture', level: 92, exp: '2+ years' },
      { name: 'Asynchronous Workflows (Celery, RabbitMQ)', level: 85, exp: '1.5 years' },
      { name: 'OpenTelemetry & Observability (Langfuse, Datadog)', level: 88, exp: '2 years' },
    ]
  },
  {
    id: 'frontend',
    name: 'FRONTEND & UI/UX',
    description: 'Dynamic user interfaces, responsive layouts, and rich modern typography.',
    skills: [
      { name: 'React.js & Next.js Development', level: 90, exp: '2+ years' },
      { name: 'TypeScript & Modern ES6+ JavaScript', level: 92, exp: '2.5 years' },
      { name: 'Tailwind CSS & Modern CSS Layouts', level: 95, exp: '3 years' },
      { name: 'GSAP Animation & Micro-interactions', level: 85, exp: '1.5 years' },
    ]
  },
  {
    id: 'devops',
    name: 'CLOUD & DEVOPS',
    description: 'Infrastructure automation, CI/CD pipelines, container orchestration, and telemetry.',
    skills: [
      { name: 'Docker Containerization & Local Development', level: 92, exp: '2.5 years' },
      { name: 'CI/CD Pipelines (GitHub Actions, GitLab CI)', level: 88, exp: '2 years' },
      { name: 'Cloud Infrastructure (AWS, GCP, Vercel)', level: 85, exp: '1.5 years' },
      { name: 'Serverless Architectures & Edge Functions', level: 80, exp: '1 year' },
    ]
  }
];

export default function Archives() {
  const [activeTab, setActiveTab] = useState('agentic');
  const sectionRef = useRef<HTMLElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!barsRef.current) return;
    
    const bars = barsRef.current.querySelectorAll('.proficiency-bar-fill');
    const values = barsRef.current.querySelectorAll('.proficiency-value');

    // Reset styles
    gsap.set(bars, { width: '0%' });
    gsap.set(values, { opacity: 0, y: 5 });

    // Animate in
    gsap.to(bars, {
      width: (_, target) => target.getAttribute('data-level') + '%',
      duration: 1.4,
      stagger: 0.1,
      ease: 'power4.out',
    });

    gsap.to(values, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out',
      delay: 0.3
    });
  }, [activeTab]);

  useEffect(() => {
    const currentSection = sectionRef.current;
    if (!currentSection) return;

    const revealEls = currentSection.querySelectorAll('.skills-reveal');

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

      tl.fromTo('.skills-container',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
        },
        '-=0.6'
      );
    }, currentSection);

    return () => ctx.revert();
  }, []);

  const activeCategory = SKILL_CATEGORIES.find(c => c.id === activeTab) || SKILL_CATEGORIES[0];

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="luxury-section luxury-section-dark"
      style={{
        paddingTop: '100px',
        paddingBottom: '100px',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <p className="luxury-eyebrow skills-reveal" style={{ margin: 0, marginBottom: '20px' }}>
          SKILLS & PROFICIENCY
        </p>
        <h2 className="section-headline skills-reveal" style={{ margin: 0, fontSize: '3.2rem', marginBottom: '50px' }}>
          ENGINEERED CAPABILITIES
        </h2>

        <div
          className="skills-container"
          style={{
            display: 'grid',
            gridTemplateColumns: '320px 1fr',
            gap: '60px',
            background: 'rgba(255, 255, 255, 0.01)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '50px',
            boxShadow: '0 30px 70px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Sidebar Tabs */}
          <div
            className="skills-tabs-list"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              borderRight: '1px solid rgba(255, 255, 255, 0.08)',
              paddingRight: '32px',
            }}
          >
            {SKILL_CATEGORIES.map((category) => {
              const isActive = activeTab === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '0.75rem',
                    fontWeight: isActive ? 500 : 400,
                    textTransform: 'uppercase',
                    color: isActive ? '#000000' : 'rgba(255, 255, 255, 0.45)',
                    background: isActive ? '#ffffff' : 'transparent',
                    border: '1px solid ' + (isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.1)'),
                    padding: '16px 20px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    letterSpacing: '0.15em',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.45)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    }
                  }}
                >
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>

          {/* Proficiency Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <div>
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '2rem',
                  fontWeight: 300,
                  color: '#ffffff',
                  margin: '0 0 10px 0',
                  letterSpacing: '0.02em',
                }}
              >
                {activeCategory.name}
              </h3>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.95rem',
                  fontWeight: 300,
                  lineHeight: 1.8,
                  color: 'rgba(255, 255, 255, 0.65)',
                  margin: 0,
                  maxWidth: '700px',
                }}
              >
                {activeCategory.description}
              </p>
            </div>

            <div
              ref={barsRef}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '28px',
              }}
            >
              {activeCategory.skills.map((skill) => (
                <div key={skill.name} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '0.75rem',
                      letterSpacing: '0.05em',
                    }}
                  >
                    <span style={{ color: '#ffffff', fontWeight: 300 }}>{skill.name}</span>
                    <div style={{ display: 'flex', gap: '20px', color: 'rgba(255, 255, 255, 0.45)' }}>
                      <span>EXP: {skill.exp}</span>
                      <span className="proficiency-value" style={{ color: '#ffffff', fontWeight: 500 }}>
                        {skill.level}%
                      </span>
                    </div>
                  </div>

                  {/* Outer Bar */}
                  <div
                    style={{
                      width: '100%',
                      height: '6px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Glowing Filled Bar */}
                    <div
                      className="proficiency-bar-fill"
                      data-level={skill.level}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: '0%', // Animated dynamically via GSAP
                        background: '#ffffff',
                        boxShadow: '0 0 8px rgba(255, 255, 255, 0.15)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .skills-container {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
            padding: 24px !important;
          }
          .skills-tabs-list {
            flex-direction: row !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
            padding-right: 0 !important;
            padding-bottom: 24px !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .skills-tabs-list::-webkit-scrollbar {
            display: none;
          }
          .skills-tabs-list button {
            flex-shrink: 0;
            width: auto !important;
            white-space: nowrap;
          }
        }
      `}</style>
    </section>
  );
}
