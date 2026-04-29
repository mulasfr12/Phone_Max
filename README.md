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
- Frontend-only admin dashboard mockup for catalog, categories, and order requests
- Route-level lazy loading for page bundles
- ASP.NET Core API foundation with health, product/category browsing, and checkout request endpoints

## Current Integration Status

Luxora now has an ASP.NET Core backend foundation, but the React frontend still uses local mock data and does not call the API yet. There is no authentication, authorization, payment gateway integration, inventory service, email/SMS notification, or image upload flow.

The cart is stored locally in the browser. The checkout page creates a local request preview only and does not submit data to a server. Admin pages use mock/local data and do not persist product or order changes.

Backend checkout requests support `pay_on_delivery` and `manual_lipa_payment`, but no online payment is processed and manual LIPA payments are not automatically verified. Admin checkout request endpoints are currently unprotected and must be secured with authentication and authorization before production.

Product prices are stored as `priceCents` plus `currency` and formatted in the UI. Cart items store a `productId`, `quantity`, and a local product snapshot for frontend-only display.

## Routes

- `/` storefront homepage
- `/products` product listing
- `/products/:id` product detail
- `/cart` local cart
- `/checkout` local checkout request preview
- `/support` support placeholder
- `/admin` admin overview mockup
- `/admin/products` admin product list mockup
- `/admin/orders` admin order request mockup
- `/admin/categories` admin category mockup

## Getting Started

### Frontend

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

### Backend

Run the ASP.NET Core API:

```bash
dotnet run --project backend/Luxora.Api/Luxora.Api.csproj
```

Health endpoint:

```text
GET /api/health
```

Public storefront endpoints:

```text
GET /api/products
GET /api/products/{id}
GET /api/categories
GET /api/categories/{id}
POST /api/checkout-requests
```

Unprotected admin endpoints for backend development only:

```text
GET /api/admin/checkout-requests
GET /api/admin/checkout-requests/{id}
PATCH /api/admin/checkout-requests/{id}/status
PATCH /api/admin/checkout-requests/{id}/payment-status
```

Swagger is enabled in development:

```text
/swagger
```

MongoDB is configured in [backend/Luxora.Api/appsettings.json](backend/Luxora.Api/appsettings.json):

```json
"MongoDb": {
  "ConnectionString": "mongodb://localhost:27017",
  "DatabaseName": "LuxoraDb",
  "ProductsCollectionName": "products",
  "CategoriesCollectionName": "categories",
  "CheckoutRequestsCollectionName": "checkoutRequests"
}
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

Page routes are lazy-loaded with `React.lazy` and `Suspense` so heavier storefront/admin surfaces are loaded only when visited.

## Deployment Note

This app uses `BrowserRouter`. Production static hosting must route all unknown paths back to `index.html` so direct visits to routes like `/products/aura-x1` or `/admin/orders` work. On Vercel, use rewrites; on other static hosts, use the equivalent single-page app fallback.
