# Luxora

Luxora is a premium mobile-first e-commerce web app for phones and accessories. The storefront direction is cinematic at the top, restrained in its interface, and practical once customers start browsing.

## Stack

- React + Vite
- JavaScript
- Tailwind CSS
- No backend yet
- No API calls yet

## Getting Started

Install dependencies:

```bash
npm install
```

Start the local dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

On Windows PowerShell, if `npm` is blocked by script execution policy, use `npm.cmd` instead:

```bash
npm.cmd run dev
```

## Product Direction

Luxora should feel like a luxury gadget boutique:

- Cinematic premium storefront
- Apple-like restraint
- Dark atmospheric hero
- Clean practical shopping sections after the hero
- Premium, but not cluttered
- Strong first impression followed by an easy shopping flow

The homepage should not become a motion demo. Animation should support the shopping experience, not replace it.

## Project Guidance

Read these before building UI:

- [AGENTS.md](AGENTS.md) - repo working rules for coding, styling, performance, and verification.
- [docs/STYLE_DIRECTION.md](docs/STYLE_DIRECTION.md) - visual, brand, spacing, animation, and e-commerce usability direction.
- [docs/HOMEPAGE_PLAN.md](docs/HOMEPAGE_PLAN.md) - planned homepage sections and implementation notes.

## Future Animation Plan

These dependencies are intentionally not installed yet:

- GSAP for the hero and serious scroll storytelling.
- Motion for smaller UI transitions.
- Swiper for product carousels.

Add them only when the relevant feature is requested.

## Current Status

The repo is scaffolded with Vite, React, and Tailwind. The initial app shell is intentionally minimal so the Luxora storefront can be built from the documented direction.
