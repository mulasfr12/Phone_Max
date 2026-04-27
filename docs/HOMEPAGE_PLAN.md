# Luxora Homepage Plan

## 1. Navbar

### Purpose

Provide immediate orientation and access to core shopping actions: categories, search, cart, and account entry points when needed.

### Visual Style

Minimal, sharp, and premium. Use a transparent or dark overlay treatment on top of the hero, then transition to a practical readable state as the page scrolls or moves into lighter sections.

### Animation Intensity

Low. Use subtle hover, focus, and optional background transition behavior later.

### Implementation Notes

- Build mobile-first.
- Prioritize logo, menu, search, and cart.
- Keep labels short.
- Use semantic `nav`.
- Do not overload the first version with complex mega-menu behavior.

## 2. Cinematic Hero

### Purpose

Create Luxora's premium first impression and frame the store as a curated destination for phones and accessories.

### Visual Style

Dark, atmospheric, product-led, and restrained. The hero should feel cinematic without hiding the core commerce message. Use strong imagery, confident typography, and one primary shopping action.

### Animation Intensity

Medium to high later, but only in this section. This is the correct place for GSAP if serious reveal or scroll storytelling is requested in the future.

### Implementation Notes

- Do not add GSAP yet.
- Keep the primary call to action visible and usable.
- Ensure mobile composition is strong and not overly cropped.
- Avoid putting hero text inside a card.
- Let the next shopping section be hinted below the fold when practical.

## 3. Quick Category Access

### Purpose

Move users from brand impression into shopping quickly. Give fast access to phones, cases, chargers, audio, wearables, and featured accessories.

### Visual Style

Clean, practical, and image-forward. Use compact category tiles or horizontal mobile-friendly access patterns.

### Animation Intensity

Low. Simple hover, press, or reveal states are enough.

### Implementation Notes

- Make categories usable on small screens.
- Avoid hiding critical categories in a carousel for the first version.
- Keep category names clear.
- Use real product/category imagery when assets are added.

## 4. Featured Products

### Purpose

Show the products customers are most likely to browse first and establish the store's merchandising quality.

### Visual Style

Premium but functional product grid. Product imagery should lead; text should be compact and scannable.

### Animation Intensity

Low to medium. Product cards can use subtle hover states and small UI transitions later.

### Implementation Notes

- Use local static product data until a backend exists.
- Include product name, concise spec cue, price, and action.
- Keep cards consistent in height and layout.
- Avoid visual clutter from badges and excessive metadata.
- Swiper may be introduced later only if a carousel is specifically requested.

## 5. Campaign / Promo Banner

### Purpose

Highlight a premium campaign, seasonal collection, bundle, or limited offer without making the page feel like a discount marketplace.

### Visual Style

Editorial and polished. Use restrained promotional copy, strong imagery, and a clear action.

### Animation Intensity

Low. A simple image reveal or hover treatment is enough for the first implementation.

### Implementation Notes

- Keep promotion language calm and specific.
- Avoid loud sale graphics.
- Make the banner responsive and readable.
- Ensure the call to action is close to the offer.

## 6. Trust Strip

### Purpose

Reassure shoppers with concise service promises such as secure checkout, fast delivery, warranty support, and easy returns.

### Visual Style

Compact, clean, and highly scannable. This should feel like useful commerce infrastructure, not a decorative section.

### Animation Intensity

Very low. Static is acceptable.

### Implementation Notes

- Use short labels and small supporting text.
- Use icons when available.
- Keep the strip readable on mobile.
- Avoid long paragraphs.

## 7. Brand Row

### Purpose

Show the ecosystem of premium device and accessory brands Luxora carries or plans to carry.

### Visual Style

Quiet, balanced, and monochrome or lightly muted. Brand presentation should support trust without stealing attention from products.

### Animation Intensity

Very low. Optional subtle marquee behavior can be considered later, but static is preferred initially.

### Implementation Notes

- Keep brand marks aligned and consistent.
- Use text placeholders until real brand assets are available.
- Do not make this section taller than necessary.

## 8. Footer

### Purpose

Provide practical navigation, customer support links, legal links, and brand closure.

### Visual Style

Calm, structured, and premium. It can return to a darker tone while staying readable.

### Animation Intensity

None to very low.

### Implementation Notes

- Include core columns such as Shop, Support, Company, and Legal when needed.
- Keep mobile layout simple.
- Include newsletter signup only if it does not distract from shopping.
- Use semantic `footer`.
