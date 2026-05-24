/**
 * transitions.ts
 *
 * Cross-section cinematic transitions following the Jesko Jets philosophy:
 *   - Sections do not "scroll in" — they are already positioned, waiting.
 *   - A wipe, curtain, page-flip, or zoom-cut reveals what is already there.
 *   - Every transition is scrub-driven by ScrollTrigger.
 *
 * Each function returns the ScrollTrigger instance so callers can kill it
 * during cleanup (gsap context handles this automatically when used inside
 * a gsap.context() / gsap.matchMedia() block).
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* -----------------------------------------------------------------------
 * Shared types
 * --------------------------------------------------------------------- */

export interface BaseTransitionOpts {
  /** Element whose top/bottom drives the transition timeline */
  trigger: Element;
  /** Where in the trigger to start. Default 'bottom 80%' */
  start?: string;
  /** Where in the trigger to end. Default 'bottom 20%' */
  end?: string;
  /** Scrub stiffness. Default 1 */
  scrub?: number | boolean;
  /** Optional id, useful for debugging / cleanup */
  id?: string;
}

/* -----------------------------------------------------------------------
 * [2] HERO -> MANIFESTO  (black -> white)
 *
 * The hero layer fades + scales DOWN, revealing the white Manifesto that
 * is already in position behind it. This is the "camera pulling back as a
 * white sun fills the frame" move — no upward scroll, only a depth shift.
 * --------------------------------------------------------------------- */

export interface FadeScaleRevealOpts extends BaseTransitionOpts {
  /** The layer that fades + scales out (e.g. Hero) */
  outgoing: Element;
}

export function heroToManifestoReveal(opts: FadeScaleRevealOpts) {
  const { trigger, outgoing, start = 'bottom bottom', end = 'bottom top', scrub = 1, id } = opts;

  return gsap.fromTo(
    outgoing,
    { opacity: 1, scale: 1 },
    {
      opacity: 0,
      scale: 0.9,
      ease: 'none',
      scrollTrigger: { trigger, start, end, scrub, id: id ?? 'hero->manifesto' },
    }
  );
}

/* -----------------------------------------------------------------------
 * [4] MANIFESTO -> EXPERIENCE  (white -> white, page-flip in 3D)
 *
 * Same colour, so we tilt: the outgoing content rotateX -15deg shrinks
 * away as the camera tilts up; the incoming content rotateX +15 -> 0.
 * --------------------------------------------------------------------- */

export interface PageFlipOpts extends BaseTransitionOpts {
  outgoing: Element;
  incoming: Element;
}

export function pageFlip3D(opts: PageFlipOpts) {
  const { trigger, outgoing, incoming, start = 'top bottom', end = 'bottom top', scrub = 1, id } = opts;

  const st = ScrollTrigger.create({
    trigger,
    start,
    end,
    scrub,
    id: id ?? 'page-flip',
    animation: gsap
      .timeline()
      .fromTo(outgoing, { rotateX: 0, scale: 1, opacity: 1 }, { rotateX: -15, scale: 0.92, opacity: 0.4, ease: 'none' }, 0)
      .fromTo(incoming, { rotateX: 15, scale: 0.95, opacity: 0 }, { rotateX: 0, scale: 1, opacity: 1, ease: 'none' }, 0),
  });

  return st;
}

/* -----------------------------------------------------------------------
 * [6] EXPERIENCE -> OBSERVATION  (white -> black, curtain DOWN from top)
 *
 * A pure black panel descends from -100% to 0% as a scrub-driven shadow
 * flying in from above the viewport.
 * --------------------------------------------------------------------- */

export interface CurtainOpts extends BaseTransitionOpts {
  curtain: Element;
}

export function curtainDownToBlack(opts: CurtainOpts) {
  const { trigger, curtain, start = 'bottom 90%', end = 'bottom 10%', scrub = 0.8, id } = opts;

  return gsap.fromTo(
    curtain,
    { yPercent: -100 },
    {
      yPercent: 0,
      ease: 'none',
      scrollTrigger: { trigger, start, end, scrub, id: id ?? 'curtain-down' },
    }
  );
}

