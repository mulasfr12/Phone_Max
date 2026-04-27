# Luxora Project Guidance

## Project Purpose

Luxora is a premium mobile-first e-commerce web app for phones and accessories. The experience should feel like a luxury gadget boutique: cinematic on first impression, restrained in detail, and practical once the customer starts shopping.

The homepage should open with atmosphere and confidence, then quickly become a clear shopping flow. Treat the site as a real storefront, not a visual effects demo.

## Technical Stack

- React with Vite.
- JavaScript, not TypeScript.
- Tailwind CSS for styling.
- No backend yet.
- No API calls yet.
- Do not add GSAP, Motion, Swiper, or other animation/carousel dependencies until specifically requested.

## Coding Style Rules

- Use functional React components.
- Keep components small, readable, and purpose-driven.
- Prefer clear prop names over clever abstractions.
- Use plain JavaScript modules and named exports where helpful.
- Keep state local unless multiple components truly need it.
- Avoid premature global state, data fetching layers, or routing complexity.
- Keep copy concise and premium without sounding vague or inflated.
- Use semantic HTML for navigation, sections, product lists, buttons, and links.

## Component Organization Rules

- Put reusable UI pieces in `src/components/`.
- Put page-level sections in `src/sections/` or a similar clearly named folder.
- Keep product data as local static data until a backend or API is introduced.
- Separate repeated product card, category tile, brand row, and trust strip elements into reusable components when they appear more than once.
- Keep homepage section order easy to scan in code and aligned with `docs/HOMEPAGE_PLAN.md`.
- Avoid deeply nested component trees for simple visual layouts.

## Tailwind Styling Rules

- Use Tailwind utility classes directly unless a pattern becomes repeated enough to justify extraction.
- Build mobile-first, then layer responsive refinements with Tailwind breakpoints.
- Use restrained spacing, clean alignment, and strong responsive constraints.
- Favor neutral surfaces, precise borders, soft shadows, and carefully placed highlights.
- Avoid noisy gradients, decorative blobs, and overly rounded card-heavy layouts.
- Use consistent max-width containers after the hero.
- Keep interactive targets comfortable on mobile.
- Make product information easy to scan: image, name, short spec cue, price, and action.

## Visual Direction Summary

- Cinematic premium storefront.
- Apple-like restraint.
- Luxury gadget boutique.
- Dark atmospheric hero.
- Clean practical shopping sections after the hero.
- Premium but not cluttered.
- Strong first impression followed by easy shopping flow.

## Performance Rules

- Keep the initial page lightweight.
- Use optimized image formats and sensible dimensions when adding assets.
- Avoid large animation libraries until the page actually needs them.
- Do not animate layout in ways that cause jank or make shopping harder.
- Prefer CSS transitions for simple hover, focus, and reveal effects.
- Keep above-the-fold content fast and readable.
- Lazy-load non-critical media when appropriate.

## Do-Not Rules

- Do not build the entire page as a motion showcase.
- Do not add a backend, API calls, authentication, checkout logic, or database code unless asked.
- Do not add GSAP, Motion, or Swiper yet.
- Do not make the homepage feel like a generic SaaS landing page.
- Do not bury shopping actions below excessive storytelling.
- Do not use cluttered product grids, loud discount styling, or cheap marketplace visual patterns.
- Do not introduce TypeScript unless explicitly requested.
- Do not add unrelated refactors while implementing UI.

## Verification Steps

Before handing off UI work:

1. Run the project lint or build command if available.
2. Start the Vite dev server and inspect the page on mobile and desktop widths.
3. Verify there is no horizontal scrolling on mobile.
4. Check that text does not overlap images, buttons, or adjacent sections.
5. Confirm the hero creates a strong first impression without blocking shopping flow.
6. Confirm product and category sections are usable without animation.
7. Check focus states and keyboard navigation for primary controls.
8. Ensure no unrequested dependencies were added.
