'use client';

import { profile } from '@/content/profile';
import { faqs } from '@/content/chapters';
import { ChapterHeading, ChapterInset } from '@/components/ChapterShell';

/**
 * Chapter 9 — FAQ.
 *
 * Restored at Giorgio's direction, 20 August 2026, having been dropped earlier on
 * the grounds that he had no FAQ material. He was right and I was wrong: the
 * questions a hiring manager would actually ask him are all answerable.
 *
 * The constraint that replaced "no FAQ" is stricter than it looks — a question
 * may only appear here if the answer is TRUE OF HIM. The target's equivalent
 * answers lean on client volume ("clients keep coming back"); writing that for
 * Giorgio would be invention, because he has no clients. Every answer in
 * content/chapters.ts traces to the evidence ledger.
 *
 * Two columns of <details>, matching the target's FAQ shape. No JavaScript
 * needed: keyboard operable and correctly announced on its own.
 */
export function FaqChapter() {
  const mid = Math.ceil(faqs.length / 2);
  const columns = [faqs.slice(0, mid), faqs.slice(mid)];

  return (
    <section id="faq" aria-labelledby="faq-heading" className="relative py-24">
      <ChapterInset>
        <ChapterHeading
          id="faq"
          eyebrow="FAQ"
          title={['Got any', 'questions?']}
          lede={['The things people actually ask, answered without the sales voice.']}
        />

        <div className="mt-12 grid gap-3 lg:grid-cols-2 lg:items-start">
          {columns.map((col, ci) => (
            <div key={ci} className="flex flex-col gap-3">
              {col.map((f) => (
                <details key={f.q} className="chapter-card group overflow-hidden">
                  <summary className="flex min-h-[68px] cursor-pointer list-none items-center justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
                    <span className="text-[17.5px] font-bold leading-[1.3] tracking-[-0.012em]">
                      {f.q}
                    </span>
                    <span
                      aria-hidden
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--line-strong)] text-[19px] leading-none transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <div className="border-t border-[var(--line)] p-5">
                    <p className="text-[15.5px] leading-[1.65] text-[var(--ink-dim)]">{f.a}</p>
                  </div>
                </details>
              ))}
            </div>
          ))}
        </div>

        {/* The page ends here on desktop, where the rail's CTA is the only one. */}
        <div className="chapter-card mt-14 flex flex-col gap-5 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-[26px] font-bold leading-[1.15] tracking-[-0.028em]">
              Anything I did not cover?
            </h3>
            <p className="mt-2 text-[15.5px] leading-[1.55] text-[var(--ink-dim)]">
              WhatsApp is the fastest way to reach me.
            </p>
          </div>
          <a
            href={profile.whatsappPrefill}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[56px] shrink-0 items-center justify-center rounded-[11px] px-7 text-[17px] font-bold text-[var(--ink)] transition-colors hover:bg-[var(--accent-hi)]"
            style={{ background: 'var(--accent)' }}
          >
            Message me
            <span className="sr-only"> on WhatsApp (opens in a new tab)</span>
          </a>
        </div>
      </ChapterInset>
    </section>
  );
}
