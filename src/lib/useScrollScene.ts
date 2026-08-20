'use client';

import { useEffect, useRef, type RefObject } from 'react';
import type { gsap as GsapType } from 'gsap';

type Setup = (lib: {
  gsap: typeof GsapType;
  ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger;
}) => void;

interface Options {
  /** Skip entirely below this width. Scroll choreography is desktop-only, per the target. */
  minWidth?: number;
}

/**
 * Own a GSAP ScrollTrigger scene safely from React.
 *
 * The naive version of this has a race that cost real debugging time on
 * 20 August 2026, so it is written down here rather than repeated per chapter:
 *
 *     let ctx;
 *     (async () => { const {gsap} = await import('gsap'); ctx = gsap.context(...) })();
 *     return () => ctx?.revert();
 *
 * React runs the cleanup SYNCHRONOUSLY. The dynamic import has not resolved yet,
 * so `ctx` is still undefined and `revert()` never happens. Under StrictMode —
 * which double-invokes effects in development — the first mount's scene survives
 * and the second is built on top of it. The visible symptom was a pin-spacer with
 * 2400px of padding for a 1200px pin, and the hero translated a full 1200px off
 * screen. Nothing about the animation code was wrong; the teardown was.
 *
 * The fix is a cancellation flag that is also checked AFTER the await, so a scene
 * created post-teardown reverts itself immediately.
 */
export function useScrollScene(
  scope: RefObject<HTMLElement | null>,
  setup: Setup,
  { minWidth = 1024 }: Options = {},
) {
  // Kept in a ref so changing the callback identity never re-runs the scene.
  const setupRef = useRef(setup);
  setupRef.current = setup;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (minWidth && !window.matchMedia(`(min-width: ${minWidth}px)`).matches) return;

    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    (async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');

      // Teardown may already have happened while the import was in flight.
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => setupRef.current({ gsap, ScrollTrigger }), scope);

      // ...or between registering and building. Either way, leave nothing behind.
      if (cancelled) ctx.revert();
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [scope, minWidth]);
}
