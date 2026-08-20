/**
 * Content is mirrored from ../../../content/portfolio-data.json, which is the
 * structured factual source. Wording is bounded by ../../../content/claims-and-evidence.md.
 *
 * Rules that apply to every string in this file:
 *  - no invented metrics, clients, launches, testimonials or seniority;
 *  - a `status` may only claim what the evidence ledger permits;
 *  - the confidential product is never named and its capabilities are never described.
 */

export type ProofStatus = 'verified' | 'private' | 'fiction' | 'concept';

export interface ProofRow {
  key: string;
  value: string;
  detail?: string;
  status: ProofStatus;
  statusLabel: string;
}

export const profile = {
  fullName: 'Giorgio Wilson Wong',
  location: 'Denpasar, Bali',
  heroLine: {
    lines: ['I turn ideas into', 'things you can click,', 'watch, test,'],
    emphasis: 'and use.',
  },
  lede:
    'Software QA/QC practitioner, creative builder, and AI enthusiast based in Bali. ' +
    'I learn the manual workflow, test it critically, then use AI to make the work faster and sharper.',
  principle: 'Manual first. AI second. Judgment always.',
  identity: 'Vibe coder, creative builder, AI enthusiast.',
  portrait: {
    src: '/media/profile/giorgio-wong-portrait.jpg',
    alt: 'Giorgio Wilson Wong, arms crossed, studio portrait on a black background',
    width: 1597,
    height: 2400,
  },
  whatsappUrl: 'https://wa.me/6285973796000',
  whatsappPrefill:
    'https://wa.me/6285973796000?text=' +
    encodeURIComponent(
      'Hi Gio, I saw your portfolio and would like to discuss a role/project with you.',
    ),
} as const;

export const nav = [
  { label: 'Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'Journey', href: '#journey' },
  { label: 'Contact', href: '#contact' },
] as const;

/** Both rows are permitted verbatim by content/claims-and-evidence.md. */
export const heroProof: ProofRow[] = [
  {
    key: 'Now',
    value: 'Software QA/QC at Five Digital',
    detail: '— July 2026 → present',
    status: 'verified',
    statusLabel: 'Verified',
  },
  {
    key: 'Shipped',
    value: 'Searchable internal Help Center, built in one workday',
    status: 'fiction',
    statusLabel: 'Demo inside',
  },
];

export const statusColor: Record<ProofStatus, string> = {
  verified: 'var(--signal-ship)',
  private: 'var(--signal-test)',
  fiction: 'var(--cobalt)',
  concept: 'var(--ink-faint)',
};
