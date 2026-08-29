'use client';

import { useEffect, useRef, useState } from 'react';
import { howIWork } from '@/content/chapters';
import { useScrollScene } from '@/lib/useScrollScene';

/**
 * Chapter 5 — How I work.
 *
 * Rebuilt 21 August 2026 to the target's "What You Get?" shape, at Giorgio's
 * request. Measured from his recording (jam.dev/c/f97e0a17):
 *
 *   - the three-line principle as the heading, the third line in accent;
 *   - a small pill beneath it;
 *   - ONE large centred sentence carrying the whole argument, with small icon
 *     chips embedded between the words;
 *   - the sentence reveals word by word as you scroll;
 *   - hovering a chip opens a card explaining that part of the process.
 *
 * The four numbered step cards that used to sit underneath are gone — they are
 * now the four chips' detail cards, which is the same content doing more work in
 * less space, and is what makes the sentence worth reading slowly.
 *
 * The chips are real <button>s, not hover-only divs: the detail has to be
 * reachable by keyboard and by touch, where there is no hover at all.
 */
export function HowIWorkChapter() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(null);
  // What is actually in the DOM. Kept open one tick after `active` clears so the
  // card can animate out instead of vanishing — see DetailCard below.
  const [mounted, setMounted] = useState<number | null>(null);

  if (active !== null && mounted !== active) setMounted(active);

  useScrollScene(root, ({ gsap }) => {
    // The heading arrives as two clipped lines.
    gsap.from('[data-hiw-line]', {
      yPercent: 110,
      duration: 0.9,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: root.current, start: 'top 72%', toggleActions: 'play none none reset' },
    });

    /*
     * Word-by-word reveal, scrubbed.
     *
     * One tween per word at an explicit timeline position rather than a single
     * `stagger` — measured earlier, `stagger` left one word transitioning while
     * every other word was already lit, so the sentence effectively arrived all
     * at once.
     */
    const words = gsap.utils.toArray<HTMLElement>('[data-hiw-word]');
    if (words.length) {
      gsap.set(words, { opacity: 0.2 });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '[data-hiw-sentence]',
          start: 'top 84%',
          end: 'bottom 60%',
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      });
      words.forEach((w, i) => {
        tl.fromTo(w, { opacity: 0.2 }, { opacity: 1, ease: 'none', duration: 1.4 }, i * 0.6);
      });
    }
    // Giorgio, 22 August 2026: "in the mobile it lacks animation." This scene is
    // a plain clip-reveal and a scrubbed opacity walk — nothing pinned, nothing
    // measured by Flip — so unlike the rail/tools/hero choreography there is no
    // reason to gate it to desktop.
  }, { minWidth: 0 });

  return (
    <section
      ref={root}
      id="how-i-work"
      aria-labelledby="how-i-work-heading"
      className="relative py-28"
    >
      <div className="px-[var(--gutter)]" style={{ paddingLeft: 'var(--chapter-inset)' }}>
        {/* The heading, centred and very large — the target's proportions. */}
        <h2
          id="how-i-work-heading"
          className="text-center font-display text-[clamp(44px,7.4vw,112px)] font-bold leading-[0.9] tracking-[-0.045em]"
        >
          {howIWork.statement.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.08em]">
              <span
                data-hiw-line
                className="block"
                // The third line is the punchline and the chapter's only accent.
                style={i === 2 ? { color: 'var(--accent-ink)' } : undefined}
              >
                {line}
              </span>
            </span>
          ))}
        </h2>

        <p className="mt-8 flex justify-center">
          <span className="inline-flex items-center rounded-full border border-[var(--line-strong)] px-4 py-2 font-mono text-[11.5px] font-medium uppercase tracking-[0.16em]">
            {howIWork.eyebrow}
          </span>
        </p>

        {/*
          The sentence. Each word is its own span so the reveal can walk across
          it, and a chip is spliced in after the clause it belongs to.
        */}
        <div
          data-hiw-sentence
          className="mx-auto mt-12 max-w-[15ch] text-center font-display text-[clamp(34px,5.2vw,104px)] font-bold leading-[0.98] tracking-[-0.038em]"
          onMouseLeave={() => setActive(null)}
        >
          {howIWork.clauses.map((clause, ci) => (
            <span key={clause.text} className="relative">
              {clause.text.split(' ').map((w, wi) => (
                <span key={`${w}-${wi}`} data-hiw-word className="inline-block">
                  {w}
                  <span className="whitespace-pre"> </span>
                </span>
              ))}

              <span className="relative inline-block align-middle">
                <button
                  type="button"
                  aria-expanded={active === ci}
                  aria-label={`What "${howIWork.steps[ci]?.title}" means`}
                  onMouseEnter={() => setActive(ci)}
                  onFocus={() => setActive(ci)}
                  onClick={() => setActive(active === ci ? null : ci)}
                  className="mx-[0.12em] inline-flex h-[0.64em] min-h-[34px] w-[1.02em] min-w-[52px] items-center justify-center rounded-[0.17em] align-middle transition-transform hover:scale-[1.07]"
                  style={{ background: 'var(--accent)' }}
                >
                  <span aria-hidden className="text-[0.34em] font-bold leading-none text-[var(--ink)]">
                    {clause.icon}
                  </span>
                </button>

                {/* The detail card. Positioned beside its own chip. */}
                {mounted === ci ? (
                  <DetailCard
                    open={active === ci}
                    onExited={() => setMounted((m) => (m === ci ? null : m))}
                    title={howIWork.steps[ci]?.title}
                    body={howIWork.steps[ci]?.body}
                  />
                ) : null}
              </span>
            </span>
          ))}
        </div>

        <p className="mt-10 text-center text-[14.5px] text-[var(--ink-faint)]">
          Tap or hover a marker to see what each part means.
        </p>
      </div>
    </section>
  );
}