/* -----------------------------------------------------------------------
 * [8] OBSERVATION -> ARCHIVES  (black -> black, zoom cut)
 *
 * Same colour. Outgoing scales down + blurs; incoming scales up from
 * slightly smaller — like a forward camera cut on the same set.
 * --------------------------------------------------------------------- */

export interface ZoomCutOpts extends BaseTransitionOpts {
  outgoing: Element;
  incoming: Element;
}

export function zoomCutSameColour(opts: ZoomCutOpts) {
  const { trigger, outgoing, incoming, start = 'top bottom', end = 'bottom top', scrub = 1, id } = opts;

  return ScrollTrigger.create({
    trigger,
    start,
    end,
    scrub,
    id: id ?? 'zoom-cut',
    animation: gsap
      .timeline()
      .fromTo(
        outgoing,
        { scale: 1, opacity: 1, filter: 'blur(0px)' },
        { scale: 0.85, opacity: 0.6, filter: 'blur(8px)', ease: 'none' },
        0
      )
      .fromTo(incoming, { scale: 0.92, opacity: 0.6 }, { scale: 1, opacity: 1, ease: 'none' }, 0),
  });
}

/* -----------------------------------------------------------------------
 * [10] ARCHIVES -> ACHIEVEMENTS  (black -> white, curtain UP)
 *
 * The black Archives layer translates Y 0 -> -100%, revealing the white
 * Achievements panel beneath. Then Achievements headline SLAMS in.
 * --------------------------------------------------------------------- */

export interface CurtainUpOpts extends CurtainOpts {
  /** Optional headline element to "slam in" once the curtain has lifted */
  slamHeadline?: Element | null;
}

export function curtainUpToWhite(opts: CurtainUpOpts) {
  const { trigger, curtain, slamHeadline, start = 'bottom 90%', end = 'bottom 10%', scrub = 0.8, id } = opts;

  const st = gsap.fromTo(
    curtain,
    { yPercent: 0 },
    {
      yPercent: -100,
      ease: 'none',
      scrollTrigger: { trigger, start, end, scrub, id: id ?? 'curtain-up' },
    }
  );

  // Headline slam: not scrubbed — fires once when the curtain has cleared
  if (slamHeadline) {
    gsap.fromTo(
      slamHeadline,
      { opacity: 0, scale: 1.3 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: 'power3.out',
        scrollTrigger: {
          trigger,
          start: end,
          toggleActions: 'play none none reverse',
          id: (id ?? 'curtain-up') + '-slam',
        },
      }
    );
  }

  return st;
}

/* -----------------------------------------------------------------------
 * [12] ACHIEVEMENTS -> CONTACT  (white -> white, horizontal split)
 *
 * Achievements content splits in half: left -> -100%, right -> +100%.
 * Contact is already positioned beneath. Contact headline scales in
 * from the centre as the split completes.
 * --------------------------------------------------------------------- */

export interface SplitRevealOpts extends BaseTransitionOpts {
  splitLeft: Element;
  splitRight: Element;
  incomingHeadline?: Element | null;
}

export function horizontalSplitReveal(opts: SplitRevealOpts) {
  const { trigger, splitLeft, splitRight, incomingHeadline, start = 'top bottom', end = 'bottom top', scrub = 1, id } = opts;

  const tl = gsap
    .timeline()
    .fromTo(splitLeft, { xPercent: 0 }, { xPercent: -100, ease: 'none' }, 0)
    .fromTo(splitRight, { xPercent: 0 }, { xPercent: 100, ease: 'none' }, 0);

  if (incomingHeadline) {
    tl.fromTo(incomingHeadline, { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, ease: 'none' }, 0.5);
  }

  return ScrollTrigger.create({
    trigger,
    start,
    end,
    scrub,
    id: id ?? 'horizontal-split',
    animation: tl,
  });
}

/* -----------------------------------------------------------------------
 * Utility: kill all transitions registered with these ids
 * --------------------------------------------------------------------- */

export const TRANSITION_IDS = [
  'hero->manifesto',
  'page-flip',
  'curtain-down',
  'zoom-cut',
  'curtain-up',
  'curtain-up-slam',
  'horizontal-split',
];

export function killAllTransitions() {
  TRANSITION_IDS.forEach((id) => {
    const t = ScrollTrigger.getById(id);
    if (t) t.kill();
  });
}
