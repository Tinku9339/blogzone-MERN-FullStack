/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
  soft: 'rgb(var(--ink-soft) / <alpha-value>)',
        },
        canvas: {
          DEFAULT: 'rgb(var(--canvas) / <alpha-value>)',
  panel: 'rgb(var(--canvas-panel) / <alpha-value>)',
  raised: 'rgb(var(--canvas-raised) / <alpha-value>)',
        },
        paper: {
          DEFAULT: 'rgb(var(--paper) / <alpha-value>)',
  dim: 'rgb(var(--paper-dim) / <alpha-value>)',
  line: 'rgb(var(--paper-line) / <alpha-value>)',
        },
        brass: {
          DEFAULT: '#C99A4A',
          light: '#E3BD7E',
          dim: '#8A6A32',
        },
        rust: {
          DEFAULT: '#C1543A',
          dim: '#8F3D29',
        },
        sage: {
          DEFAULT: '#7C9A78',
          dim: '#556B52',
        },
       muted: 'rgb(var(--muted) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        paper: '0 1px 0 rgba(0,0,0,0.04), 0 12px 28px -12px rgba(0,0,0,0.55)',
        glow: '0 0 120px 20px rgba(201,154,74,0.10)',
      },
      backgroundImage: {
        grain: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.035) 1px, transparent 0)",
        glow: 'radial-gradient(ellipse 60% 50% at 30% 0%, rgba(201,154,74,0.16), transparent 70%)',
      },
      backgroundSize: {
        grain: '4px 4px',
      },
    },
  },
  plugins: [],
}
