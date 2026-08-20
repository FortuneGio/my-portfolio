'use client';

import { useRef } from 'react';
import { profile } from '@/content/profile';
import { useScrollScene } from '@/lib/useScrollScene';

/**
 * Chapter 1 — the pinned hero.
 *
 * This section now owns only what has NO destination in the rail: the headline
 * and the capability chips. Everything that exists in both places — nav, stat
 * cards, identity, CTA, email — lives in SiteFurniture and flies there instead
 * of fading (bar.md M5).
 *
 * The target's chips vanish by y=600 as well, so fading them is faithful; they
 * are the one thing that legitimately has nowhere to go.
 *
 * bar.md M6: the headline holds its size through the transition. In the target
 * `Webflow, Applied Differently.` is still enormous at y=600 — it has moved and
 * it has not shrunk, and it is the last thing to leave. So this rises and fades
 * late, and never scales.
 */

const CAPABILITIES = ['QA & testing', 'Video & post', 'Web & docs', 'Content'] as const;

export function HeroPinned() {
  const root = useRef<HTMLDivElement>(null);

  useScrollScene(root, ({ gsap }) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '[data-hero]',
        start: 'top top',
        end: '+=1200',
        pin: true,
        pinSpacing: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });

    // Chips go early — they have nowhere to fly to.
    tl.to('[data-chips]', { opacity: 0, y: -20, ease: 'none' }, 0.05)
      // Headline travels up at constant size and leaves last.
      .to('[data-headline]', { y: -140, ease: 'none' }, 0)
      .to('[data-headline]', { opacity: 0, ease: 'none' }, 0.72);
  });

  const { heroLine } = profile;

  return (
    <div ref={root}>
      <section
        data-hero
        id="home"
        aria-labelledby="hero-heading"
        className="relative h-[100svh] overflow-hidden"
      >
        {/*
          The portrait carrying his likeness is decorative in the accessibility
          tree, so his name is stated here for assistive technology. The wordmark
          is a graphic field, not a heading.
        */}
        <p className="sr-only">Giorgio Wilson Wong</p>

        {/* capability chips — right. M2: 17px, was 12.5px */}
        <div
          data-chips
          data-intro="chips"
          // top-[54%] rather than centred: the furniture nav sits at 38% and the
          // two collided, hiding the first chip behind "Credentials".
          className="absolute right-[var(--gutter)] top-[54%] z-20 hidden w-[236px] flex-col gap-2.5 rounded-[14px] p-4 backdrop-blur-[3px] lg:flex"
          style={{ background: 'color-mix(in srgb, var(--ground-raise) 86%, transparent)' }}
        >
          {CAPABILITIES.map((c) => (
            <p key={c} className="flex items-center gap-2.5 text-[17px] font-bold">
              <span
                aria-hidden
                className="h-3 w-3 shrink-0 rounded-[3px]"
                style={{ background: 'var(--accent-ink)' }}
              />
              {c}
            </p>
          ))}
        </div>

        {/* headline — M6: holds size, moves, leaves last */}
        <div
          data-headline
          className="absolute inset-x-0 bottom-[22%] z-20 flex justify-center px-[var(--gutter)] lg:bottom-[26%]"
        >
          <div data-intro="headline" className="w-full max-w-[620px] text-center">
            <h1
              id="hero-heading"
              aria-label={`${heroLine.lines.join(' ')} ${heroLine.emphasis}`}
              className="font-display text-[clamp(38px,5.6vw,76px)] font-bold leading-[0.94] tracking-[-0.038em]"
            >
              I turn ideas
              <br />
              into things you
              <br />
              can use.
            </h1>
          </div>
        </div>
      </section>
    </div>
  );
}
