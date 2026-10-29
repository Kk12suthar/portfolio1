import { useEffect, useState, type CSSProperties, type RefObject } from 'react';

/** True once the element has been on screen (it stays true). */
export const useInView = (ref: RefObject<Element | null>, threshold = 0.35) => {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, seen]);
  return seen;
};

/** A transition delay as a CSS variable: style={delay(0.4)}. */
export const delay = (s: number) => ({ '--d': `${s}s` }) as CSSProperties;
