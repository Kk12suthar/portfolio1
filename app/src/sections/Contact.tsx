import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { contactConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const currentSection = sectionRef.current;
    if (!currentSection) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: currentSection,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      });

      // 1. Stagger in the contact headers & subtext
      const revealEls = currentSection.querySelectorAll('.contact-reveal');
      tl.fromTo(Array.from(revealEls),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.0, stagger: 0.15, ease: 'power3.out' }
      );

      // 2. Slide in info link items
      if (infoRef.current) {
        const linkItems = infoRef.current.querySelectorAll('.contact-link-item');
        tl.fromTo(Array.from(linkItems),
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
          },
          '-=0.6'
        );
      }

      // 3. Stagger reveal contact form fields
      if (formRef.current) {
        tl.fromTo(
          formRef.current.querySelectorAll('.contact-form-field'),
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
          },
          '-=0.8'
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="luxury-section luxury-section-light"
      style={{
        paddingTop: '100px',
        paddingBottom: '100px',
      }}
    >
      <div className="contact-container">
        {/* Info Column */}
        <div ref={infoRef} className="contact-info">
          <div>
            <p className="luxury-eyebrow contact-reveal" style={{ margin: 0, marginBottom: '20px' }}>
              COLLABORATION
            </p>
            <h2 className="contact-heading section-headline contact-reveal" style={{ margin: 0, fontSize: '3.2rem', marginBottom: '30px' }}>
              {contactConfig.heading}
            </h2>
            <p className="contact-lead contact-reveal">
              {contactConfig.subtext}
            </p>
          </div>

          <div className="contact-links">
            <a href={contactConfig.email} className="contact-link-item">
              <span>{contactConfig.email.replace('mailto:', '')}</span>
              <span style={{ fontSize: '1rem', opacity: 0.5 }}>→</span>
            </a>
            <a href={contactConfig.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link-item">
              <span>LinkedIn</span>
              <span style={{ fontSize: '1rem', opacity: 0.5 }}>→</span>
            </a>
          </div>
        </div>

        {/* Form Column */}
        <div>
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="contact-form"
          >
            <div className="form-group contact-form-field">
              <label htmlFor="contact-name" className="form-label">
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                placeholder="YOUR NAME"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group contact-form-field">
              <label htmlFor="contact-email" className="form-label">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                placeholder="YOUR EMAIL"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group contact-form-field">
              <label htmlFor="contact-message" className="form-label">
                Message
              </label>
              <textarea
                id="contact-message"
                placeholder="YOUR MESSAGE"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="form-textarea"
              />
            </div>

            <button
              type="submit"
              className="luxury-btn luxury-btn-primary contact-form-field"
              style={{ cursor: 'pointer', alignSelf: 'flex-start', minWidth: '200px' }}
            >
              {submitted ? 'MESSAGE SENT ✓' : 'SEND INQUIRY'}
            </button>
          </form>

          {/* Social Links Row */}
          <div
            style={{
              marginTop: '40px',
              display: 'flex',
              gap: '24px',
              alignItems: 'center',
            }}
          >
            {contactConfig.socialLinks.map((link, index) => (
              <div key={link.label} style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '0.7rem',
                    letterSpacing: '0.15em',
                    color: '#000000',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    opacity: 0.5,
                    transition: 'opacity 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0.5';
                  }}
                >
                  {link.label}
                </a>
                {index < contactConfig.socialLinks.length - 1 && (
                  <span style={{ color: 'rgba(0, 0, 0, 0.15)', fontSize: '10px' }}>·</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
