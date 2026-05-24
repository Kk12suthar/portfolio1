import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AsciiCanvas from '../components/AsciiCanvas';
import { heroConfig, navigationConfig, manifestoConfig, aboutConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  isLoaded: boolean;
}

export default function Hero({ isLoaded }: HeroProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const manifestoRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isLoaded || !contentRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      tl.fromTo('.luxury-eyebrow', 
        { opacity: 0, y: 30, filter: 'blur(5px)' }, 
        { opacity: 0.6, y: 0, filter: 'blur(0px)', duration: 1.2 }, 
        0.2
      );
      
      tl.fromTo('.luxury-title span', 
        { opacity: 0, y: 80, rotateX: 10 }, 
        { opacity: 1, y: 0, rotateX: 0, duration: 1.6, stagger: 0.15 }, 
        0.4
      );

      tl.fromTo('.hero-lead-text', 
        { opacity: 0, y: 30 }, 
        { opacity: 0.8, y: 0, duration: 1.2 }, 
        0.9
      );

      tl.fromTo('.hero-note-item', 
        { opacity: 0, y: 20 }, 
        { opacity: 0.45, y: 0, duration: 0.8, stagger: 0.12 }, 
        1.2
      );

      tl.fromTo('.hero-cta-container .luxury-btn', 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 
        1.5
      );

      tl.fromTo('.hero-social-link', 
        { opacity: 0 }, 
        { opacity: 0.6, duration: 0.6, stagger: 0.08 }, 
        1.8
      );
    }, contentRef);

    // Cinematic 200vh Pinning, Zoom, and Manifesto cross-fade timeline
    let ctxScroll: gsap.Context | null = null;
    const hero = heroRef.current;
    const right = rightRef.current;
    const content = contentRef.current;
    const manifesto = manifestoRef.current;

    if (right && hero && content && manifesto) {
      ctxScroll = gsap.context(() => {
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: '+=200%',
            pin: true,
            scrub: 1.2,
            anticipatePin: 1,
          }
        });

        const isMobile = window.innerWidth <= 768;

        // 1. Hero text content fades out and slides up smoothly
        scrollTl.to(content, {
          opacity: 0,
          y: -80,
          duration: 0.8,
          ease: 'power2.out',
        }, 0);

        // 2. Right ASCII moon scales up and centers
        scrollTl.to(right, {
          scale: isMobile ? 2.5 : 3.5,
          xPercent: isMobile ? 0 : -45,
          duration: 1.2,
          ease: 'power2.inOut',
        }, 0);

        // 3. The dark overlay on the moon deepens as it zooms in
        scrollTl.to('.hero-overlay', {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          duration: 0.8,
          ease: 'power2.inOut',
        }, 0.2);

        // 4. The Manifesto starts fading in early (at 0.45) while the hero text is almost gone
        scrollTl.to(manifesto, {
          opacity: 1,
          pointerEvents: 'auto',
          duration: 0.8,
          ease: 'power1.inOut',
        }, 0.45);

        // 5. Stagger reveal the Manifesto typography/elements inside the white layout
        const manifestoElements = manifesto.querySelectorAll('.manifesto-reveal-el');
        scrollTl.fromTo(manifestoElements,
          { opacity: 0, y: 30 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            stagger: 0.12, 
            ease: 'power3.out' 
          },
          0.65 // Starts rendering while the white background is fading in!
        );
      });
    }

    return () => {
      ctx.revert();
      if (ctxScroll) ctxScroll.revert();
    };
  }, [isLoaded]);

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href === '#about') {
      const heroEl = heroRef.current;
      if (heroEl) {
        const startY = heroEl.offsetTop;
        const targetY = startY + window.innerHeight * 1.25; // Midpoint where Manifesto is fully visible & active
        window.scrollTo({
          top: targetY,
          behavior: 'smooth',
        });
      }
    } else {
      const target = document.querySelector(href);
      if (target) {
        const targetY = target.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: targetY,
          behavior: 'smooth',
        });
      }
    }
    setMenuOpen(false);
  };

  const notes = heroConfig.supportingNotes.slice(0, 3);
  const hasHeroContent =
    navigationConfig.brandName ||
    navigationConfig.links.length > 0 ||
    heroConfig.eyebrow ||
    heroConfig.titleLines.length > 0 ||
    heroConfig.leadText ||
    notes.length > 0;

  if (!hasHeroContent) {
    return null;
  }

  return (
    <section ref={heroRef} id="hero" className="hero-section">
      {/* Global Luxury Navigation */}
      <nav className={`luxury-nav ${scrolled ? 'scrolled' : ''}`}>
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.5rem',
            fontWeight: 300,
            color: scrolled ? '#ffffff' : '#ffffff', // kept high-contrast
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            transition: 'color 0.3s ease',
          }}
        >
          {navigationConfig.brandName}
        </span>
        
        {/* Desktop Navigation */}
        <div className="desktop-nav" style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          {navigationConfig.links.map((item) => (
            <a
              key={`${item.label}-${item.href}`}
              href={item.href}
              className="nav-link"
              onClick={(e) => handleNavLinkClick(e, item.href)}
            >
              {item.label}
            </a>
          ))}
        </div>
        
        {/* Mobile Hamburger Toggle */}
        <button
          className="mobile-nav-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} style={{ marginBottom: '4px' }} />
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
        </button>
      </nav>

      {/* Mobile Drawer Menu Overlay */}
      <div className={`mobile-menu-overlay ${menuOpen ? 'open' : ''}`}>
        {/* Explicit Go Back Close Button */}
        <button
          className="mobile-menu-close"
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'absolute',
            top: '20px',
            right: '24px',
            background: 'transparent',
            border: 'none',
            color: '#ffffff',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.75rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 0',
          }}
        >
          <span>✕</span>
          <span>CLOSE</span>
        </button>

        {navigationConfig.links.map((item, index) => (
          <a
            key={`${item.label}-${item.href}-mobile`}
            href={item.href}
            className="mobile-nav-link"
            style={{ transitionDelay: `${index * 80}ms` }}
            onClick={(e) => handleNavLinkClick(e, item.href)}
          >
            {item.label}
          </a>
        ))}
      </div>

      {/* Hero left content */}
      <div ref={contentRef} className="hero-left">
        <div className="hero-content-container">
          <p className="luxury-eyebrow">
            {heroConfig.eyebrow}
          </p>
          <h1 className="luxury-title">
            {heroConfig.titleLines.map((line, index) => (
              <span key={`${line}-${index}`}>
                {line}
              </span>
            ))}
          </h1>

          <p className="hero-lead-text">
            {heroConfig.leadText}
          </p>

          <div className="hero-notes-container">
            {notes.map((note, index) => (
              <p key={index} className="hero-note-item">
                {note}
              </p>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hero-cta-container" style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
            <a
              href={heroConfig.ctaPrimary.href}
              className="luxury-btn luxury-btn-primary"
            >
              {heroConfig.ctaPrimary.label}
            </a>
            <a
              href={heroConfig.ctaSecondary.href}
              className="luxury-btn"
            >
              {heroConfig.ctaSecondary.label}
            </a>
          </div>

          {/* Social Links */}
          <div style={{ display: 'flex', gap: '30px', marginTop: '30px', alignItems: 'center' }}>
            {heroConfig.socialLinks.map((link, index) => (
              <div key={link.label} style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                <a
                  className="hero-social-link"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '0.7rem',
                    letterSpacing: '0.2em',
                    color: '#ffffff',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  {link.label}
                </a>
                {index < heroConfig.socialLinks.length - 1 && (
                  <span style={{ color: 'rgba(255, 255, 255, 0.25)', fontSize: '10px' }}>·</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pinned Manifesto Overlay (Phase 2) */}
      <div
        ref={manifestoRef}
        className="manifesto-scroll-content"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: 0,
          zIndex: 12,
          pointerEvents: 'none',
          padding: '120px 80px',
          boxSizing: 'border-box',
          backgroundColor: '#ffffff',
          color: '#000000',
          transition: 'background-color 0.3s ease',
        }}
      >
        <div className="manifesto-container" style={{ width: '100%', maxWidth: '1400px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', maxWidth: '800px', margin: '0 auto' }}>
            <p className="luxury-eyebrow manifesto-reveal-el" style={{ margin: 0, color: 'rgba(0, 0, 0, 0.5)' }}>
              {manifestoConfig.sectionLabel}
            </p>
            
            <h2 className="section-headline manifesto-reveal-el" style={{ margin: 0, fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: '#000000' }}>
              ENGINEERED COGNITION
            </h2>

            <p className="manifesto-text manifesto-reveal-el" style={{ margin: 0, color: 'rgba(0, 0, 0, 0.8)', fontSize: 'clamp(0.95rem, 2vw, 1.15rem)', lineHeight: 1.8 }}>
              {manifestoConfig.text}
            </p>

            {/* Stats Row */}
            {aboutConfig.stats.length > 0 && (
              <div
                className="manifesto-reveal-el"
                style={{
                  display: 'flex',
                  gap: '40px',
                  marginTop: '20px',
                  flexWrap: 'wrap',
                }}
              >
                {aboutConfig.stats.map((stat) => (
                  <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 'clamp(2rem, 6vw, 3rem)',
                        fontWeight: 300,
                        lineHeight: 1,
                        color: '#000000',
                      }}
                    >
                      {stat.number}
                    </span>
                    <span
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: '0.65rem',
                        letterSpacing: '0.2em',
                        color: 'rgba(0, 0, 0, 0.45)',
                        textTransform: 'uppercase',
                        lineHeight: 1.4,
                      }}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div ref={rightRef} className="hero-right">
        <div className="hero-overlay" />
        <AsciiCanvas />
      </div>
    </section>
  );
}
