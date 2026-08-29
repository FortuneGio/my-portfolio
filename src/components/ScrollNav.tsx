'use client';

import { useEffect } from 'react';

/**
 * Owns every in-page anchor jump — the rail nav, the mobile chip bar, the hero
 * nav and the skip-to-content link.
 *
 * Giorgio, 22 August 2026: "when clicking home it should bring you to the very
 * first page properly, right now is blurred" — with a screenshot of the page
 * stranded mid-transition: the wordmark half-scaled, the portrait mid-blur, the
 * headline half-faded. That is not a rendering bug, it is a REAL scroll position
 * — just not the one "Home" was supposed to land on.
 *
 * The cause: `html { scroll-behavior: smooth }` (added earlier so chapter jumps
 * did not read as a teleport) hands the scroll to the BROWSER's own smooth-scroll
 * implementation. Every scrubbed animation on this page — the portrait blur, the
 * wordmark scale, the rail flight — is a ScrollTrigger reading `window.scrollY`
 * on every frame. Two independent animation systems end up driving the same
 * value at once: on a jump this large (Home from deep in an ~15,000px page),
 * the browser's native scroll and GSAP's scrub easing chase each other rather
 * than converge, and depending on where the tab loses a frame the reader can be
 * left parked at whatever scrollY the browser's animation happened to settle on
 * mid-flight — which is exactly the half-blurred, half-scaled state in the
 * screenshot. This is GSAP's own documented warning about `scroll-behavior:
 * smooth` fighting ScrollTrigger; it is not something `refresh()` can fix,
 * because both sides think they own the scroll position.
 *
 * The fix is to let only ONE thing drive the scroll: GSAP's ScrollToPlugin,
 * which ScrollTrigger is already aware of. `scroll-behavior` goes back to `auto`
 * (see globals.css) and every hash click is intercepted here instead.
 */
export function ScrollNav() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const onClick = (e: MouseEvent) => {
      // Only plain left-clicks on same-page hash links — never hijack a new-tab
      // click, a modified click, or a link some other handler already handled.
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor || anchor.target === '_blank') return;

      const hash = anchor.getAttribute('href') || '';
      if (hash.length < 2) return; // bare "#"
      const id = decodeURIComponent(hash.slice(1));
      const target = document.getElementById(id);
      if (!target) return; // let the browser try, in case something else owns it

      e.preventDefault();

      // Keep the URL and browser history in sync without letting the browser
      // perform its own (conflicting) scroll for the hash change.
      if (window.location.hash !== hash) history.pushState(null, '', hash);

      if (reduced()) {
        target.scrollIntoView({ block: 'start', behavior: 'auto' });
        return;
      }

      (async () => {
        const { gsap } = await import('gsap');
        const { ScrollToPlugin } = await import('gsap/ScrollToPlugin');
        gsap.registerPlugin(ScrollToPlugin);

        // Distance-scaled duration: a jump across the whole page should not
        // take the same beat as one chapter down. Clamped so neither end is
        // jarring — under this a huge jump snaps, over it a short one drags.
        const distance = Math.abs(target.getBoundingClientRect().top);
        const duration = gsap.utils.clamp(0.5, 1.4, distance / 2600);

        gsap.to(window, {
          duration,
          ease: 'power2.inOut',
          scrollTo: { y: target, offsetY: 24, autoKill: true },
        });
      })();
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return null;
}
