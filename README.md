# Luxora

Luxora is a premium mobile-first storefront for phones and accessories. The experience is cinematic at the top, restrained through the interface, and practical once customers start browsing.

## Tech Stack

- React + Vite
- JavaScript
- Tailwind CSS
- React Router
- GSAP only for the homepage hero
- Swiper only for featured products
- Motion for restrained UI polish

## Current Features

- Premium homepage with cinematic hero and practical shopping sections
- Product listing page using local mock data
- Product detail pages using local mock data
- Frontend-only cart with quantity controls and localStorage persistence
- Add-to-bag toast feedback
- Frontend-only checkout request placeholder
- Support page placeholder

## Frontend-Only Status

Luxora does not have a backend yet. There are no API calls, authentication, payment processing, checkout processing, inventory services, or database connections.

The cart is stored locally in the browser. The checkout page creates a local request preview only and does not submit data to a server.

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

## Project Guidance

Read these before making UI or architecture changes:

- [AGENTS.md](AGENTS.md)
- [docs/STYLE_DIRECTION.md](docs/STYLE_DIRECTION.md)
- [docs/HOMEPAGE_PLAN.md](docs/HOMEPAGE_PLAN.md)

## Design Direction

Luxora should feel like a luxury gadget boutique:

- Cinematic premium storefront
- Apple-like restraint
- Dark atmospheric hero
- Clean practical shopping sections after the hero
- Premium, but not cluttered
- Strong first impression followed by an easy shopping flow

Animation should support the shopping experience. GSAP belongs only in the hero, Swiper belongs only in featured products, and Motion should remain subtle.
