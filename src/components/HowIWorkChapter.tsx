'use client';

import { useRef } from 'react';
import { howIWork } from '@/content/chapters';
import { ChapterInset } from '@/components/ChapterShell';
import { useScrollScene } from '@/lib/useScrollScene';

/**
 * Chapter 5 — How I work (the target's "What you get", renamed).
 *
 * The target sets a very large three-line statement, then a numbered list beneath
 * it. Giorgio's principle — "Manual first. AI second. Judgment always." — is
 * already three lines, so it takes that shape without being forced into it.
 */
export function HowIWorkChapter() {
  const root = useRef<HTMLElement>(null);

  useScrollScene(root, ({ gsap }) => {
    gsap.from('[data-statement-line]', {
      yPercent: 110,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: root.current, start: 'top 68%' },
    });

    /*
     * The word-by-word reveal Giorgio asked for: "u should add the what you get
     * animation style, it's cool."
     *
     * Measured from the target at `desktop-027-y08100.png`, where the paragraph
     * under the big heading is part dark and part grey mid-scroll — each word
     * darkens as the reader arrives at it, scrubbed rather than timed.
     *
     * Implemented as opacity per word, not colour: a colour tween would have to
     * interpolate between two computed values and cannot inherit the dark
     * chapter's palette, whereas opacity over the inherited ink works in both.
     */
    const words = gsap.utils.toArray<HTMLElement>('[data-word]');
    if (words.length) {
      // Explicit position per word rather than `stagger`.
      //
      // A single fromTo with `stagger: 0.5` did NOT hold each word at its dim
      // start until its turn — probing the opacities mid-scroll showed one word
      // transitioning and every other word already at 1, so the sentence
      // effectively arrived all at once. Building one tween per word at a known
      // position makes the from-state apply to all of them up front and the
      // order deterministic.
      gsap.set(words, { opacity: 0.22 });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '[data-reveal]',
          start: 'top 82%',
          end: 'bottom 55%',
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      });
      words.forEach((w, i) => {
        tl.fromTo(w, { opacity: 0.22 }, { opacity: 1, ease: 'none', duration: 1.4 }, i * 0.6);
      });
    }

    gsap.from('[data-step]', {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: { trigger: '[data-steps]', start: 'top 82%' },
    });
  });

  return (
    <section
      ref={root}
      id="how-i-work"
      aria-labelledby="how-i-work-heading"
      className="relative py-24"
    >
      <ChapterInset>
        <p className="inline-flex items-center rounded-full border border-[var(--line-strong)] px-3.5 py-1.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.14em]">
          {howIWork.eyebrow}
        </p>

        <h2
          id="how-i-work-heading"
          className="mt-6 font-display text-[clamp(38px,7vw,104px)] font-bold leading-[0.94] tracking-[-0.045em]"
        >
          {howIWork.statement.map((line, i) => (
            // Each line clips its own overflow so the reveal wipes from the
            // baseline rather than sliding through the line above it.
            <span key={line} className="block overflow-hidden pb-[0.06em]">
              <span
                data-statement-line
                className="block"
                style={i === 2 ? { color: 'var(--accent-ink)' } : undefined}
              >
                {line}
              </span>
            </span>
          ))}
        </h2>

        {/*
          The scroll-revealed statement, in the target's "What You Get" shape.
          Split on spaces at render time; each word is its own span so the reveal
          can walk across the sentence. `whitespace-pre` on a trailing space keeps
          the natural word gaps without inserting non-breaking spaces.
        */}
        <p
          data-reveal
          className="mt-12 max-w-[24ch] font-display text-[clamp(26px,3.6vw,50px)] font-bold leading-[1.12] tracking-[-0.03em]"
        >
          {howIWork.revealed.split(' ').map((w, i) => (
            <span key={`${w}-${i}`} data-word className="inline-block">
              {w}
              <span className="whitespace-pre"> </span>
            </span>
          ))}
        </p>

        <ol data-steps className="mt-14 grid gap-4 sm:grid-cols-2">
          {howIWork.steps.map((s) => (
            <li key={s.n} data-step className="chapter-card p-6">
              <p
                className="font-mono text-[12px] font-medium tracking-[0.1em]"
                style={{ color: 'var(--accent-ink)' }}
              >
                {s.n}
              </p>
              <h3 className="mt-3 font-display text-[19px] font-bold leading-[1.2] tracking-[-0.02em]">
                {s.title}
              </h3>
              <p className="mt-2.5 text-[14.5px] leading-[1.6] text-[var(--ink-dim)]">{s.body}</p>
            </li>
          ))}
        </ol>
      </ChapterInset>
    </section>
  );
}
