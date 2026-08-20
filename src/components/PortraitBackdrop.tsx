'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { useScrollScene } from '@/lib/useScrollScene';

/**
 * The portrait as a persistent backdrop.
 *
 * Giorgio's correction, 20 August 2026: "my profile or body shouldn't be moving
 * but just getting blurred — right now it's moving upwards. Only the text/elements
 * move, ME is the background almost constantly throughout the website."
 *
 * So the portrait is `position: fixed` and never translates. It is the ground the
 * page scrolls over. The only thing scroll drives is how blurred and how faded it
 * becomes — and the blur has to be heavy, matching the target, not the timid 7px
 * of the first attempt.
 *
 * It holds sharp through the hero, blurs hard as the reader moves into the story
 * chapters, and retires before the dark work chapter takes the screen.
 */
export function PortraitBackdrop() {
  const layer = useRef<HTMLDivElement>(null);

  // minWidth 0: unlike the pinned choreography, a soft backdrop is fine on
  // mobile. Reduced motion still skips it and leaves the portrait sharp.
  useScrollScene(
    layer,
    ({ gsap }) => {
      // ONE timeline across the whole run. Two separate ScrollTriggers would
      // fight: the second one's `from` state applies at scroll 0 and the
      // portrait would start the page already blurred.
      //
      // No transforms of any kind here — not y, not scale. Scale reads as a
      // push-in, which is movement, and movement is exactly what was wrong.
      const tl = gsap.timeline({
        scrollTrigger: {
          start: 0,
          end: 3600,
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      // Measured off the target at matched offsets (desktop-004-y01200.png,
      // desktop-010-y03000.png): by the time the story chapter arrives the
      // figure is an unreadable tonal mass, and it is still nearly fully
      // opaque. The softness comes from an enormous blur, NOT from fading —
      // fading it out would leave flat sand where the target has a warm,
      // occupied ground. So opacity barely moves.
      tl.fromTo(
        '[data-backdrop-img]',
        { filter: 'blur(0px)', opacity: 1 },
        { filter: 'blur(72px)', opacity: 0.92, ease: 'none', duration: 0.42 },
        0,
      )
        // Through the story chapters: settles to its resting softness and stays.
        .to(
          '[data-backdrop-img]',
          { filter: 'blur(96px)', opacity: 0.85, ease: 'none', duration: 0.58 },
          0.42,
        );

      // Retire before the dark work chapter takes the screen. In the target the
      // portrait is gone by then (desktop-018-y05400.png) — leaving it behind a
      // dark section would read as a smudge rather than a ground.
      //
      // Tied to the section itself, not an absolute scroll position, so adding a
      // chapter above it cannot strand the fade at the wrong offset. Resolved via
      // document, NOT a selector string: gsap.context scopes selector text to the
      // backdrop layer, where #work does not exist.
      const work = document.getElementById('work');
      if (work) {
        gsap.to('[data-backdrop-img]', {
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: work,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });

        // ...and return once the work chapter is behind us.
        gsap.to('[data-backdrop-img]', {
          opacity: 0.85,
          ease: 'none',
          scrollTrigger: {
            trigger: work,
            start: 'bottom 80%',
            end: 'bottom 40%',
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });
      }
    },
    { minWidth: 0 },
  );

  return (
    <div
      ref={layer}
      data-intro="portrait"
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] flex justify-center overflow-hidden"
    >
      <Image
        data-backdrop-img
        src="/media/profile/portrait-cutout.png"
        alt=""
        width={1208}
        height={1800}
        priority
        sizes="(max-width: 1024px) 110vw, 820px"
        style={{ willChange: 'filter, opacity' }}
        className="h-[78svh] w-auto self-end object-contain object-bottom lg:h-[96svh]"
      />
    </div>
  );
}
