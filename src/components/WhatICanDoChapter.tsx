'use client';

import { useRef } from 'react';
import { availabilityNote, capabilities } from '@/content/chapters';
import { ChapterHeading, ChapterInset } from '@/components/ChapterShell';
import { useScrollScene } from '@/lib/useScrollScene';

/**
 * Chapter 6 — What I can do (replaces the target's priced Services tiers).
 *
 * Same three-card UI, deliberately without the pricing furniture: no amounts, no
 * package names, no "most popular" badge, no book-this-tier CTA. Giorgio is
 * employed, and CHAPTER-MAP.md forbids presenting this as services for hire.
 *
 * The `proved by` line is what stops each card being a list of adjectives.
 */
export function WhatICanDoChapter() {
  const root = useRef<HTMLElement>(null);

  useScrollScene(root, ({ gsap }) => {
    gsap.from('[data-capability]', {
      y: 40,
      opacity: 0,
      duration: 0.65,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: { trigger: '[data-capabilities]', start: 'top 80%' },
    });
    // Plain fade-and-rise, safe on mobile. Giorgio, 22 August 2026: "in the
    // mobile it lacks animation."
  }, { minWidth: 0 });

  return (
    <section
      ref={root}
      id="what-i-can-do"
      aria-labelledby="what-i-can-do-heading"
      className="relative py-24"
    >
      <ChapterInset>
        <ChapterHeading
          id="what-i-can-do"
          eyebrow="What I can do"
          title={['Three things I', 'can actually prove']}
          lede={[
            'Each of these is backed by work you can open, not by a self-assessment.',
          ]}
        />

        <ul data-capabilities className="mt-12 grid gap-5 lg:grid-cols-3">
          {capabilities.map((c) => (
            <li key={c.title} data-capability className="chapter-card flex flex-col p-6">
              <h3 className="font-display text-[21px] font-bold leading-[1.15] tracking-[-0.02em]">
                {c.title}
              </h3>
              <p className="mt-3 text-[14.5px] leading-[1.6] text-[var(--ink-dim)]">{c.body}</p>

              <ul className="mt-5 space-y-2">
                {c.doing.map((d) => (
                  <li key={d} className="flex items-start gap-2.5 text-[14px] font-medium">
                    <span
                      aria-hidden
                      className="mt-[6px] h-2 w-2 shrink-0 rounded-[2px]"
                      style={{ background: 'var(--accent-ink)' }}
                    />
                    {d}
                  </li>
                ))}
              </ul>

              <p className="mt-auto border-t border-[var(--line)] pt-4 text-[12.5px] leading-[1.5] text-[var(--ink-faint)]">
                <span className="font-mono uppercase tracking-[0.1em]">Proved by </span>
                {c.provedBy}
              </p>
            </li>
          ))}
        </ul>

        {/* Required by content/profile.md. This replaces the target's pricing row. */}
        <p className="mt-8 max-w-[62ch] text-[13.5px] leading-[1.6] text-[var(--ink-faint)]">
          {availabilityNote}
        </p>
      </ChapterInset>
    </section>
  );
}
