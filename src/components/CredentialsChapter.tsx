'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { credentials } from '@/content/chapters';
import { ChapterHeading, ChapterInset } from '@/components/ChapterShell';

/**
 * Chapter 8 — Credentials.
 *
 * Rebuilt 20 August 2026. Giorgio: "make it so that you can only open one at a
 * time and also when it opens it shows the contents on the empty space to its
 * right, remember animation."
 *
 * He had circled the right-hand half of the chapter, which was doing nothing
 * while the accordion expanded downward and pushed everything below it around.
 * Now the list stays a fixed column of rows and the selected credential renders
 * in a panel beside it — one at a time, because a single detail pane can only
 * show one thing, which enforces the behaviour rather than policing it.
 *
 * Accessibility: this is a tablist in all but name, so it is built as one.
 * Buttons carry `aria-selected` and `aria-controls`; the panel is a `tabpanel`
 * labelled by its row. Arrow keys move between rows, which is what a screen
 * reader user will expect once they hear "tab".
 *
 * Below `lg` there is no empty space to fill, so it degrades to a plain
 * disclosure list — the panel simply renders under the selected row.
 */
export function CredentialsChapter() {
  // Nothing open initially: the chapter should read as a list first, and an
  // auto-opened first row would look like a rendering accident.
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Animate the panel in whenever the selection changes.
  useEffect(() => {
    if (openIndex === null) return;
    const el = panelRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cancelled = false;
    (async () => {
      const { gsap } = await import('gsap');
      if (cancelled || !panelRef.current) return;
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.42, ease: 'power2.out' },
      );
      // The image is the slower half of the reveal, so it follows rather than
      // arriving with the text.
      const img = panelRef.current.querySelector('[data-cred-image]');
      if (img) {
        gsap.fromTo(
          img,
          { opacity: 0, scale: 0.97 },
          { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out', delay: 0.08 },
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [openIndex]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const next = e.key === 'ArrowDown' ? (i + 1) % credentials.length : (i - 1 + credentials.length) % credentials.length;
    rowRefs.current[next]?.focus();
  };

  const open = openIndex === null ? null : credentials[openIndex];

  return (
    <section id="credentials" aria-labelledby="credentials-heading" className="relative py-24">
      <ChapterInset>
        <ChapterHeading
          id="credentials"
          eyebrow="Credentials"
          title={['Where the', 'paper trail leads']}
          lede={[
            'Including the parts that are still in progress, and the one that proves less than it sounds like.',
          ]}
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-start">
          {/* The rows */}
          <ul className="flex flex-col gap-2.5" role="tablist" aria-orientation="vertical">
            {credentials.map((c, i) => {
              const isOpen = openIndex === i;
              return (
                <li key={c.title}>
                  <button
                    ref={(n) => {
                      rowRefs.current[i] = n;
                    }}
                    type="button"
                    role="tab"
                    id={`cred-tab-${i}`}
                    aria-selected={isOpen}
                    aria-controls="cred-panel"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    onKeyDown={(e) => onKey(e, i)}
                    className="chapter-card flex w-full min-h-[68px] items-center justify-between gap-4 p-5 text-left transition-colors"
                    style={
                      isOpen
                        ? { background: 'var(--accent)', color: 'var(--ink)' }
                        : undefined
                    }
                  >
                    <span>
                      <span className="block font-display text-[17.5px] font-bold leading-[1.2] tracking-[-0.015em]">
                        {c.title}
                      </span>
                      <span
                        className="mt-1 block text-[14px]"
                        style={{ color: isOpen ? 'var(--ink)' : 'var(--ink-dim)' }}
                      >
                        {c.issuer} · {c.period}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border text-[19px] leading-none transition-transform duration-300 ${
                        isOpen ? 'rotate-45' : ''
                      }`}
                      style={{
                        borderColor: isOpen ? 'rgba(16,16,16,0.4)' : 'var(--line-strong)',
                      }}
                    >
                      +
                    </span>
                  </button>

                  {/* Below lg the detail belongs under its own row — there is no
                      empty column to put it in on a phone. */}
                  {isOpen ? (
                    <div className="lg:hidden">
                      <CredentialDetail credential={c} />
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>

          {/* The panel — the space Giorgio pointed at. */}
          <div className="hidden lg:block lg:sticky lg:top-16">
            {open ? (
              <div
                ref={panelRef}
                id="cred-panel"
                role="tabpanel"
                aria-labelledby={`cred-tab-${openIndex}`}
                className="chapter-card p-7"
              >
                <CredentialDetail credential={open} heading />
              </div>
            ) : (
              <p className="px-7 py-10 text-[16px] leading-[1.6] text-[var(--ink-faint)]">
                Pick any of these to see the detail and the certificate.
              </p>
            )}
          </div>
        </div>
      </ChapterInset>
    </section>
  );
}

function CredentialDetail({
  credential: c,
  heading = false,
}: {
  credential: (typeof credentials)[number];
  heading?: boolean;
}) {
  return (
    <div className={heading ? '' : 'chapter-card mt-2.5 p-5'}>
      {heading ? (
        <>
          <h3 className="font-display text-[24px] font-bold leading-[1.15] tracking-[-0.025em]">
            {c.title}
          </h3>
          <p className="mt-1.5 text-[15px] text-[var(--ink-dim)]">
            {c.issuer} · {c.period}
          </p>
        </>
      ) : null}

      <p className={`${heading ? 'mt-5' : ''} text-[15.5px] leading-[1.6] text-[var(--ink-dim)]`}>
        {c.detail}
      </p>

      {c.caveat ? (
        <p className="mt-4 rounded-[8px] border border-[var(--line-strong)] p-3.5 text-[14.5px] leading-[1.5]">
          <span className="font-semibold">To be clear — </span>
          {c.caveat}
        </p>
      ) : null}

      {/*
        Capped rather than full-width. Giorgio, 20 August 2026: "the images is
        too big, very big. Make it a lot smaller." A certificate is supporting
        evidence, not the subject of the panel — at full width it dwarfed the
        text it was meant to back up, and the portrait-format ijazah was worst.
      */}
      {c.image ? (
        <div
          data-cred-image
          className="mt-5 max-w-[260px] overflow-hidden rounded-[10px] border border-[var(--line)] bg-[var(--ground-sink)]"
        >
          <Image
            src={c.image.src}
            alt={c.image.alt}
            width={520}
            height={380}
            sizes="260px"
            className="h-auto w-full object-contain"
          />
        </div>
      ) : null}
    </div>
  );
}
