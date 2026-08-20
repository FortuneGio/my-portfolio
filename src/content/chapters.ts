/**
 * Chapter content for the fidelity rebuild.
 *
 * Mirrors ../../../design-loop-evidence/target/CHAPTER-MAP.md (which chapter becomes
 * what) and ../../../design-loop-evidence/target/JOURNEY-CONTENT.md (milestone copy).
 * Every factual string here is bounded by ../../../content/claims-and-evidence.md.
 *
 * Standing rules for anyone editing this file:
 *  - no invented metric, client, launch, testimonial, seniority or project total;
 *  - the confidential product is never named and its capabilities are never described;
 *  - work in progress is tensed as intent, never as something already achieved;
 *  - tool depth is graded honestly — not everything is "proficient".
 */

/* ============================================================
   Section registry — drives the rail nav and the scroll spy.
   Order here IS the order on the page.
   ============================================================ */

export interface Section {
  id: string;
  label: string;
}

export const sections: Section[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About me' },
  { id: 'journey', label: 'My journey' },
  { id: 'work', label: 'Projects' },
  { id: 'how-i-work', label: 'How I work' },
  { id: 'what-i-can-do', label: 'What I can do' },
  { id: 'tools', label: 'Tools' },
  { id: 'credentials', label: 'Credentials' },
  { id: 'faq', label: 'FAQ' },
];

/* ============================================================
   Left rail
   ============================================================ */

export const rail = {
  wordmark: 'GIO',
  /**
   * From content/profile.md. A self-description, not a claim of seniority.
   * Kept to two lines: the rail column has nine nav rows to fit inside one
   * viewport, and a four-line positioning paragraph pushed the stat cards out.
   */
  positioning: 'Software QA/QC and creative builder in Bali. Manual first, then automated.',
  email: 'giorgiowilsonwong@gmail.com',
  /**
   * Changed 20 August 2026 at Giorgio's direction: "the numbers 71 process posts
   * is ambiguous cuz there's nothing to show, better to put my actual number of
   * projects, what was it around 10? and for experience put 2 years."
   *
   * He was undercounting. `content/project-catalog.md` lists 23 entries; removing
   * the four low-priority university assignments (Java Student Records, Java
   * Shipment Tracking, DSAA Group Repository, Computational Statistics) and the
   * Media Studies Production Archive — which is an evidence layer behind other
   * work, not a project — leaves **18**. Each one is nameable, so the number
   * survives being asked "which ones?".
   *
   * "2+ years": his first documented project is The Flicker, August 2023, which
   * makes three years defensible. The "+" keeps his conservative figure honest
   * rather than understating a record he can evidence.
   */
  stats: [
    { value: '18', label: 'Projects\ndocumented' },
    { value: '2+', label: 'Years building\nand shipping' },
  ],
  /** The rail marquee carries tools, not clients. Giorgio has no clients. */
  marquee: [
    'Jira',
    'Claude Code',
    'GitHub',
    'VS Code',
    'Next.js',
    'React',
    'TypeScript',
    'Tailwind',
    'CapCut',
    'Canva',
    'Filmora',
    'Unreal Engine',
  ],
} as const;

/* ============================================================
   Chapter 2 — About me
   ============================================================ */

export const about = {
  eyebrow: 'Start manual, then automate',
  title: ['About Me (&)', 'My Journey'],
  lede: [
    'I started by filming things, then editing them, then building the things themselves.',
    'What happened in between is easier to show than to explain.',
  ],
  body: [
    'I test software for a living and I make things for the pleasure of it. Those two habits turn out to be the same habit: take something apart carefully enough to understand why it behaves the way it does, then put it back together better.',
    'The rule I work by is that I learn a process by hand before I let anything automate it. It is slower at the start and it has never once been the wrong call — you cannot judge what a tool got wrong if you never knew what right looked like.',
  ],
} as const;

/* ============================================================
   Chapter 3 — the journey curve
   Copy drafted in JOURNEY-CONTENT.md, claim boundaries noted per card.
   ============================================================ */

export interface Milestone {
  year: string;
  title: string;
  body: string;
  /** Long-form story shown in the Read more modal. */
  story: string[];
  links?: { label: string; href: string }[];
  /** Shown in the modal as an honesty note where the ledger requires one. */
  note?: string;
  /** A photograph from that period, shown in the modal. */
  photo?: { src: string; alt: string };
  /** The one-line change in him that the milestone is actually about. */
  learned: string;
}

