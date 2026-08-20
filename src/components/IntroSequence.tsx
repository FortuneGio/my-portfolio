'use client';

import { useEffect } from 'react';

/**
 * The page-load entrance.
 *
 * Giorgio, 20 August 2026: "you're missing the very first animation where my
 * name flew in, then my image along side the other elements fades in and up."
 *
 * Order, matching that description: the wordmark arrives first and alone, the
 * portrait follows, and the furniture and headline come up underneath it.
 *
 * ---
 *
 * Why this animates the LAYERS and not the elements inside them:
 *
 * Every one of these elements already has a scroll-driven tween on it. The
 * wordmark is scaled and faded by scroll; the portrait's blur and opacity are
 * scrubbed; the furniture's x/y carry the flight into the rail. An entrance that
 * touched the same properties on the same nodes would fight the scrub, and at
 * scroll 0 the scrub wins — the entrance would simply be erased.
 *
 * So each fixed layer gets the entrance and its children keep their scroll
 * tweens. The two never touch the same property on the same node.
 *
 * It also keeps the furniture's flight measurements correct. `SiteFurniture`
 * animates the DIFFERENCE between an element's hero and rail rects; a transform
 * on the shared parent offsets both measurements identically, so the delta — and
 * therefore the flight — is unaffected.
 *
 * Per-item stagger is done with opacity only, because opacity does not move a
 * rect and so cannot disturb those measurements either.
 */
export function IntroSequence() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Reduced motion gets the settled page immediately. Nothing here reveals
    // content that is not already in the DOM, so skipping it loses nothing.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Only run at the top of the page. On a reload part-way down, the scroll
    // tweens are mid-flight and an entrance would look like a glitch.
    if (window.scrollY > 40) return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    (async () => {
      const { gsap } = await import('gsap');
      if (cancelled) return;

      ctx = gsap.context(() => {
        const q = (s: string) => document.querySelector<HTMLElement>(s);
        const wordmark = q('[data-intro="wordmark"]');
        const portrait = q('[data-intro="portrait"]');
        const furniture = q('[data-intro="furniture"]');
        const headline = q('[data-intro="headline"]');
        const chips = q('[data-intro="chips"]');
        const items = gsap.utils.toArray<HTMLElement>('[data-fly]');

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // 1. The name arrives on its own.
        if (wordmark) {
          tl.from(wordmark, { yPercent: 16, opacity: 0, duration: 1.05 }, 0);
        }

        // 2. Then him.
        if (portrait) {
          tl.from(portrait, { y: 56, opacity: 0, duration: 0.95 }, 0.4);
        }

        // 3. Then everything else, fading in and rising underneath.
        if (furniture) {
          tl.from(furniture, { y: 28, duration: 0.85, ease: 'power2.out' }, 0.66);
        }
        if (items.length) {
          tl.from(items, { opacity: 0, duration: 0.5, stagger: 0.045 }, 0.7);
        }
        if (headline) {
          tl.from(headline, { y: 34, opacity: 0, duration: 0.8 }, 0.72);
        }
        if (chips) {
          tl.from(chips, { y: 26, opacity: 0, duration: 0.7 }, 0.86);
        }
      });

      if (cancelled) ctx.revert();
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return null;
}
