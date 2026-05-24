import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { achievementsConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

export default function Achievements() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentSection = sectionRef.current;
    if (!currentSection) return;

    const revealEls = currentSection.querySelectorAll('.achievements-reveal');

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

      if (gridRef.current) {
        const cells = gridRef.current.children;
        tl.fromTo(
          Array.from(cells),
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            stagger: 0.1,
            ease: 'power3.out',
          },
          '-=0.6'
        );
      }

      if (textRef.current) {
        tl.fromTo(
          textRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 0.85,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power2.out',
          },
          '-=0.4'
        );
      }
    }, currentSection);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="achievements"
      className="luxury-section luxury-section-light"
      style={{
        paddingTop: '100px',
        paddingBottom: '100px',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <p className="luxury-eyebrow achievements-reveal" style={{ margin: 0, marginBottom: '20px' }}>
          {achievementsConfig.sectionLabel}
        </p>
        
        <h2 className="section-headline achievements-reveal" style={{ margin: 0, fontSize: '3.2rem', marginBottom: '50px' }}>
          QUANTIFIED PERFORMANCE
        </h2>

        <div
          ref={gridRef}
          className="achievements-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '50px',
          }}
        >
          {achievementsConfig.stats.map((stat) => (
            <div key={stat.value} className="stat-item">
              <span className="stat-value">
                {stat.value}
              </span>
              <span className="stat-label">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        <div
          ref={textRef}
          className="achievements-text-container"
        >
          {achievementsConfig.textAchievements.map((achievement) => (
            <div key={achievement.text} className="achievement-text-item">
              “ {achievement.text} ”
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