/**
 * Rewritten 20 August 2026, second pass. Giorgio: "don't make my journey too
 * sentimental, i just enjoy creating, and exploring, and this QC job is honestly
 * me exploring because i love to learn and upskill."
 *
 * So the register changed: curious and cheerful rather than reflective. He is not
 * looking back on hard-won lessons, he is describing things he enjoyed doing and
 * wants to do more of. `learned` became what each step got him INTO, not what it
 * taught him about himself.
 *
 * Also split: Thompsonia and Revora were sharing one card, which he found odd —
 * a solo game engine build and an apparel label are not one story. They are now
 * separate milestones.
 */
export const milestones: Milestone[] = [
  {
    year: "'23",
    title: 'First briefs from actual strangers',
    body: 'Content Creator intern at NIEC, then two weeks of social-media work at HOKIbank. The first time the brief came from someone who was not me.',
    learned: 'Turns out making things for other people is more fun than making them for myself.',
    story: [
      'I had been making things for years, but always my own things, on my own schedule, judged by me. These were the first briefs handed to me by someone with an actual brand and an actual opinion about the result.',
      'At NIEC I dug through what short-form was doing that month, adapted it, and then acted in and edited four Reels. HOKIbank was two weeks of the same muscle somewhere else. Canva, CapCut, a lot of trial and error.',
      'I liked it immediately. Having someone waiting for the thing made it better, not more stressful, and I have been chasing that ever since.',
    ],
    links: [
      { label: 'NIEC Reels', href: 'https://www.instagram.com/reel/C1hIhMvPuPs/' },
      { label: 'NIEC Indonesia', href: 'https://www.instagram.com/niec_indonesia/' },
    ],
    photo: {
      src: '/media/experience/hokibank-team.jpg',
      alt: 'Giorgio with the HOKIbank team at the end of the two-week training',
    },
    note: 'On the Reels my part was idea creation, acting and editing — three things, not the whole production.',
  },
  {
    year: "'23–'25",
    title: 'Two years of showing my working',
    body: '71 posts across two blogs — research, storyboards, location plans, edit breakdowns, and the bits that went wrong.',
    learned: 'I would rather show the whole process than just the finished poster.',
    story: [
      'Media Studies wanted documentation. I could have written it afterwards, tidied, with everything looking intentional. I wrote it as I went instead, because that was more interesting.',
      'So the archive has shot lists that did not survive the location, edits I argued myself out of, and reflections on what did not work. Seventy-one posts of it.',
      'It is still the best evidence of how I actually work, and I like that it is all out in the open rather than polished into something tidier than the truth.',
    ],
    links: [
      { label: 'A/AS Level archive', href: 'https://giorgiowilsonwongms.blogspot.com/' },
      { label: 'Earlier archive', href: 'https://giorgiowilsonwong.blogspot.com/' },
    ],
    note: 'An evidence library behind a handful of projects, not 71 separate works.',
  },
  {
    year: "'24",
    title: 'Built a horror game to see if I could',
    body: 'Thompsonia — a first-person maze in Unreal Engine for STEM Week. Environment, interactions, collectibles, level flow and UI, all solo.',
    learned: 'Games are just another thing you can make, and I want to make more of them.',
    story: [
      'Nobody asked for a game. STEM Week needed something and I had never touched Unreal Engine, which was reason enough.',
      'I built the environment, the interactions, the collectibles, the level flow and the UI, on my own, before I had ever used AI to help write a line of code. It is rough around the edges and I finished it anyway.',
      'It is the project that made software feel like the same activity as everything else I do — you decide what should exist, then you go and make it exist. I would very much like to build more games.',
    ],
    note: 'A school-week project, not a commercial release. The full build is held locally.',
  },
  {
    year: "'24",
    title: 'Started a clothing label, then called it',
    body: 'Revora — techpack, printed prototype, website, and a proposal I presented to the school office myself.',
    learned: 'Knowing when a thing is not good enough yet is its own useful skill.',
    story: [
      'Revora was mine — nobody set it. The first time I took something all the way from a drawing to a garment I could hold: techpack, coordinating the printing, building the site, and then pitching it to the school office in person because I wanted it to actually exist.',
      'Then I stopped it. Not because it fell apart, but because it was not good enough to put my name on and sell to people.',
      'I do not think of it as the one that failed. It taught me the production side end to end, and I used all of it again later on the apparel work I am doing now.',
    ],
    links: [
      { label: 'Revora site', href: 'https://fortunegio.github.io/revoraapparel/index.html' },
      { label: 'Revora repository', href: 'https://github.com/FortuneGio/revoraapparel' },
    ],
    photo: {
      src: '/media/projects/revora/shirt-1.jpg',
      alt: 'A produced Revora shirt showing the printed back graphic',
    },
    note: 'Revora is pre-launch. No approval, launch, sale or customer — stopping was the decision.',
  },
  {
    year: "'25",
    title: 'Added the computer science half',
    body: 'Finished at Regents in May, started a B.Sc. in Computer Science at BINUS in August, and kept making things throughout.',
    learned: 'I did not want to choose between the creative side and the technical one, so I did not.',
    story: [
      'Everyone assumed I would go further into film. I picked data structures and algorithms instead — mostly because I was worse at it, and that seemed like the more interesting direction.',
      'It was never a swap. Web development is creative work; so is building a game; so is figuring out why a piece of software behaves the way it does. The degree just gave me more ways in.',
      'I kept the films and the apparel running the whole time, which is busy and completely worth it.',
    ],
    photo: {
      src: '/media/about/studio-chair.jpg',
      alt: 'Giorgio, studio portrait from around the time he started at BINUS',
    },
    note: 'Active student, expected 2030 — not a completed degree.',
  },
  {
    year: "'26",
    title: 'QA, which is more creative than it sounds',
    body: 'Software QA/QC at Five Digital since July. Testing, reproducible reports, and an internal Help Center built in a single workday.',
    learned: 'Breaking software on purpose is a genuinely fun way to learn how it is built.',
    story: [
      'I took the job to learn, and it has delivered. Working out how a product is put together by trying to break it is a fast way to understand software, and writing it up so a senior developer can act on it is its own craft.',
      'I did the whole process manually for weeks before automating any of it. By week three that understanding turned into my own way of working — AI wired in through connected tools and extensions, taking the repetition and leaving the judgement to me.',
      'And then someone asked for a Help Center one morning and I had a searchable, responsive one live before 6 PM. That day was the most fun I have had at work.',
    ],
    links: [{ label: 'Five Digital', href: 'https://fivedigital.sg/' }],
    photo: {
      src: '/media/about/headphones-coffee.jpg',
      alt: 'Giorgio working, 2026',
    },
    note: 'The Help Center itself is internal. The public demo in Projects is an unrelated fictional recreation built to show the same craft.',
  },
  {
    year: "'26",
    title: 'What I actually want to build',
    body: 'A fellowship site growing across regions, and an apparel line for the Bali youth. Both running now, both unfinished.',
    learned: 'The best version of this is making things that land with people I know.',
    story: [
      'The Revival Fellowship site is growing from one site into something meant to serve several regions, with leaders managing their own content instead of waiting on me. Designing myself out of it is the goal.',
      'Alongside it, the apparel line for the Bali youth. The design system and the 2026 jacket are done, the first batch has been sampled, and previews have gone to the Singapore and Netherlands assemblies. Production and selling are the plan, not something already done.',
      'The bit I keep coming back to: one of my films was screened at the Bali youth camp, and the room laughed in the right places. That is the whole reward. Apps, sites, games, films, apparel — I do not much mind which, as long as it reaches people and does some good.',
    ],
    links: [
      {
        label: 'Revival Fellowship Indonesia',
        href: 'https://revival-fellowship-indonesia.giowong25.chatgpt.site/',
      },
    ],
    // The closing milestone is about making things that reach people, so it
    // shows the people rather than the jacket spec sheet it used to.
    photo: {
      src: '/media/projects/revival-camp-2.jpg',
      alt: 'The Bali youth wearing the produced Discipleship shirts at camp',
    },
    note: 'Sampled and previewed are steps toward production. No launch, order, sale or partnership is implied.',
  },
];
/* ============================================================
   Chapter 4 — projects, as a horizontal track
   ============================================================ */

