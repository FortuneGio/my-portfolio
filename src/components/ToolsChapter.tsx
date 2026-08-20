'use client';

import { useEffect, useRef, useState } from 'react';
import { toolGroups } from '@/content/chapters';
import { ChapterHeading, ChapterInset } from '@/components/ChapterShell';

/**
 * Chapter 7 — Tools (replaces the target's testimonial drag-carousel).
 *
 * Giorgio's own idea, and it fits the module exactly: the same horizontally
 * dragged row with a DRAG affordance and a segmented progress indicator, carrying
 * the tools he actually uses instead of quotes he does not have.
 *
 * Built on native overflow scrolling rather than a transform, with pointer events
 * layered on top for the drag. That is deliberate: it keeps the keyboard, the
 * trackpad, the touch fling and the scrollbar all working for free, which a
 * transform-based carousel has to reimplement badly.
 *
 * The honesty device is the tier: "Use regularly" / "Working knowledge" /
 * "Explored". content/skills-and-tools.md explicitly forbids labelling everything
 * proficient, and a portfolio that claims twelve expert-level tools is not
 * believable anyway.
 */
export function ToolsChapter() {
  const scroller = useRef<HTMLDivElement>(null);
  const badge = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [hovering, setHovering] = useState(false);
  // Only claim the row is draggable when it actually is. The affordance used to
  // show on any viewport, including ones where all the cards fitted and nothing
  // could move — which is what Giorgio noticed.
  const [scrollable, setScrollable] = useState(false);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;

    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setScrollable(max > 8);
      setProgress(max <= 0 ? 0 : el.scrollLeft / max);
    };
    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });

    // Card widths and the rail inset both move with the viewport, so re-check.
    const ro = new ResizeObserver(onScroll);
    ro.observe(el);

    // Pointer drag. Only grabs after a few pixels of movement so a click on a
    // link inside a card is not swallowed.
    let down = false;
    let startX = 0;
    let startLeft = 0;
    let moved = false;

    /*
     * Smoothing. Giorgio, 20 August 2026: "the drag animation on tools works,
     * but the animation is so rigid... like its not smooth."
     *
     * It was rigid because both the badge and the scroll were written straight
     * from the pointer event — the badge teleported to the cursor and the row
     * tracked the finger exactly, so every hand tremor showed and releasing the
     * button stopped the row dead.
     *
     * Now a rAF loop eases both towards a target: the badge lerps to the cursor
     * so it trails slightly, and scrollLeft eases towards a target that carries
     * momentum after release instead of stopping instantly.
     */
    const pointer = { x: 0, y: 0 };
    const badgePos = { x: 0, y: 0, seeded: false };
    let targetLeft = el.scrollLeft;
    let velocity = 0;
    let lastLeft = el.scrollLeft;
    let raf = 0;

    const tick = () => {
      // Badge trails the cursor rather than snapping to it.
      badgePos.x += (pointer.x - badgePos.x) * 0.18;
      badgePos.y += (pointer.y - badgePos.y) * 0.18;
      if (badge.current) {
        badge.current.style.transform = `translate3d(${badgePos.x}px, ${badgePos.y}px, 0) translate(-50%, -50%)`;
      }

      if (down && moved) {
        // Ease towards the drag target and remember the speed for the release.
        const next = el.scrollLeft + (targetLeft - el.scrollLeft) * 0.22;
        velocity = next - lastLeft;
        el.scrollLeft = next;
        lastLeft = next;
      } else if (Math.abs(velocity) > 0.4) {
        // Momentum, decaying. Clamped so it cannot fight the scroll bounds.
        velocity *= 0.93;
        const next = Math.max(0, Math.min(el.scrollWidth - el.clientWidth, el.scrollLeft + velocity));
        el.scrollLeft = next;
        lastLeft = next;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return; // native touch scrolling is better
      down = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
    };
    const onMove = (e: PointerEvent) => {
      // Record the pointer; the render loop below is what actually moves things.
      if (e.pointerType !== 'touch') {
        const r = el.getBoundingClientRect();
        pointer.x = e.clientX - r.left;
        pointer.y = e.clientY - r.top;
        if (!badgePos.seeded) {
          badgePos.x = pointer.x;
          badgePos.y = pointer.y;
          badgePos.seeded = true;
        }
      }

      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) < 4) return;
      if (!moved) {
        moved = true;
        setDragging(true);
        el.setPointerCapture(e.pointerId);
      }
      // Target, not position. The loop eases towards it.
      targetLeft = startLeft - dx;
    };
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') setHovering(true);
    };
    const onLeave = () => setHovering(false);
    const onUp = (e: PointerEvent) => {
      down = false;
      if (moved) {
        setDragging(false);
        if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      }
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener('scroll', onScroll);
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <section id="tools" aria-labelledby="tools-heading" className="relative py-24">
      <ChapterInset>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <ChapterHeading
            id="tools"
            eyebrow="Tools"
            title={['What I reach for,', 'graded honestly']}
          />

          {/* Segmented progress, matching the target's indicator. Shown only
              when the row can actually move. */}
          {scrollable ? (
            <div className="flex items-center gap-3">
              <div aria-hidden className="flex gap-1.5">
                {toolGroups.map((_, i) => {
                  // Light a segment once the scroll has reached its share of the
                  // track, so the indicator tracks position rather than count.
                  const seg = 1 / toolGroups.length;
                  const on = progress >= seg * i - 0.001;
                  return (
                    <span
                      key={i}
                      className="h-1.5 w-9 rounded-full transition-colors"
                      style={{ background: on ? 'var(--accent)' : 'var(--line-strong)' }}
                    />
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </ChapterInset>

      <div
        ref={scroller}
        // tabIndex + a label makes the row a keyboard-scrollable region, which is
        // how a keyboard user reaches the later cards without a mouse.
        tabIndex={0}
        role="region"
        aria-label="Tools, scrollable sideways"
        // `cursor-none` while hovering: the DRAG badge replaces the pointer, the
        // way the target's carousel does. It comes back the moment you leave, and
        // only when the row can actually scroll.
        className={`no-scrollbar relative mt-10 flex gap-5 overflow-x-auto pb-4 ${
          scrollable && hovering ? 'cursor-none select-none' : dragging ? 'cursor-grabbing' : ''
        }`}
        style={{
          paddingLeft: 'var(--chapter-inset)',
          paddingRight: 'var(--gutter)',
          // Without this the row starts scrolled to its END. `padding-left` moves
          // the first card's snap point to 380px, which is past the maximum
          // scrollLeft — an unreachable snap target, so a mandatory snap
          // container resolves to the nearest reachable one, the end.
          // scroll-padding tells it where the start edge really is.
        }}
      >
        {/* The cursor badge. `sticky` keeps it inside the scroller's own
            coordinate space while the row scrolls under it, so its transform can
            stay in simple client coordinates. */}
        <div
          ref={badge}
          aria-hidden
          className={`pointer-events-none sticky left-0 top-0 z-20 h-0 w-0 transition-opacity duration-200 ${
            scrollable && hovering ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span
            className={`flex h-[74px] w-[74px] items-center justify-center rounded-full text-[13px] font-bold uppercase tracking-[0.1em] text-[var(--ink)] transition-transform duration-150 ${
              dragging ? 'scale-90' : 'scale-100'
            }`}
            style={{ background: 'var(--accent)' }}
          >
            Drag
          </span>
        </div>

        {toolGroups.map((g) => (
          <article
            key={g.domain}
            // Wide enough that three cards overrun a 1440 viewport by a real
            // margin — with narrower cards there was only 160px of travel and the
            // DRAG affordance promised something the row could not deliver.
            className="chapter-card flex w-[300px] shrink-0 flex-col p-6 sm:w-[440px]"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-[23px] font-bold leading-[1.15] tracking-[-0.022em]">
                {g.domain}
              </h3>
              <span
                className="shrink-0 rounded-full px-3 py-1.5 text-[12.5px] font-bold"
                style={{ background: 'var(--accent)', color: 'var(--ink)' }}
              >
                {g.tier}
              </span>
            </div>
            <p className="mt-2.5 text-[15px] leading-[1.55] text-[var(--ink-dim)]">{g.note}</p>

            <ul className="mt-5 flex flex-wrap gap-2">
              {g.items.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-[var(--line-strong)] px-3.5 py-1.5 text-[15px] font-semibold"
                >
                  {t}
                </li>
              ))}
            </ul>

            <p className="mt-auto border-t border-[var(--line)] pt-4 text-[14px] leading-[1.5] text-[var(--ink-faint)]">
              <span className="font-mono uppercase tracking-[0.1em]">Proved by </span>
              {g.provedBy}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
