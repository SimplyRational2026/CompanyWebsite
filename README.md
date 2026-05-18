# Simply Rational

Marketing site for Simply Rational, built with the Next.js App Router and an animated hero composed in Framer Motion.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, React Server + Client Components)
- [React 19](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Framer Motion](https://motion.dev) (via the `motion` package)
- Fonts: Geist, Noto Serif JP, Bricolage Grotesque (loaded with `next/font`)

## Getting started

Requires Node.js 18.18+ (Node 20 LTS recommended).

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command          | Description                                |
| ---------------- | ------------------------------------------ |
| `npm run dev`    | Start the dev server                       |
| `npm run build`  | Production build                           |
| `npm run start`  | Run the production build locally           |
| `npm run lint`   | Run ESLint                                 |

## Project structure

```
app/
  components/
    Hero.tsx        # Animated hero section
    Nav.tsx         # Top nav with morphing logo + CTA
  lib/
    anim.ts         # Shared easing and timeline constants
  globals.css       # Tailwind v4 theme tokens + base styles
  layout.tsx        # Root layout, font wiring
  page.tsx          # Renders <Hero />
public/
  simply-rational-logo.png
```

## Deployment

Designed to deploy to [Vercel](https://vercel.com) with zero configuration. `npm run build` produces a Next.js standalone output that runs anywhere Node 20+ is available.