export interface ProjectMedia {
  kind: 'image' | 'video' | 'collage';
  src: string;
  /** Video only — the still shown before play. */
  poster?: string;
  /** Collage only — the two supporting frames beside the main one. */
  extra?: string[];
}

export interface Project {
  index: string;
  name: string;
  blurb: string;
  tags: string[];
  href?: string;
  /**
   * Why there is no link, in this project's own terms. Without it every
   * unlinked card said "Local build — not published", which is true of a game
   * build and nonsense on an apparel line.
   */
  noLinkNote?: string;
  /** Kept honest: what Giorgio actually did, where credit is shared. */
  role: string;
  media?: ProjectMedia;
  /** Works collected under one card, each with its own credit line. */
  subItems?: { label: string; href: string; note: string }[];
}

/**
 * Restructured at Giorgio's direction, 20 August 2026:
 *   "For projects better focus on web designs i did, for beyond the belt,
 *    wedding video, newman's ect should just be one project under YouTube —
 *    film creation, ect."
 *
 * So the web builds lead, and the five separate film entries collapse into a
 * single Film & video card whose links point at the individual films. That is
 * also more honest about proportion: five film cards next to two web cards made
 * a QA/web candidate look like a film graduate.
 */
export const projects: Project[] = [
  {
    index: '01',
    name: 'Revival Fellowship Indonesia',
    blurb:
      'A live website for a real organisation. Visual direction, information architecture, how the creative work is presented, and round after round of UX changes made with the people who actually use it.',
    tags: ['Web', 'IA', 'Stakeholders'],
    role: 'Design and build',
    href: 'https://revival-fellowship-indonesia.giowong25.chatgpt.site/',
    media: { kind: 'image', src: '/media/projects/revival-fellowship-site.png' },
  },
  {
    index: '02',
    name: 'Internal Help Center',
    blurb:
      'Requested one morning, searchable and responsive and live before 6 PM the same day. The real one is internal, so the link opens an unrelated fictional recreation built to show the same craft.',
    tags: ['HTML/CSS/JS', 'Docs', 'UX'],
    role: 'Sole builder',
    // The actual filename — there is no index.html in that folder. Verified
    // against site/public/media/projects/help-center-demo/.
    href: '/media/projects/help-center-demo/arcline-museum-visitor-guide.html',
    media: { kind: 'image', src: '/media/projects/help-center-preview.png' },
  },
  {
    index: '03',
    name: 'Revora Apparel',
    blurb:
      'A clothing label taken from techpack to printed prototype, with a website and a proposal I presented to the school office myself. Pre-launch — and it stopped there on purpose.',
    tags: ['Brand', 'Web', 'Product'],
    role: 'Techpack, print coordination, web, pitch',
    href: 'https://fortunegio.github.io/revoraapparel/index.html',
    media: { kind: 'image', src: '/media/projects/revora/shirt-1.jpg' },
  },
  {
    index: '04',
    name: 'Film & video',
    blurb:
      'A narrative film, a wedding cut during the event itself, a documentary, and the shorter pieces around them. All on the channel.',
    tags: ['Directing', 'Editing', 'Colour'],
    role: 'Director, camera and editor across the set — some credits shared',
    href: 'https://www.youtube.com/@giorgiowong',
    /*
     * A collage rather than a single still. Giorgio, 20 August 2026: "This
     * project card is kinda odd, do you lack media or could you fix with any
     * ideas you have."
     *
     * The media exists; the problem was using one portrait-shaped film poster to
     * fill a 16:10 slot, which cropped it to a strip of its own title. Six works
     * sit behind this card, so the cover shows three of them — the poster kept
     * whole beside two behind-the-scenes frames.
     */
    /*
     * Behind-the-scenes only. Giorgio, 21 August 2026: "Since all the projects
     * have its respective cards when opened feature, have the main card have BTS
     * photos only, so remove the beyond the belt thumbnail on the main one."
     *
     * Right call — the poster now leads its own card, so repeating it here was
     * saying the same thing twice. The set-photos say something the posters
     * cannot: that there was a crew and a day and a lot of standing around.
     */
    media: {
      kind: 'collage',
      src: '/media/projects/beyond-the-belt-bts.jpg',
      extra: ['/media/projects/newmans-bts.jpg', '/media/projects/jmuse-bts.jpg'],
    },
    // A single card with several works behind it, rather than five cards that
    // would drown the web work this portfolio is actually arguing for.
    subItems: [
      { label: 'Beyond the Belt', href: 'https://youtu.be/Rut49Xofxag', note: 'Director, sole camera, lead edit — editing credit shared with Divo' },
      { label: 'Wedding same-day film', href: 'https://youtu.be/Ddo-sRad62s', note: 'Filmed and cut during the event, screened the same night' },
      { label: "Newman's Plot", href: 'https://youtu.be/53LYU3OOTl0', note: 'Director and editor — script credited to Carrick Thring and Jaden Mutty' },
      { label: 'Leave the Door Open', href: 'https://youtu.be/O0L27q0Kumw', note: 'Full music-video edit; digipak led by Carrick Thring and Jaden Mutty' },
      { label: 'Lessons from Samson', href: 'https://youtu.be/fneTwfgievM', note: 'Script through final edit' },
      { label: 'Slowliving in Bali', href: 'https://youtu.be/zuTnqzinqOs', note: 'Vlog production, editing the strongest part' },
    ],
  },
  {
    index: '05',
    name: 'Thompsonia',
    blurb:
      'A first-person horror maze in Unreal Engine, built alone for STEM Week — environment, interactions, collectibles, level flow and UI. Made before I had ever used AI to write code.',
    tags: ['Unreal', 'Game', 'Solo'],
    role: 'Sole developer',
    noLinkNote: 'Playable build held locally — not published',
    media: { kind: 'video', src: '/media/projects/thompsonia-gameplay.mp4', poster: '/media/projects/thompsonia-title.png' },
  },
  {
    index: '06',
    name: 'Revival Apparel 2026',
    blurb:
      'A design system and a jacket for the Bali youth. The first batch has been sampled and previews have gone to the Singapore and Netherlands assemblies. Production and selling are the plan, not the past tense.',
    tags: ['Brand', 'Apparel', 'In progress'],
    role: 'Design system, garment design, decks',
    noLinkNote: 'First batch sampled — no public storefront yet',
    /*
     * Real garments on real people, staged 20 August 2026 once Giorgio dropped
     * the camp photographs in. This is what the card was waiting for — a deck
     * render shows the design, but the produced shirts being worn at the Bali
     * youth camp show that it exists.
     *
     * Sourced from optional-media/.../camp-photos/ via scripts/stage-media.mjs,
     * which auto-discovers that folder. Consent confirmed by Giorgio, who is a
     * member of the fellowship pictured.
     */
    media: {
      kind: 'collage',
      src: '/media/projects/revival-camp-1.jpg',
      extra: ['/media/projects/revival-camp-3.jpg', '/media/projects/revival-camp-4.jpg'],
    },
  },
  {
    index: '07',
    name: 'FitBuddy',
    blurb:
      'A university HCI study — PACT analysis, accessibility and privacy thinking, user segmentation, and a full interface designed around them. Static screens, not a working app.',
    tags: ['UX', 'HCI', 'Academic'],
    role: 'Individual assignment',
    href: 'https://canva.link/r5hs64zxl5n9bsn',
    media: { kind: 'image', src: '/media/projects/fitbuddy-board.png' },
  },
];

