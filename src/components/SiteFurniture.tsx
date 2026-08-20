'use client';

import { useEffect, useRef } from 'react';
import { profile } from '@/content/profile';
import { rail, sections } from '@/content/chapters';
import { useActiveSection, useOverSection } from '@/lib/useActiveSection';

/**
 * The furniture layer — hero and rail are ONE set of elements.
 *
 * bar.md M5, measured from the target at `desktop-002-y00600.png`: mid-transition
 * the seven nav items are in flight from two horizontal groups into a single
 * vertical list, both stat cards are travelling left, and the CTA is en route to
 * its rail slot. Everything stays fully opaque and full size while it moves.
 * Nothing dissolves; nothing pops in.
 *
 * The previous build faded `[data-furniture]` to zero and then faded a separately
 * constructed rail in — two populations of elements that never met, which is why
 * Giorgio read the result as lifeless.
 *
 * How this works: the markup below IS the rail. Adding `data-layout="hero"` to
 * the layer switches every piece to its hero position through ordinary CSS (see
 * globals.css). GSAP Flip records the geometry in one state, we switch to the
 * other, and Flip generates the timeline between them — scrubbed by scroll, so
 * the reader drives the flight.
 *
 * Layout lives in CSS, not in JS coordinates. A first attempt placed nav items
 * at `left: gutter + i * 132px` and they collided as soon as two labels differed
 * in width. Flexbox places them; Flip just measures whatever CSS decided.
 *
 * Scale comes from bar.md M1-M4: nav at 19px bold rather than 11px mono, no
 * interface text under 15px, stat numerals at 64px, buttons 56px tall.
 */
