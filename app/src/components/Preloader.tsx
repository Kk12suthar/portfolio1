import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      }
    });

    // Reset styles
    gsap.set(logoRef.current, { opacity: 0, y: 20, filter: 'blur(10px)' });
    gsap.set(subtitleRef.current, { opacity: 0, y: 15 });
    gsap.set(lineRef.current, { scaleX: 0, transformOrigin: 'left center' });

    // Premium sequence
    tl.to(logoRef.current, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 1.4,
      ease: 'power3.out',
      delay: 0.3
    })
    .to(lineRef.current, {
      scaleX: 1,
      duration: 1.2,
      ease: 'power2.inOut'
    }, '-=0.6')
    .to(subtitleRef.current, {
      opacity: 0.7,
      y: 0,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.4')
    .to(containerRef.current, {
      opacity: 0,
      duration: 1.0,
      ease: 'power4.inOut',
      delay: 1.0
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="preloader-container"
    >
      <div className="preloader-wrapper">
        <div
          ref={logoRef}
          className="preloader-logo"
        >
          Kishor
        </div>
        
        <div
          ref={lineRef}
          className="preloader-line"
        />

        <div
          ref={subtitleRef}
          className="preloader-subtitle"
        >
          Engineered Precision · AI Systems
        </div>
      </div>
    </div>
  );
}