/**
 * The films, as individual project cards.
 *
 * Giorgio, 20 August 2026: "films is all in one card, that's fine but there
 * should be a button like a '>' to show all the cards in its own respective
 * cards." So the single card stays as the default and expands into these.
 *
 * Credit lines are per-work and unchanged — collapsing them into one card never
 * licensed blurring who did what.
 */
export const filmWorks: Project[] = [
  {
    index: '04a',
    name: 'Beyond the Belt',
    blurb:
      'A narrative film for church — directing, sole camera, the lead edit and coordinating the production, with a major hand in the story.',
    tags: ['Directing', 'Camera', 'Edit'],
    role: 'Director, camera, lead editor — editing credit shared with Divo',
    href: 'https://youtu.be/Rut49Xofxag',
    media: { kind: 'image', src: '/media/projects/beyond-the-belt-poster.webp' },
  },
  {
    index: '04b',
    name: 'Wedding same-day film',
    blurb:
      'Filmed the wedding, cut it during the event, and played the finished film to the room the same night. One person, no second chances.',
    tags: ['Filming', 'Edit', 'Deadline'],
    role: 'Sole filming and editing',
    href: 'https://youtu.be/Ddo-sRad62s',
    media: { kind: 'video', src: '/media/projects/wedding-cut.mp4', poster: '/media/projects/wedding-bts.jpg' },
  },
  {
    index: '04c',
    name: "Newman's Plot",
    blurb:
      'A political-crime documentary. Directing and full responsibility for the edit, camera on the main reenactment shoot, and roughly twelve hours of post.',
    tags: ['Documentary', 'Edit'],
    role: "Director and editor — script credited to Carrick Thring and Jaden Mutty",
    href: 'https://youtu.be/53LYU3OOTl0',
    media: { kind: 'video', src: '/media/projects/newmans-cut.mp4', poster: '/media/projects/newmans-bts.jpg' },
  },
  {
    index: '04d',
    name: 'Leave the Door Open',
    blurb:
      'A music video cut end to end — beat markers, speed changes, effects and text animation, with footage I shot on my own phone.',
    tags: ['Music video', 'Edit'],
    role: 'Full edit — digipak led by Carrick Thring and Jaden Mutty',
    href: 'https://youtu.be/O0L27q0Kumw',
    media: { kind: 'video', src: '/media/projects/jmuse-cut.mp4', poster: '/media/projects/jmuse-bts.jpg' },
  },
];

