import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { experienceConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentSection = sectionRef.current;
    const currentGrid = gridRef.current;
    if (!currentSection || !currentGrid) return;

    const revealEls = currentSection.querySelectorAll('.experience-reveal');
    const cards = currentGrid.children;
    
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

      tl.fromTo(Array.from(cards),
        { opacity: 0, y: 50, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 1.0, stagger: 0.15, ease: 'power3.out' },
        '-=0.6'
      );
    }, currentSection);

    return () => ctx.revert();
  }, []);

  const allItems = experienceConfig.items;

  if (!experienceConfig.sectionLabel && allItems.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="luxury-section luxury-section-light"
      style={{
        paddingTop: '100px',
        paddingBottom: '100px',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', marginBottom: '40px' }}>
        <p className="luxury-eyebrow experience-reveal" style={{ margin: 0, marginBottom: '20px' }}>
          {experienceConfig.sectionLabel}
        </p>
        <h2 className="section-headline experience-reveal" style={{ margin: 0, fontSize: '3.2rem' }}>
          PRODUCTION EXPERIENCE
        </h2>
      </div>

      <div
        ref={gridRef}
        className="experience-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '40px',
          width: '100%',
        }}
      >
        {allItems.map((item, index) => (
          <div
            key={item.slug || `${item.name}-${index}`}
            className="experience-card"
          >
            <div className="experience-header">
              <div>
                <h3 className="experience-company">
                  {item.name}
                </h3>
                <p className="experience-title">
                  {item.subtitle}
                </p>
              </div>
              <span className="experience-status">
                {item.status}
              </span>
            </div>

            <p className="experience-description">
              {item.description}
            </p>

            <div className="experience-tags" style={{ marginBottom: '30px' }}>
              {item.tags.map((tag) => (
                <span key={tag} className="experience-tag">
                  {tag}
                </span>
              ))}
            </div>

            {'ctas' in item && item.ctas && (
              <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                {item.ctas.map((cta) => (
                  <a
                    key={cta.label}
                    href={cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="luxury-btn"
                    style={{ padding: '10px 20px', fontSize: '0.7rem' }}
                  >
                    {cta.label}
                  </a>
                ))}
              </div>
            )}

            {item.image && (
              <div
                className="premium-image-container"
                style={{
                  marginTop: 'auto',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Grayscale overlay */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.15)',
                    zIndex: 2,
                    pointerEvents: 'none',
                  }}
                />
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: '100%',
                    aspectRatio: '16 / 10',
                    objectFit: 'cover',
                    display: 'block',
                    filter: 'grayscale(100%) contrast(1.15) brightness(0.7)',
                    transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
