'use client';

import type { ReactNode } from 'react';

/**
 * Shared chapter frame.
 *
 * Every chapter after the hero is inset from the left to clear the persistent
 * rail, and carries the same eyebrow-plus-big-heading opening the target uses.
 * Keeping it in one place is what stops the eight chapters drifting apart.
 *
 * The inset is a padding on the section rather than a margin on the content, so
 * full-bleed children (the horizontal track, the drag carousel) can still reach
 * the right edge of the viewport.
 */

export function ChapterInset({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`px-[var(--gutter)] lg:pr-[var(--gutter)] ${className}`}
      style={{ paddingLeft: 'var(--chapter-inset)' }}
    >
      {children}
    </div>
  );
}

export function ChapterHeading({
  eyebrow,
  title,
  lede,
  id,
  tone = 'light',
}: {
  eyebrow: string;
  title: readonly string[];
  lede?: readonly string[];
  id: string;
  tone?: 'light' | 'dark';
}) {
  const ink = tone === 'dark' ? 'var(--ground)' : 'var(--ink)';
  const dim = tone === 'dark' ? 'rgba(240,236,228,0.72)' : 'var(--ink-dim)';

  return (
    <header>
      <p
        className="inline-flex items-center rounded-full border px-3.5 py-1.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.14em]"
        style={{
          color: ink,
          borderColor: tone === 'dark' ? 'rgba(240,236,228,0.35)' : 'var(--line-strong)',
        }}
      >
        {eyebrow}
      </p>
      <h2
        id={`${id}-heading`}
        className="mt-5 font-display text-[clamp(34px,5.4vw,76px)] font-bold leading-[0.98] tracking-[-0.04em]"
        style={{ color: ink }}
      >
        {title.map((line, i) => (
          <span key={line} className="block">
            {line}
            {i < title.length - 1 ? null : null}
          </span>
        ))}
      </h2>
      {lede ? (
        <div className="mt-5 max-w-[46ch] text-[15.5px] leading-[1.6]" style={{ color: dim }}>
          {lede.map((l) => (
            <p key={l}>{l}</p>
          ))}
        </div>
      ) : null}
    </header>
  );
}