/* ============================================================
   Chapter 5 — how I work
   ============================================================ */

export const howIWork = {
  eyebrow: 'How I work',
  statement: ['Manual first.', 'AI second.', 'Judgment always.'],
  /** Revealed word by word on scroll — see HowIWorkChapter. */
  revealed:
    'Learn the process by hand, find where it breaks, automate only the repetition, and say plainly which parts are finished.',
  steps: [
    {
      n: '01',
      title: 'Learn it by hand',
      body: 'I do the process manually until I understand why each step exists. You cannot review what a tool produced if you never knew what correct looked like.',
    },
    {
      n: '02',
      title: 'Find where it breaks',
      body: 'Testing is not clicking through the happy path. I go looking for the edge that nobody specified, then write it up so a developer can reproduce it without asking me anything.',
    },
    {
      n: '03',
      title: 'Automate the repetition',
      body: 'Once the shape of the work is clear, AI takes the parts that are repetitive and mechanical — never the parts that need a decision.',
    },
    {
      n: '04',
      title: 'Say what is actually true',
      body: 'Finished, in progress and intended are three different things. I label which is which, in my reports and on this site.',
    },
  ],
} as const;

/* ============================================================
   Chapter 6 — what I can do (replaces the target's priced Services)
   No prices, no packages. Giorgio is employed, not freelancing.
   ============================================================ */

