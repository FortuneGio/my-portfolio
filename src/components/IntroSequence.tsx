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
  /*
   * A reload starts at the top, every time.
   *
   * Giorgio, 21 August 2026: "when i refesh the page it should go back to home
   * ans restart the animation."
   *
   * Browsers restore the previous scroll position on reload, which on this page
   * dropped the reader into the middle of a pinned chapter with every scroll
   * tween mid-flight — and skipped the entrance entirely, since it only runs
   * near the top. Turning restoration off makes reload mean what he expects.
   *
   * This runs in its own effect, before the entrance below, so the scroll is
   * already at zero when the entrance decides whether to play.
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    // Deep links still work: only a bare reload is sent home.
    if (!window.location.hash) window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Reduced motion gets the settled page immediately. Nothing here reveals
    // content that is not already in the DOM, so skipping it loses nothing.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Only run at the top of the page. A hash deep-link lands mid-page, where
    // the scroll tweens are already mid-flight and an entrance would glitch.
    if (window.scrollY > 40) return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    (async () => {
      const { gsap } = await import('gsap');
      if (cancelled) return;

      ctx = gsap.context(() => {
        const q = (s: string) => document.querySelector<HTMLElement>(s);
        const wordmark = q('[data-intro="wordmark"]');
        const letters = gsap.utils.toArray<HTMLElement>('[data-wordmark-letter]');
        const portrait = q('[data-intro="portrait"]');
        const furniture = q('[data-intro="furniture"]');
        const headline = q('[data-intro="headline"]');
        const headlineLines = gsap.utils.toArray<HTMLElement>('[data-intro-headline-line]');
        const chips = q('[data-intro="chips"]');
        const items = gsap.utils.toArray<HTMLElement>('[data-fly]');

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        /*
         * 1. The name BUILDS, letter by letter — not one block fading in.
         *
         * Giorgio, 22 August 2026: "make the intro (name animation) like
         * heynesh.com." Measured off his recording
         * (jam.dev/c/b103f9c5-abae-499d-984c-c7be8b154c1f) and the reference
         * captures in design-loop-evidence/reference/motion/: the name does not
         * arrive as a settled block — it is still visibly under construction a
         * beat after it starts appearing, one letter rising out of its mask
         * after another. `letters` is what makes that literal: each character
         * has its own clip and rises out of it on its own stagger step, with a
         * small random tilt so it settles rather than snapping straight.
         */
        if (letters.length) {
          tl.from(
            letters,
            {
              yPercent: 130,
              opacity: 0,
              rotate: () => gsap.utils.random(-7, 7),
              duration: 0.8,
              stagger: 0.055,
              ease: 'power4.out',
            },
            0,
          );
        } else if (wordmark) {
          tl.from(wordmark, { yPercent: 16, opacity: 0, duration: 1.05 }, 0);
        }

        // 2. Then him — rising in as the name settles, coming into focus rather
        // than simply fading (the target's figure is sharp by the time it's
        // fully opaque, not still soft).
        if (portrait) {
          tl.from(
            portrait,
            { y: 56, opacity: 0, filter: 'blur(22px)', duration: 1.05, ease: 'power2.out' },
            0.42,
          );
        }

        // 3. Then everything else, fading in and rising underneath.
        if (furniture) {
          tl.from(furniture, { y: 28, duration: 0.85, ease: 'power2.out' }, 0.66);
        }
        if (items.length) {
          tl.from(items, { opacity: 0, duration: 0.5, stagger: 0.045 }, 0.7);
        }
        if (headline) {
          tl.from(
            headline,
            { y: 26, opacity: 0, filter: 'blur(14px)', duration: 0.75, ease: 'power2.out' },
            0.74,
          );
        }
        // Cascading in on top of the container's own rise — the two beats
        // together are what makes the headline read as arriving with weight
        // rather than as a single fade.
        if (headlineLines.length) {
          tl.from(
            headlineLines,
            { yPercent: 120, duration: 0.7, stagger: 0.08, ease: 'power3.out' },
            0.8,
          );
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
