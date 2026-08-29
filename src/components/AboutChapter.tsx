'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { about } from '@/content/chapters';

/** Staged by scripts/stage-media.mjs from optional-media/profile-lifestyle/. */
const ABOUT_SHOTS = [
  '/media/about/studio-chair.jpg',
  '/media/about/headphones-coffee.jpg',
  '/media/about/mount-batur.jpg',
  '/media/about/bench-candid.jpg',
];
import { ChapterHeading, ChapterInset } from '@/components/ChapterShell';
import { useScrollScene } from '@/lib/useScrollScene';

/**
 * Chapter 2 — About me.
 *
 * The target opens its story chapter with the eyebrow, a two-line display heading
 * and a short lede, set left over the blurred portrait with the right half of the
 * frame left deliberately empty. That emptiness is the point: it is where the
 * portrait shows through.
 */
export function AboutChapter() {
  const root = useRef<HTMLElement>(null);

  useScrollScene(root, ({ gsap }) => {
    gsap.from('[data-about-rise]', {
      y: 34,
      opacity: 0,
      duration: 0.7,
      stagger: 0.09,
      ease: 'power2.out',
      scrollTrigger: { trigger: root.current, start: 'top 72%' },
    });
    // A plain fade-and-rise — no pin, no Flip measurement — so it runs on
    // mobile too. Giorgio, 22 August 2026: "in the mobile it lacks animation."
  }, { minWidth: 0 });

  return (
    <section
      ref={root}
      id="about"
      aria-labelledby="about-heading"
      className="relative flex min-h-svh items-center py-24"
    >
      <ChapterInset>
        <div data-about-rise>
          <ChapterHeading
            id="about"
            eyebrow={about.eyebrow}
            title={about.title}
            lede={about.lede}
          />
        </div>

        <div className="mt-9 max-w-[54ch] space-y-4" data-about-rise>
          {about.body.map((p) => (
            <p key={p} className="chapter-card p-5 text-[16px] leading-[1.65]">
              {p}
            </p>
          ))}
        </div>

        {/*
          Lifestyle photography, offset and rotated so it reads as pinned prints
          rather than a stock grid. Decorative in the accessibility tree — the
          copy above already says everything these say.
        */}
        <ul
          data-about-rise
          className="mt-10 flex flex-wrap gap-4 lg:max-w-[70%]"
          aria-hidden
        >
          {ABOUT_SHOTS.map((s, i) => (
            <li
              key={s}
              className="overflow-hidden rounded-[14px] shadow-[0_10px_30px_rgba(16,16,16,0.14)]"
              style={{ transform: `rotate(${i % 2 === 0 ? -1.6 : 1.4}deg)` }}
            >
              <Image
                src={s}
                alt=""
                width={340}
                height={430}
                sizes="(max-width: 1024px) 45vw, 220px"
                className="h-[240px] w-[180px] object-cover lg:h-[280px] lg:w-[210px]"
              />
            </li>
          ))}
        </ul>
      </ChapterInset>
    </section>
  );
}
