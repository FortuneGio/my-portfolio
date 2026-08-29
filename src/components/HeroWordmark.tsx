'use client';

import { useRef } from 'react';
import { useScrollScene } from '@/lib/useScrollScene';

/**
 * The wordmark as a fixed graphic field, deliberately wider than the viewport so
 * it crops at both edges the way the target's does. Not a heading — the real h1
 * is the statement in HeroPinned.
 *
 * Why this is its own fixed layer rather than a child of the hero section:
 * the target's subject OCCLUDES the middle letters, so the paint order must be
 * wordmark → portrait → furniture. The hero section is `position: fixed` while
 * pinned, which makes it a stacking context and traps everything inside it — so
 * a portrait living outside the section can only go wholly behind or wholly in
 * front of it, never between. Splitting the wordmark out restores the three-layer
 * order using three sibling layers instead.
 */
export function HeroWordmark() {
  const layer = useRef<HTMLDivElement>(null);

  useScrollScene(layer, ({ gsap }) => {
    gsap.to('[data-wordmark]', {
      scale: 0.5,
      yPercent: -18,
      opacity: 0,
      ease: 'none',
      scrollTrigger: { start: 0, end: 1200, scrub: 0.6, invalidateOnRefresh: true },
    });
  });

  return (
    <div
      ref={layer}
      data-intro="wordmark"
      aria-hidden
      // Fixed only where the scroll scene runs. Below 1024px useScrollScene skips
      // the timeline, so a fixed wordmark would never scale or fade — it sat over
      // every chapter for the whole 11,800px scroll. Absolute + one viewport tall
      // means it simply scrolls away with the hero, which is what a phone wants.
      className="pointer-events-none absolute inset-x-0 top-0 z-0 h-svh select-none overflow-hidden lg:fixed lg:inset-0 lg:h-auto"
    >
      <div
        data-wordmark
        className="absolute left-1/2 top-[3%] -translate-x-1/2 whitespace-nowrap font-display font-bold leading-[0.74] tracking-[-0.055em]"
        style={{ color: 'var(--accent-mark)', fontSize: 'clamp(120px, 27vw, 460px)' }}
      >
        {/*
          Split into per-letter, individually-clipped spans so IntroSequence can
          reveal the name letter by letter — Giorgio, 22 August 2026: "make the
          intro (name animation) like heynesh.com," whose name arrives building
          up rather than as one block fading in. The outer overflow-hidden span
          is the mask each letter rises out of; the inner span is what actually
          moves, matching the clipped-line-reveal pattern already used for the
          "How I work" heading.
        */}
        {'GIORGIO'.split('').map((ch, i) => (
          <span key={i} className="inline-block overflow-hidden align-top">
            <span data-wordmark-letter className="inline-block">
              {ch}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
