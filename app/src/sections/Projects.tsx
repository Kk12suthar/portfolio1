import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Database, FileText, Monitor, Network, Server } from 'lucide-react';
import { portfolioProjects } from '../config';
import './projects.css';

gsap.registerPlugin(ScrollTrigger);

function EventHorizonVisual() {
  return (
    <div className="project-system-visual" aria-hidden="true">
      <div className="project-system-grid" />
      <span className="project-system-line line-a" />
      <span className="project-system-line line-b" />
      <span className="project-system-line line-c" />
      <span className="project-system-node node-a"><Monitor size={18} /><small>WORKSPACE</small></span>
      <span className="project-system-node node-b"><Server size={18} /><small>LANGGRAPH</small></span>
      <span className="project-system-node node-c"><Database size={18} /><small>TOOLS + DATA</small></span>
      <span className="project-system-node node-d"><FileText size={18} /><small>ARTIFACTS</small></span>
      <span className="project-system-caption"><Network size={13} /> PREPARE → VISUALIZE → PUBLISH</span>
    </div>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll('.project-reveal'),
        { opacity: 0, y: 34 },
        {
          opacity: 1,
          y: 0,
          duration: 0.95,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 78%', toggleActions: 'play none none reverse' },
        },
      );
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="luxury-section luxury-section-light projects-section">
      <div className="projects-shell">
        <p className="luxury-eyebrow project-reveal projects-eyebrow">WHAT I HAVE BUILT</p>
        <div className="projects-heading-row project-reveal">
          <h2 className="section-headline projects-title">AGENTIC SYSTEMS IN PRODUCTION</h2>
          <p>Two distinct platforms: Event Horizon for a complete data-to-report workspace, and Transformer for Google ADK orchestration with RAG-grounded transformation.</p>
        </div>

        <div className="projects-grid">
          {portfolioProjects.map((project) => (
            <article key={project.slug} className="project-card project-reveal">
              <div className="project-card-copy">
                <div className="project-card-header">
                  <span>{project.status}</span>
                  <span>0{portfolioProjects.indexOf(project) + 1}</span>
                </div>
                <h3>{project.name}</h3>
                <p className="project-subtitle">{project.subtitle}</p>
                <p className="project-description">{project.description}</p>
                <div className="project-tags">
                  {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                {project.ctas && (
                  <div className="project-actions">
                    {project.ctas.map((cta, index) => (
                      <a
                        key={cta.href}
                        className={index === 0 ? 'luxury-btn luxury-btn-primary' : 'luxury-btn'}
                        href={cta.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {cta.label} <ArrowUpRight size={13} />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div className="project-card-visual">
                {project.slug === 'event-horizon' ? (
                  <EventHorizonVisual />
                ) : project.image ? (
                  <img src={project.image} alt={`${project.name} interface`} />
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