export const capabilities = [
  {
    title: 'QA & testing',
    body: 'Functional and usability testing, bug discovery and reproduction, and issue reports a developer can act on without a follow-up conversation.',
    doing: [
      'Functional and usability testing',
      'Reproducible issue documentation',
      'AI-assisted browser testing',
    ],
    provedBy: 'Software QA/QC at Five Digital, current role',
  },
  {
    /*
     * Reworded 20 August 2026. Giorgio: "doesn't really sound like what I do...
     * please don't say color grading and audio treatment cuz i honestly just
     * edit whatever until it looks good, i have no professional theory in that.
     * but i am such an incredible editor, storyteller, director."
     *
     * Fair — the old copy listed technique names from the Media Studies archive
     * and made him sound like a colourist. He is not one and does not claim to
     * be. What he actually does is decide what the story is and cut until it
     * lands, which is the harder and more interesting claim anyway.
     */
    title: 'Film & storytelling',
    body: 'Directing and editing, mostly by instinct — I cut until it lands rather than working from theory. Deciding what the story is, and what to leave out, is the part I am good at.',
    doing: ['Directing and editing', 'Story and structure', 'Filming and short-form'],
    provedBy: "Beyond the Belt, Newman's Plot, Leave the Door Open, wedding same-day film",
  },
  {
    title: 'Web & documentation',
    body: 'Building sites and the documentation that makes them usable — design, information architecture, AI-assisted implementation and iteration with the people who use it.',
    doing: ['Site design and build', 'Information architecture', 'Internal documentation'],
    provedBy: 'Revival Fellowship site, one-workday Help Center, Revora',
  },
] as const;

/** Required by content/profile.md — availability may not be phrased as open for hire. */
export const availabilityNote =
  'I am employed full time. Availability for anything beyond that is to be discussed following role confirmation and coordination with my current employer.';

/* ============================================================
   Chapter 7 — tools (replaces the target's testimonial carousel)
   Graded honestly, as content/skills-and-tools.md requires.
   ============================================================ */

/**
 * Restructured 20 August 2026. Giorgio: "Tools section don't have the drag
 * animation eventhough it says it does."
 *
 * He was right, and the cause was arithmetic rather than code: three cards fit
 * inside a wide viewport, so there was nothing to scroll and the DRAG affordance
 * promised something the row could not do.
 *
 * Splitting by DOMAIN instead of by tier gives six cards, which overflow any
 * monitor, and reads better besides — "AI & assistants" says more than
 * "Use regularly". The tier survives as a badge on each card, because
 * content/skills-and-tools.md requires the honesty grading and explicitly
 * forbids labelling everything proficient.
 */
