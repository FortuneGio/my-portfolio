'use client';

import Image from 'next/image';
import { useLayoutEffect, useRef, useState } from 'react';
import { filmWorks, projects } from '@/content/chapters';
import { ChapterInset } from '@/components/ChapterShell';
import { useScrollScene } from '@/lib/useScrollScene';

/**
 * Chapter 4 — the horizontal project track.
 *
 * The target's other signature mechanic: roughly 3,300 px of vertical scroll is
 * converted into a horizontal row of project cards while the section is pinned.
 * This is also where the target turns dark, which is why the portrait backdrop is
 * designed to have retired by this point.
 *
 * The pin distance is derived from the actual track width at refresh time rather
 * than hard-coded, so adding a project cannot silently break the mapping — a
 * hard-coded distance would leave the last card unreachable.
 *
 * Below 1024px, and under reduced motion, this degrades to a normal vertical
 * list. Nothing is only reachable by the animation.
 */
export function ProjectsChapter() {
  const root = useRef<HTMLElement>(null);

  /**
   * The Film & video card expands into one card per film.
   *
   * Giorgio, 20 August 2026: "there should be a button like a '>' to show all
   * the cards in its own respective cards, there will be an animation of the
   * cards pushing to the right."
   *
   * That is exactly what happens — the films are spliced into the row in place,
   * so everything after them is displaced rightwards, and the displacement is
   * animated rather than jumped.
   */
  const [expanded, setExpanded] = useState(false);
  const prevRects = useRef<Map<string, number>>(new Map());

  const shown: typeof projects = expanded
    ? projects.flatMap((p) => (p.subItems ? [p, ...filmWorks] : [p]))
    : projects;

  // Animate the displacement, then let ScrollTrigger re-measure the longer row.
  useLayoutEffect(() => {
    const track = root.current?.querySelector<HTMLElement>('[data-track]');
    if (!track) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cards = [...track.querySelectorAll<HTMLElement>('li[data-card]')];
    const before = prevRects.current;
    const after = new Map<string, number>();
    cards.forEach((c) => after.set(c.dataset.card!, c.getBoundingClientRect().left));

    if (before.size) {
      (async () => {
        const { gsap } = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        cards.forEach((c) => {
          const key = c.dataset.card!;
          const from = before.get(key);
          const to = after.get(key)!;
          if (from === undefined) {
            // A card that did not exist before: it arrives rather than slides.
            gsap.fromTo(
              c,
              { opacity: 0, scaleX: 0.86, transformOrigin: 'left center' },
              { opacity: 1, scaleX: 1, duration: 0.5, ease: 'power3.out' },
            );
          } else if (Math.abs(from - to) > 1) {
            gsap.fromTo(c, { x: from - to }, { x: 0, duration: 0.62, ease: 'power3.out' });
          }
        });
        ScrollTrigger.refresh();
      })();
    }

    prevRects.current = after;
  }, [expanded]);

  useScrollScene(root, ({ gsap }) => {
    const track = root.current?.querySelector<HTMLElement>('[data-track]');
    const viewport = root.current?.querySelector<HTMLElement>('[data-track-viewport]');
    if (!track || !viewport) return;

    const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

    gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: root.current,
        start: 'top top',
        // +=distance keeps one pixel of scroll to one pixel of travel, so the
        // row never races ahead of or lags the reader's wheel.
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });
  });

  return (
    <section
      ref={root}
      id="work"
      aria-labelledby="work-heading"
      className="relative overflow-hidden bg-[var(--dark)] py-20 text-[var(--paper)] lg:h-svh lg:py-0"
    >
      <div className="lg:flex lg:h-full lg:flex-col lg:justify-start lg:pt-[5vh] lg:pb-[4vh]">
        <ChapterInset>
          <header className="lg:pt-4">
            <p className="inline-flex items-center rounded-full border border-[rgba(248,240,240,0.35)] px-3.5 py-1.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.14em]">
              Selected work
            </p>
            <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <h2
                id="work-heading"
                className="font-display text-[clamp(30px,4.2vw,58px)] font-bold leading-[1] tracking-[-0.04em]"
              >
                Things I built,
                <br />
                filmed, or broke on purpose
              </h2>
              <p className="max-w-[38ch] text-[15px] leading-[1.6] text-[rgba(248,240,240,0.72)]">
                Professional, academic and personal work. Where credit is shared, it says so on
                the card.
              </p>
            </div>
          </header>
        </ChapterInset>

        {/* The track. Full-bleed to the right so cards run off the edge. */}
        <div data-track-viewport className="mt-10 overflow-hidden lg:mt-8 lg:min-h-0 lg:flex-1">
          <ul
            data-track
            className="flex flex-col gap-5 px-[var(--gutter)] lg:h-full lg:w-max lg:flex-row lg:gap-6 lg:pr-[20vw]"
            style={{ paddingLeft: 'var(--chapter-inset)' }}
          >
            {shown.map((p) => (
              <li
                key={p.index}
                data-card={p.index}
                // Height is capped to what the pinned viewport can actually
                // show. Giorgio, 20 August 2026: "On projects the open button is
                // cut off the screen" — cards were free to grow past the fold,
                // and the tallest one took its own call-to-action with it.
                //
                // 100svh minus the chapter header, so the card bottom is always
                // on screen. The media is `shrink-0` and the body fills the
                // remainder, which keeps the ratio sane on every card.
                className={`flex flex-col overflow-hidden rounded-[18px] bg-[var(--dark-raise)] lg:h-full lg:max-h-[560px] ${
                  p.subItems ? 'lg:w-[560px]' : 'lg:w-[440px]'
                }`}
              >
                {/* Media first — the card leads with the work, not with a label. */}
                {p.media ? (
                  <div className="relative h-[190px] w-full shrink-0 overflow-hidden bg-[#0d0d0d] lg:h-[34%]">
                    {p.media.kind === 'collage' ? (
                      // Poster kept whole on the left at its own aspect ratio,
                      // two stills stacked beside it. Nothing is cropped to a
                      // strip of itself, which was the problem with one image.
                      <div className="grid h-full w-full grid-cols-[1.15fr_1fr] gap-1.5 p-1.5">
                        <div className="relative overflow-hidden rounded-[10px]">
                          <Image
                            src={p.media.src}
                            alt={`${p.name} — film poster`}
                            fill
                            sizes="240px"
                            className="object-cover object-top"
                          />
                        </div>
                        <div className="grid grid-rows-2 gap-1.5">
                          {(p.media.extra ?? []).map((s) => (
                            <div key={s} className="relative overflow-hidden rounded-[10px]">
                              <Image
                                src={s}
                                alt=""
                                aria-hidden
                                fill
                                sizes="200px"
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : p.media.kind === 'video' ? (
                      <video
                        className="h-full w-full object-cover"
                        poster={p.media.poster}
                        muted
                        loop
                        playsInline
                        autoPlay
                        preload="metadata"
                        // Decorative duplicate of the card's own text; the heading
                        // and blurb beside it carry the meaning.
                        aria-hidden
                      >
                        <source src={p.media.src} type="video/mp4" />
                      </video>
                    ) : (
                      <Image
                        src={p.media.src}
                        alt={`${p.name} — project imagery`}
                        fill
                        sizes="440px"
                        className="object-cover"
                      />
                    )}
                    <span
                      className="absolute left-4 top-4 rounded-full bg-[rgba(10,10,10,0.72)] px-3 py-1.5 text-[13px] font-bold backdrop-blur-[3px]"
                      style={{ color: 'var(--accent)' }}
                    >
                      {p.index}
                    </span>
                  </div>
                ) : null}

                <div className="flex flex-1 flex-col p-6">
                  <ul className="flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-[rgba(248,240,240,0.3)] px-3 py-1 text-[13px] font-semibold text-[rgba(248,240,240,0.86)]"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex items-start justify-between gap-3">
                    <h3 className="font-display text-[27px] font-bold leading-[1.12] tracking-[-0.028em]">
                      {p.name}
                    </h3>
                    {p.subItems ? (
                      <button
                        type="button"
                        onClick={() => setExpanded((v) => !v)}
                        aria-expanded={expanded}
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[20px] font-bold text-[var(--ink)] transition-transform duration-300 hover:bg-[var(--accent-hi)]"
                        style={{
                          background: 'var(--accent)',
                          transform: expanded ? 'rotate(180deg)' : 'none',
                        }}
                      >
                        <span aria-hidden>›</span>
                        <span className="sr-only">
                          {expanded ? 'Collapse the films back into one card' : 'Show each film as its own card'}
                        </span>
                      </button>
                    ) : null}
                  </div>
                  <p className="mt-2.5 text-[15.5px] leading-[1.55] text-[rgba(248,240,240,0.8)]">
                    {p.blurb}
                  </p>

                  {/* Works gathered under one card each keep their own credit. */}
                  {p.subItems && !expanded ? (
                    // Scrolls within the card on short viewports. At 768px the
                    // last chip was clipping against the card edge, which loses
                    // a link silently — worse than a scroll, because nothing
                    // tells the reader it is there.
                    <ul className="no-scrollbar mt-4 flex min-h-0 flex-1 flex-wrap content-start gap-2 overflow-y-auto">
                      {/* The channel itself, first — it replaces the Open button. */}
                      {p.href ? (
                        <li>
                          <a
                            href={p.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-[44px] items-center rounded-[8px] px-3.5 text-[14px] font-bold text-[var(--ink)] hover:bg-[var(--accent-hi)]"
                            style={{ background: 'var(--accent)' }}
                          >
                            All on YouTube
                            <span className="sr-only"> (opens in a new tab)</span>
                          </a>
                        </li>
                      ) : null}
                      {p.subItems.map((s) => (
                        <li key={s.href}>
                          <a
                            href={s.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={s.note}
                            className="inline-flex min-h-[44px] items-center rounded-[8px] bg-[rgba(248,240,240,0.1)] px-3.5 text-[14px] font-semibold hover:bg-[rgba(248,240,240,0.18)]"
                          >
                            {s.label}
                            <span className="sr-only">
                              {' '}
                              — {s.note} (opens in a new tab)
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  <p className="mt-auto shrink-0 pt-5 text-[13.5px] leading-[1.45] text-[rgba(248,240,240,0.66)]">
                    {p.role}
                  </p>

                  {/* A card whose sub-items are already links does not get a
                      second, vaguer button underneath them — that row of chips
                      is the call to action, and the extra button was what
                      pushed this card past the fold. */}
                  {p.href && (!p.subItems || expanded) ? (
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex min-h-[52px] w-fit items-center rounded-[10px] px-5 text-[16px] font-bold text-[var(--ink)] hover:bg-[var(--accent-hi)]"
                      style={{ background: 'var(--accent)' }}
                    >
                      Open
                      <span className="sr-only">
                        {' '}
                        {p.name} (opens in a new tab)
                      </span>
                    </a>
                  ) : p.href && p.subItems ? null : (
                    <p className="mt-4 shrink-0 text-[13.5px] font-semibold text-[rgba(248,240,240,0.66)]">
                      {p.noLinkNote ?? 'Not published'}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
