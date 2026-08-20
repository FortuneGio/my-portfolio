import type { Config } from 'tailwindcss';

// Tokens are locked in ../design-system.md. Do not change a value here without
// re-rendering the affected concept in design-loop-evidence/concepts/.
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ground: { DEFAULT: 'var(--ground)', raise: 'var(--ground-raise)' },
        ink: {
          DEFAULT: '#F2F5F8',
          dim: '#98A1B0',
          faint: '#7A8494',
          dark: '#11141A',
          'dark-dim': '#5A6472',
          'dark-faint': '#626A78',
        },
        cobalt: '#5B6CFF',
        signal: { test: '#FF5A47', ship: '#34C98A' },
        tee: '#C6D2DE',
        line: { DEFAULT: '#212734', strong: '#2E3644', light: '#D4DBE4' },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      transitionTimingFunction: {
        entrance: 'cubic-bezier(.22,1,.36,1)',
        land: 'cubic-bezier(.34,1.4,.64,1)',
      },
    },
  },
  plugins: [],
};
export default config;
