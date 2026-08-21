'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { milestones, type Milestone } from '@/content/chapters';
import { ChapterInset } from '@/components/ChapterShell';
import { useScrollScene } from '@/lib/useScrollScene';

/**
 * Chapter 3 — the traced journey curve.
 *
 * The target's signature mechanic: a curve is drawn as you scroll, and milestone
 * cards alternate left and right along it, each with a `Read more` that opens a
 * modal. Measured in STRUCTURE.md as roughly scrollY 1800 → 4200.
 *
 * The curve is one SVG path whose stroke is revealed with stroke-dashoffset,
 * scrubbed to scroll. That is the honest way to do it — the line is genuinely
 * being drawn, not a mask sliding over a finished stroke, so it stays correct at
 * any viewport height.
 *
 * Under reduced motion the path renders complete and every card is visible;
 * nothing is gated behind an animation that will not run.
 */

const CARD_GAP = 460; // vertical distance between milestones, in SVG units
const TOP_PAD = 120;
const VB_W = 1000;

export function JourneyChapter() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<Milestone | null>(null);

  const vbH = TOP_PAD * 2 + CARD_GAP * (milestones.length - 1);

  // A gentle S-curve threading between the alternating cards.
  const d = milestones
    .map((_, i) => {
      const y = TOP_PAD + i * CARD_GAP;
      const x = i % 2 === 0 ? VB_W * 0.3 : VB_W * 0.7;
      if (i === 0) return `M ${x} ${y}`;
      const py = TOP_PAD + (i - 1) * CARD_GAP;
      const px = (i - 1) % 2 === 0 ? VB_W * 0.3 : VB_W * 0.7;
      const midY = (py + y) / 2;
      return `C ${px} ${midY}, ${x} ${midY}, ${x} ${y}`;
    })
    .join(' ');

  useScrollScene(root, ({ gsap }) => {
    const path = root.current?.querySelector<SVGPathElement>('[data-journey-path]');
    if (path) {
      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top 62%',
          end: 'bottom 88%',
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });
    }

    /*
     * Giorgio, 20 August 2026: the journey animation is "too gak kelihatan" —
     * too hard to see. It was a 44px rise at 84% of the viewport, which mostly
     * finished before the card was properly on screen.
     *
     * Now the cards alternate in from their own side of the curve, which reads
     * as the timeline assembling rather than a generic fade: left-hand cards
     * arrive from the left, right-hand cards from the right, each rotated
     * slightly and scaled back so the settle is visible. The trigger starts
     * later so the movement happens where the reader is actually looking.
     */
    gsap.utils.toArray<HTMLElement>('[data-milestone]').forEach((card, i) => {
      const fromLeft = i % 2 === 0;
      gsap.from(card, {
        x: fromLeft ? -90 : 90,
        y: 60,
        rotate: fromLeft ? -2.5 : 2.5,
        scale: 0.94,
        opacity: 0,
        duration: 0.95,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          // Giorgio, 21 August 2026: "the cards only plays one time, when scroll
          // back up and go down again it doesn't play the same way."
          //
          // GSAP's default toggleActions is "play none none none" — it fires
          // once and never rewinds, so on the way back the card was simply
          // already in its end state. "reset" on leave-back rewinds it so the
          // entrance runs again every time the card comes into view.
          toggleActions: 'play none none reset',
        },
      });
    });
  });

  return (
    <section
      ref={root}
      id="journey"
      aria-labelledby="journey-heading"
      className="relative py-24"
    >
      <ChapterInset>
        <p className="inline-flex items-center rounded-full border border-[var(--line-strong)] px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em]">
          My journey
        </p>
        <h2
          id="journey-heading"
          className="mt-5 font-display text-[clamp(34px,5.4vw,76px)] font-bold leading-[0.98] tracking-[-0.04em]"
        >
          Six things that
          <br />
          changed how I work
        </h2>
        <p className="mt-5 max-w-[48ch] text-[17px] leading-[1.6] text-[var(--ink-dim)]">
          Not a list of what I made. The moments that decided how I make anything — including
          the one where the right answer was to stop.
        </p>

        <div className="relative mt-14">
          {/* The traced curve. Decorative — the cards carry the content. */}
          <svg
            aria-hidden
            viewBox={`0 0 ${VB_W} ${vbH}`}
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
          >
            <path
              d={d}
              fill="none"
              stroke="var(--line-strong)"
              strokeWidth="2"
              strokeDasharray="6 8"
            />
            <path
              data-journey-path
              d={d}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          <ol className="relative flex flex-col gap-12 lg:gap-20">
            {milestones.map((m, i) => (
              <li
                key={`${m.year}-${m.title}`}
                data-milestone
                className={`lg:w-[46%] ${i % 2 === 0 ? 'lg:self-start' : 'lg:self-end'}`}
              >
                <article className="chapter-card p-6">
                  <p
                    className="font-display text-[42px] font-bold leading-none"
                    style={{ color: 'var(--accent-ink)' }}
                  >
                    {m.year}
                  </p>
                  <h3 className="mt-3 font-display text-[24px] font-bold leading-[1.15] tracking-[-0.022em]">
                    {m.title}
                  </h3>
                  <p className="mt-3 text-[16px] leading-[1.6] text-[var(--ink-dim)]">{m.body}</p>

                  {/*
                    The point of the card, set apart from the description.
                    Giorgio, 20 August 2026: the journey "should almost be about
                    me but shows my life more deeply and especially my character
                    development" — so each card states what changed in him, not
                    only what he produced.
                  */}
                  <p className="mt-4 border-l-2 pl-3.5 text-[16px] font-semibold leading-[1.5]" style={{ borderColor: 'var(--accent)' }}>
                    {m.learned}
                  </p>

                  <button
                    type="button"
                    onClick={() => setOpen(m)}
                    className="mt-5 inline-flex min-h-[48px] items-center rounded-[9px] bg-[var(--ink)] px-5 text-[15px] font-bold text-[var(--ground)] hover:bg-[var(--ink-dim)]"
                  >
                    Read more
                    <span className="sr-only"> about {m.title}</span>
                  </button>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </ChapterInset>

      <MilestoneModal milestone={open} onClose={() => setOpen(null)} />
    </section>
  );
}

/**
 * The modal.
 *
 * The target opens a dark panel over the curve. Accessibility is not optional
 * here: focus moves in, Escape and the backdrop close it, focus is trapped while
 * open and returned to the button that opened it, and the page behind cannot
 * scroll.
 */
function MilestoneModal({
  milestone,
  onClose,
}: {
  milestone: Milestone | null;
  onClose: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  const trap = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Tab' || !panel.current) return;
    const focusables = panel.current.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (!first || !last) return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  useEffect(() => {
    if (!milestone) return;

    restoreTo.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      trap(e);
    };
    document.addEventListener('keydown', onKey);

    // Focus the panel itself, so the reader starts at the title rather than the
    // close button.
    panel.current?.focus();

    /*
     * The modal now animates in. Giorgio, 20 August 2026: "there is no animation
     * when click read more" — it was appearing instantly, which after the rest
     * of the page reads as a glitch rather than a choice.
     *
     * The backdrop fades, the panel rises and scales, and the contents stagger
     * behind it so the eye lands on the year and title first.
     */
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      let cancelled = false;
      (async () => {
        const { gsap } = await import('gsap');
        if (cancelled || !panel.current) return;
        const backdrop = panel.current.previousElementSibling;
        const tl = gsap.timeline();
        if (backdrop) tl.from(backdrop, { opacity: 0, duration: 0.28, ease: 'none' }, 0);
        tl.from(
          panel.current,
          { opacity: 0, y: 46, scale: 0.965, duration: 0.5, ease: 'power3.out' },
          0.04,
        ).from(
          panel.current.children,
          { opacity: 0, y: 18, duration: 0.42, stagger: 0.045, ease: 'power2.out' },
          0.16,
        );
      })();
      // Nothing to revert: the timeline plays once and the modal unmounts.
      void cancelled;
    }

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      restoreTo.current?.focus();
    };
  }, [milestone, onClose, trap]);

  if (!milestone) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-[var(--gutter)]"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div aria-hidden className="absolute inset-0 bg-[rgba(10,10,10,0.66)] backdrop-blur-[3px]" />

      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="milestone-title"
        tabIndex={-1}
        className="no-scrollbar relative max-h-[85svh] w-full max-w-[640px] overflow-y-auto rounded-[18px] bg-[var(--dark)] p-7 text-[var(--paper)] outline-none sm:p-9"
      >
        <p
          className="font-display text-[34px] font-bold leading-none"
          style={{ color: 'var(--accent)' }}
        >
          {milestone.year}
        </p>
        <h3
          id="milestone-title"
          className="mt-3 font-display text-[26px] font-bold leading-[1.15] tracking-[-0.025em]"
        >
          {milestone.title}
        </h3>

        <p
          className="mt-4 text-[17px] font-semibold leading-[1.45]"
          style={{ color: 'var(--accent)' }}
        >
          {milestone.learned}
        </p>

        {milestone.photo ? (
          <div className="mt-6 overflow-hidden rounded-[12px] bg-[#0d0d0d]">
            <Image
              src={milestone.photo.src}
              alt={milestone.photo.alt}
              width={900}
              height={600}
              sizes="(max-width: 640px) 90vw, 560px"
              className="h-auto w-full object-cover"
            />
          </div>
        ) : null}

        <div className="mt-6 space-y-3.5 text-[16px] leading-[1.68] text-[rgba(248,240,240,0.86)]">
          {milestone.story.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        {milestone.note ? (
          <p className="mt-6 rounded-[10px] border border-[rgba(248,240,240,0.18)] p-3.5 text-[13px] leading-[1.55] text-[rgba(248,240,240,0.7)]">
            <span className="font-semibold text-[var(--paper)]">Worth being precise about — </span>
            {milestone.note}
          </p>
        ) : null}

        {milestone.links?.length ? (
          <ul className="mt-6 flex flex-wrap gap-2.5">
            {milestone.links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center rounded-[8px] px-4 text-[13px] font-bold text-[var(--ink)] hover:bg-[var(--accent-hi)]"
                  style={{ background: 'var(--accent)' }}
                >
                  {l.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        ) : null}

        <button
          type="button"
          onClick={onClose}
          className="mt-7 inline-flex min-h-11 items-center rounded-[8px] border border-[rgba(248,240,240,0.3)] px-4 text-[13px] font-semibold hover:bg-[rgba(248,240,240,0.08)]"
        >
          Close
        </button>
      </div>
    </div>
  );
}
