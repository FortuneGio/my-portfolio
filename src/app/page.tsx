import { HeroPinned } from '@/components/HeroPinned';
import { HeroWordmark } from '@/components/HeroWordmark';
import { PortraitBackdrop } from '@/components/PortraitBackdrop';
import { SiteFurniture } from '@/components/SiteFurniture';
import { MobileNav } from '@/components/MobileNav';
import { IntroSequence } from '@/components/IntroSequence';
import { AboutChapter } from '@/components/AboutChapter';
import { JourneyChapter } from '@/components/JourneyChapter';
import { ProjectsChapter } from '@/components/ProjectsChapter';
import { HowIWorkChapter } from '@/components/HowIWorkChapter';
import { WhatICanDoChapter } from '@/components/WhatICanDoChapter';
import { ToolsChapter } from '@/components/ToolsChapter';
import { CredentialsChapter } from '@/components/CredentialsChapter';
import { FaqChapter } from '@/components/FaqChapter';

/**
 * Fixed layers, then the scrolling content, in paint order:
 *
 *   z-0   wordmark  — cropped graphic field, scales away over the hero pin
 *   z-[1] portrait  — never moves, only blurs; occludes the wordmark's middle
 *   z-10  <main>    — every chapter, riding over both
 *   z-30  rail      — persistent panel, fades in once the hero is past
 *
 * Giorgio, 20 August 2026: "ME is the background almost constantly throughout
 * the website." So the portrait sits outside <main>, fixed to the viewport, and
 * is the ground every chapter scrolls over rather than something the hero owns.
 *
 * The layers are siblings rather than nested because a pinned section becomes
 * `position: fixed`, and a fixed element is its own stacking context — anything
 * inside it cannot be interleaved with anything outside it.
 *
 * Chapter order and content mapping: design-loop-evidence/target/CHAPTER-MAP.md.
 */
export default function Home() {
  return (
    <>
      <HeroWordmark />
      <PortraitBackdrop />
      <SiteFurniture />
      <MobileNav />
      <IntroSequence />

      {/* pb clears the fixed mobile bar so the last chapter is not sat on */}
      <main id="main" className="relative z-10 pb-[72px] lg:pb-0">
        <HeroPinned />
        <AboutChapter />
        <JourneyChapter />
        <ProjectsChapter />
        <HowIWorkChapter />
        <WhatICanDoChapter />
        <ToolsChapter />
        <CredentialsChapter />
        <FaqChapter />
      </main>
    </>
  );
}
