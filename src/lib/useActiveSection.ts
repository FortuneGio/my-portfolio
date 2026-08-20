'use client';

import { useEffect, useState } from 'react';
import { sections } from '@/content/chapters';

/**
 * Which chapter is on screen.
 *
 * Shared by the desktop rail and the mobile nav so the two cannot disagree about
 * where the reader is — and so there is only one observer to reason about.
 *
 * IntersectionObserver rather than a scroll handler: it does no work per frame,
 * and it stays correct through the pinned sections, whose scroll offsets do not
 * map linearly to what is actually on screen.
 *
 * The rootMargin biases "current" toward the middle band of the viewport, so the
 * highlight changes when a chapter takes the screen rather than when its first
 * pixel appears.
 */
export function useActiveSection(): string {
  const [active, setActive] = useState<string>(sections[0]?.id ?? 'home');

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return active;
}

/** True while the given element covers the middle band of the viewport. */
export function useOverSection(id: string): boolean {
  const [over, setOver] = useState(false);

  useEffect(() => {
    const el = document.getElementById(id);
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOver(Boolean(e?.isIntersecting)), {
      rootMargin: '-38% 0px -38% 0px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, [id]);

  return over;
}