export const toolGroups = [
  {
    domain: 'AI & assistants',
    tier: 'Use regularly',
    note: 'Wired into the actual job, not tried once.',
    items: ['ChatGPT', 'ChatGPT Work', 'Claude Code', 'Codex', 'Cursor'],
    provedBy: 'The AI-assisted QA workflow at Five Digital, and this site',
  },
  {
    domain: 'QA & workflow',
    tier: 'Use regularly',
    note: 'Where the testing work actually happens.',
    items: ['Jira', 'GitHub', 'VS Code', 'Trello', 'Chrome Remote Desktop'],
    provedBy: 'Daily use at Five Digital — issue reports, tracking, review',
  },
  {
    domain: 'Video & post',
    tier: 'Use regularly',
    note: 'Years of it, under real deadlines.',
    items: ['CapCut', 'Canva', 'Wondershare Filmora', 'OBS'],
    provedBy: "Beyond the Belt, Newman's Plot, Leave the Door Open, the wedding film",
  },
  {
    domain: 'Web build',
    tier: 'Working knowledge',
    note: 'I can build with these; I still look things up.',
    items: [
      'HTML',
      'CSS',
      'JavaScript',
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind',
      'Vercel',
      'Supabase',
      'Blogger',
    ],
    provedBy: 'Revival Fellowship site, the Help Center, Revora, the 71-post archive',
  },
  {
    domain: 'Data & computer science',
    tier: 'Explored',
    note: 'Coursework and personal projects, not production experience.',
    items: [
      'Java',
      'OOP',
      'Python',
      'Colab',
      'NumPy',
      'pandas',
      'Matplotlib',
      'scikit-learn',
      'KMeans',
      'GMM',
      'PCA',
    ],
    provedBy: 'BINUS assignments — data structures and computational statistics',
  },
  {
    domain: 'Game & 3D',
    tier: 'Explored',
    note: 'One finished thing, built alone, before I used AI to code.',
    items: ['Unreal Engine'],
    provedBy: 'Thompsonia — environment, interactions, level flow and UI',
  },
] as const;

/* ============================================================
   Chapter 8 — credentials (replaces the target's FAQ accordion)
   ============================================================ */

export interface Credential {
  title: string;
  issuer: string;
  period: string;
  detail: string;
  /** Kept visible where the ledger requires a limit to be stated. */
  caveat?: string;
  /** The certificate or record itself, shown when the row expands. */
  image?: { src: string; alt: string };
}

/* ============================================================
   Chapter 9 — FAQ

   Added at Giorgio's direction, 20 August 2026: "For the FAQ is missing, make up
   question that can be answered like for example the nda question i can answer."

   The earlier decision to drop the FAQ is therefore reversed. The constraint that
   replaces it: a question may only be asked here if the ANSWER is true of
   Giorgio. Writing the target's kind of answer — "clients keep coming back" —
   would be fabrication, because he has no clients.

   Each answer below traces to content/claims-and-evidence.md, project-catalog.md
   or profile.md. Pitched at someone reading his CV, which is the actual audience.
   ============================================================ */

export interface Faq {
  q: string;
  a: string;
}

export const faqs: Faq[] = [
  {
    q: 'Do you work under NDA?',
    a: 'Yes — my current role involves work I cannot show, and the way this site handles it is the honest answer to the question. The Help Center I built is real and internal, so instead of showing it I built an unrelated fictional recreation to demonstrate the same craft, and I say so on the card rather than letting you assume. I am comfortable signing an NDA before we discuss anything specific.',
  },
  {
    q: 'You are studying full time. How does that work alongside a job?',
    a: 'The degree at BINUS is active and expected in 2030, and I work full time at Five Digital alongside it. It is not a coincidence that both are possible — the coursework is data structures, algorithms and statistics, and the job is testing software. They feed each other more than they compete. I have been running both since starting the role.',
  },
  {
    q: 'What does QA actually mean day to day for you?',
    a: 'Functional and usability testing, finding the edge nobody specified, and writing it up so a senior developer can reproduce it without coming back to ask me questions. The reports are the part people underrate — a bug nobody can reproduce is not a finding, it is a rumour.',
  },
  {
    q: 'You mention AI a lot. Are you just letting it do the work?',
    a: 'The opposite, and it is the principle the whole site is built on: I learn a process by hand before I let anything automate it. I spent my first weeks doing the manual QA workflow before wiring AI into any of it. You cannot review what a tool produced if you never knew what correct looked like. AI removes the repetition; the judgement stays mine.',
  },
  {
    q: 'Your background is films and apparel. Why should I read that as engineering?',
    a: 'Because the habit is the same one. A 12-hour edit, a techpack that has to survive a printer, and a bug report a developer can act on are all the same exercise: understand the thing well enough to know what breaks it. The Media Studies archive is 71 posts of that working-out done in public, including the parts that failed.',
  },
  {
    q: 'How much of this did you build yourself?',
    a: 'Every card says. Where credit is shared it names the person — the editing credit on Beyond the Belt, the script on Newman\'s Plot, the digipak on Leave the Door Open. Thompsonia and the Help Center were solo. I would rather tell you exactly where my part ended than round it up.',
  },
  {
    q: 'Are you available for freelance or project work?',
    a: 'I am employed full time, so anything beyond that is to be discussed following role confirmation and coordination with my current employer. If you are hiring rather than commissioning, that conversation is much simpler — WhatsApp is the fastest way to reach me.',
  },
  {
    q: 'What are you working on right now?',
    a: 'Two things outside the job. The Revival Fellowship site is growing from one site into something meant to serve several regions, with leaders managing their own content. And an apparel line for the Bali youth — the design system and the 2026 jacket are done and the first batch has been sampled. Production and selling are the plan, not something I have already done.',
  },
];