export function SiteFurniture() {
  const layer = useRef<HTMLDivElement>(null);
  const active = useActiveSection();
  const onDark = useOverSection('work');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = layer.current;
    if (!el) return;

    // Reduced motion and small screens keep the settled rail, which is what the
    // markup already renders. Nothing is hidden behind the animation.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(min-width: 1024px)').matches) return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    (async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // offsetParent is null for display:none, which is how short viewports
        // drop the marquee. Handing Flip a hidden element makes it measure a
        // zero rect and fling the survivors toward the origin.
        const items = gsap.utils
          .toArray<HTMLElement>('[data-fly]')
          .filter((n) => n.offsetParent !== null);
        if (!items.length) return;

        let tl: gsap.core.Timeline | undefined;
        let st: ScrollTrigger | undefined;

        const build = () => {
          tl?.kill();
          st?.kill();

          // Clear any transform from a previous build before measuring, or the
          // second measurement inherits the first one's offsets.
          gsap.set(items, { clearProps: 'transform' });

          // Measure both layouts, then animate the DIFFERENCE as a transform.
          //
          // This is a hand-rolled FLIP, and it deliberately replaces GSAP's
          // Flip.from(..., { absolute: true }). Flip applies `position: absolute`
          // for the duration and strips it on completion — fine for a one-shot
          // transition, wrong for a scrubbed one. Scrolling back up left every
          // item in document flow instead of its hero slot: `probe-reverse.mjs`
          // showed X returning correctly while Y came back stacked in 46px
          // increments, one nav row apart, with the whole set below the fold.
          //
          // Transforms have no such problem. They do not participate in layout,
          // so the timeline reverses exactly, and the DOM stays in rail layout
          // throughout — which is also the state that renders without JS.
          const railRects = items.map((n) => n.getBoundingClientRect());
          el.dataset.layout = 'hero';
          const heroRects = items.map((n) => n.getBoundingClientRect());
          delete el.dataset.layout;

          tl = gsap.timeline();
          items.forEach((item, i) => {
            const hero = heroRects[i];
            const railRect = railRects[i];
            if (!hero || !railRect) return;
            const dx = hero.left - railRect.left;
            const dy = hero.top - railRect.top;
            if (dx === 0 && dy === 0) return;
            tl!.fromTo(
              item,
              { x: dx, y: dy },
              { x: 0, y: 0, ease: 'none', duration: 1 },
              // Individual timing is what makes it read as flight rather than
              // as a block sliding across.
              i * 0.035,
            );
          });

          // The nav's card is deliberately NOT part of the Flip.
          //
          // In the hero the nav is bare type spread edge to edge; in the rail it
          // is a 300px card. Interpolating its background across that means
          // painting a card at every intermediate width, which rendered as a
          // large grey slab sitting over the portrait for the whole transition.
          // Instead it stays transparent while the items travel and the card
          // arrives once the nav is close to its final size.
          const nav = el.querySelector<HTMLElement>('.furn-nav');
          if (nav) {
            tl.fromTo(
              nav,
              { backgroundColor: 'rgba(217,211,197,0)' },
              { backgroundColor: 'rgba(217,211,197,0.88)', ease: 'none', duration: 0.18 },
              0.82,
            );
          }

          // The marquee has no hero position to travel from, so it fades in as
          // the rail assembles rather than sliding in from nowhere.
          const marquee = el.querySelector<HTMLElement>('.furn-marquee');
          if (marquee) {
            tl.fromTo(
              marquee,
              { opacity: 0 },
              { opacity: 1, ease: 'none', duration: 0.2 },
              0.78,
            );
          }

          st = ScrollTrigger.create({
            animation: tl,
            trigger: '[data-hero]',
            start: 'top top',
            end: '+=1200',
            scrub: 0.55,
          });
        };

        build();

        // Flip bakes measured pixels, so a resize invalidates the flight path.
        let t: ReturnType<typeof setTimeout>;
        const onResize = () => {
          clearTimeout(t);
          t = setTimeout(build, 250);
        };
        window.addEventListener('resize', onResize);

        return () => {
          clearTimeout(t);
          window.removeEventListener('resize', onResize);
          tl?.kill();
          st?.kill();
          delete el.dataset.layout;
        };
      }, layer);

      if (cancelled) ctx.revert();
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  const ink = onDark ? 'var(--paper)' : 'var(--ink)';
  const dim = onDark ? 'rgba(248,240,240,0.74)' : 'var(--ink-dim)';
  const accentInk = onDark ? 'var(--accent-hi)' : 'var(--accent-ink)';
  const cardBg = onDark
    ? 'rgba(28,28,28,0.88)'
    : 'color-mix(in srgb, var(--ground-raise) 88%, transparent)';

  return (
    <div
      ref={layer}
      data-furniture-layer
      data-intro="furniture"
      className="pointer-events-none fixed inset-0 z-30 hidden lg:block"
    >
      <div
        className="furn-col absolute left-[var(--gutter)] top-0 flex h-svh flex-col justify-center gap-2.5 py-5"
        style={{ width: 'var(--rail-w)' }}
      >
        {/* identity — M2: 15px minimum, was 12.5px */}
        <div
          data-fly
          className="furn-identity pointer-events-auto rounded-[14px] p-4 backdrop-blur-[6px]"
          style={{ background: cardBg }}
        >
          <p
            className="font-display text-[26px] font-bold leading-none"
            style={{ color: accentInk }}
          >
            {rail.wordmark}
            <span aria-hidden>®</span>
          </p>
          <p className="mt-3 text-[15px] font-medium leading-[1.45]" style={{ color: dim }}>
            {rail.positioning}
          </p>
        </div>

        {/* stats — M3: numerals at 64px, were 28px */}
        <div
          data-fly
          className="furn-stats pointer-events-auto flex w-[300px] gap-px overflow-hidden rounded-[14px]"
          style={{ background: onDark ? 'rgba(248,240,240,0.16)' : 'var(--line)' }}
        >
          {rail.stats.map((s) => (
            <div
              key={s.value}
              className="flex-1 px-4 py-3 backdrop-blur-[6px]"
              style={{ background: cardBg, color: ink }}
            >
              <p
                className="font-display text-[64px] font-bold leading-[0.8]"
                style={{ color: accentInk }}
              >
                {s.value}
              </p>
              <p className="mt-2 whitespace-pre-line text-[15px] font-bold leading-[1.25]">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* nav — M1: 19px bold body sans, was 11px mono */}
        <nav
          data-fly
          aria-label="Sections"
          className="furn-nav pointer-events-auto w-[300px] rounded-[14px] p-2 backdrop-blur-[6px]"
          style={{ background: cardBg }}
        >
          <ul className="flex flex-col gap-1">
            {sections.map((s) => {
              const on = active === s.id;
              return (
                <li key={s.id} data-fly>
                  <a
                    href={`#${s.id}`}
                    aria-current={on ? 'true' : undefined}
                    className="flex min-h-[42px] items-center whitespace-nowrap rounded-[9px] px-3.5 text-[19px] font-bold tracking-[-0.012em] transition-colors"
                    style={
                      on ? { background: 'var(--accent)', color: 'var(--ink)' } : { color: ink }
                    }
                  >
                    {s.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* tool marquee — arrives rather than travels; it has no hero home */}
        <div
          data-fly
          className="furn-marquee pointer-events-auto w-[300px] overflow-hidden rounded-[14px] py-2 backdrop-blur-[6px]"
          style={{
            background: cardBg,
            maskImage:
              'linear-gradient(to right, transparent, #000 16px, #000 calc(100% - 16px), transparent)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent, #000 16px, #000 calc(100% - 16px), transparent)',
          }}
        >
          <div className="marquee flex w-max gap-7 px-3">
            {[...rail.marquee, ...rail.marquee].map((t, i) => (
              <span
                key={`${t}-${i}`}
                aria-hidden={i >= rail.marquee.length}
                className="whitespace-nowrap text-[15px] font-bold"
                style={{ color: dim }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* email — M2 */}
        <a
          data-fly
          href={`mailto:${rail.email}`}
          className="furn-email pointer-events-auto flex min-h-[48px] w-[300px] items-center justify-center rounded-[11px] px-4 text-[15px] font-semibold backdrop-blur-[6px]"
          style={{ background: cardBg, color: ink }}
        >
          {rail.email}
        </a>

        {/* CTA — M4: 56px tall, 17px bold, was 46px / 14px */}
        <a
          data-fly
          href={profile.whatsappPrefill}
          target="_blank"
          rel="noopener noreferrer"
          className="furn-cta pointer-events-auto flex min-h-[56px] w-[300px] items-center justify-center rounded-[11px] px-6 text-[17px] font-bold text-[var(--ink)] transition-colors hover:bg-[var(--accent-hi)]"
          style={{ background: 'var(--accent)' }}
        >
          Message me
          <span className="sr-only"> on WhatsApp (opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}
