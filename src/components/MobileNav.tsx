'use client';

import { useEffect, useRef } from 'react';
import { profile } from '@/content/profile';
import { sections } from '@/content/chapters';
import { useActiveSection, useOverSection } from '@/lib/useActiveSection';

/**
 * Mobile navigation.
 *
 * The desktop rail and the hero's horizontal nav are both `lg:` only, which left
 * phones with no way to move between chapters at all — you could only scroll the
 * full 11,800px. That is a real gap rather than a difference, so it gets fixed
 * even though the target's mobile layout differs from its desktop one.
 *
 * A fixed bottom bar rather than a hamburger: it needs no open state, no focus
 * trap and no overlay, and the current chapter stays visible while you read.
 *
 * The chip row scrolls the active chip into view as you scroll the page, so the
 * reader's position is always legible without them hunting for it.
 */
export function MobileNav() {
  const active = useActiveSection();
  const onDark = useOverSection('work');
  const row = useRef<HTMLUListElement>(null);

  // Keep the current chapter's chip visible.
  useEffect(() => {
    const el = row.current?.querySelector<HTMLElement>(`[data-chip="${active}"]`);
    if (!el) return;
    el.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [active]);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur-[10px] lg:hidden ${
        onDark
          ? 'border-[rgba(248,240,240,0.16)] bg-[rgba(18,18,18,0.92)] text-[var(--paper)]'
          : 'border-[var(--line)] bg-[color-mix(in_srgb,var(--ground-raise)_92%,transparent)] text-[var(--ink)]'
      }`}
      // Keep the bar clear of the home indicator on iOS.
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <nav aria-label="Sections">
        <ul
          ref={row}
          className="flex gap-1.5 overflow-x-auto px-3 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {sections.map((s) => {
            const on = active === s.id;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  data-chip={s.id}
                  aria-current={on ? 'true' : undefined}
                  className="flex min-h-11 items-center whitespace-nowrap rounded-full px-4 font-mono text-[11px] font-medium uppercase tracking-[0.1em] transition-colors"
                  style={
                    on
                      ? { background: 'var(--accent)', color: 'var(--ink)' }
                      : {
                          border: `1px solid ${
                            onDark ? 'rgba(248,240,240,0.26)' : 'var(--line-strong)'
                          }`,
                        }
                  }
                >
                  {s.label}
                </a>
              </li>
            );
          })}
          <li>
            <a
              href={profile.whatsappPrefill}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center whitespace-nowrap rounded-full bg-[var(--ink)] px-4 text-[12px] font-bold text-[var(--ground)]"
            >
              Message me
              <span className="sr-only"> on WhatsApp (opens in a new tab)</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