/**
 * Corrected 20 August 2026. Giorgio: "credentials data is ineffective and
 * inaccurate, i dislike it. The data in credentials is wrong."
 *
 * Both true, and the errors were mine:
 *   - the Regents row carried a BINUS academic-status image;
 *   - the HOKIbank row carried the team photograph instead of the certificate,
 *     when the photograph belongs in the journey (it now does);
 *   - the chapter listed only schooling, which is the least useful thing a
 *     hiring manager wants first.
 *
 * Every date below is taken from content/experience.md and content/cv-source.md
 * rather than from memory. Regents has no certificate in the media set, so it
 * carries no image rather than a borrowed one.
 */
export const credentials: Credential[] = [
  {
    title: 'Software QA/QC',
    issuer: 'Five Digital, Singapore',
    period: '1 July 2026 — present',
    detail:
      'Functional and usability testing across web products, reproducible issue documentation in Jira, and findings communicated to senior developers. AI-assisted browser testing integrated in week three, after learning the manual process first.',
    caveat:
      'Client names, product data and internal metrics stay out of this site. What the role involves is describable; what it touches is not.',
  },
  {
    title: 'B.Sc. Computer Science',
    issuer: 'BINUS University',
    period: '2025 — expected 2030',
    detail:
      'Active, alongside full-time work. Java and object-oriented programming, data structures, Python, and computational statistics.',
    caveat: 'In progress — not a completed degree.',
    image: {
      src: '/media/credentials/binus-degree.png',
      alt: 'BINUS University Computer Science enrolment record',
    },
  },
  {
    title: 'Secondary education',
    issuer: 'Regents Secondary School, Denpasar',
    period: 'Graduated May 2025',
    detail:
      'Where the Media Studies archive and Thompsonia came from. Beyond the Belt was a church project and Revora a side project of my own — neither was set by the school, they just happened during it.',
    image: {
      src: '/media/credentials/regents-ijazah.png',
      alt: 'Indonesian secondary school graduation certificate (ijazah)',
    },
  },
  {
    title: 'Content Creator internship',
    issuer: 'NIEC Indonesia',
    period: '27 November — 8 December 2023',
    detail:
      'Short-form trend research adapted to the brand, plus acting in and editing four Reels that are still public.',
    image: {
      src: '/media/credentials/niec-certificate.jpg',
      alt: 'NIEC Indonesia Content Creator internship certificate',
    },
  },
  {
    title: 'On-the-Job Training',
    issuer: 'HOKIbank / PT BPR HOKI',
    period: 'Two weeks — certificate dated 6 December 2023',
    detail:
      'Social-media content work in Canva and CapCut, researching what was performing and adapting it to the brand.',
    image: {
      src: '/media/credentials/hokibank-certificate.jpg',
      alt: 'HOKIbank on-the-job training completion certificate, redacted',
    },
  },
  {
    title: 'Web3 fundamentals seminar',
    issuer: 'BINUS University',
    period: '2025',
    detail: 'A single seminar, attended and certificated.',
    caveat:
      'Attendance at one seminar. This is not Web3 experience and I do not present it as any — it is here because leaving it out would be its own kind of dishonesty about what the certificate pile contains.',
    image: {
      src: '/media/credentials/web3-seminar.png',
      alt: 'BINUS Web3 seminar certificate of participation',
    },
  },
];
