# Simply Rational

Marketing site built with Next.js, Tailwind CSS v4, and Framer Motion.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Copy `.env.example` to `.env.local` and fill in the values.

| Variable         | Required | Description                                        |
| ---------------- | -------- | -------------------------------------------------- |
| `RESEND_API_KEY` | Yes      | API key for sending contact emails via Resend      |
| `CONTACT_TO`     | No       | Recipient address (defaults to the gut-entscheiden inbox) |
| `CONTACT_FROM`   | No       | Verified sender address                            |

The contact form posts to `/api/contact`, which sends the message with [Resend](https://resend.com).
Verify the `simplyrational.de` domain in Resend and set `RESEND_API_KEY` in the deployment
environment (e.g. Vercel project settings). Without the key the endpoint returns a 500 and no email is sent.

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start the dev server     |
| `npm run build` | Production build         |
| `npm run start` | Run production locally   |
| `npm run lint`  | Run ESLint               |

## Structure

```
app/
  api/
    contact/route.ts      Contact form endpoint (Resend)
  components/
    sections/             Page sections (Hero, Nav, Risiko, Team, Footer, ...)
    ui/                   Reusable pieces (VideoPlayer, ContactForm, ContactModal, ...)
  lib/                    Animation timings, text fitting, scaling helpers
  globals.css
  layout.tsx
  page.tsx
public/                   Images, videos, PDFs
```