/**
 * A marker's detail card.
 *
 * Giorgio, 22 August 2026: "please make the marker pop up more smooth, and more
 * motion like heynesh.com." It used to be a bare conditional render — the card
 * simply existed or did not, on both the way in and the way out, which read as
 * a glitch rather than a reveal.
 *
 * It stays MOUNTED for one extra beat after `open` goes false, so the close can
 * actually play — `onExited` is what tells the parent it is now safe to remove
 * from the DOM. A `back.out` ease on the way in and a quick `power2.in` on the
 * way out is deliberately asymmetric: arriving gets a small overshoot so the
 * pop reads as motion, leaving is just fast, because a lingering exit on a
 * hover tooltip feels like the UI is stuck rather than considered.
 */
function DetailCard({
  open,
  onExited,
  title,
  body,
}: {
  open: boolean;
  onExited: () => void;
  title?: string;
  body?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (!open) onExited();
      return;
    }

    let cancelled = false;
    (async () => {
      const { gsap } = await import('gsap');
      if (cancelled) return;

      if (open) {
        gsap.fromTo(
          el,
          { opacity: 0, y: -8, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.8)' },
        );
      } else {
        gsap.to(el, {
          opacity: 0,
          y: -6,
          scale: 0.94,
          duration: 0.18,
          ease: 'power2.in',
          onComplete: () => {
            if (!cancelled) onExited();
          },
        });
      }
    })();

    return () => {
      cancelled = true;
    };
    // Deliberately keyed on `open` alone: `onExited` is a fresh closure every
    // parent render, but this effect only needs to fire on an open/close edge,
    // and whichever `onExited` is in scope at that moment is the current one.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <span
      ref={ref}
      role="tooltip"
      className="chapter-card absolute left-1/2 top-[calc(100%+10px)] z-30 block w-[280px] -translate-x-1/2 p-4 text-left shadow-[0_16px_44px_rgba(16,16,16,0.18)]"
      style={{ transformOrigin: 'top center' }}
    >
      <span className="block font-display text-[16.5px] font-bold leading-[1.2] tracking-[-0.015em]">
        {title}
      </span>
      <span className="mt-2 block text-[14px] font-medium leading-[1.55] text-[var(--ink-dim)]">
        {body}
      </span>
    </span>
  );
}
