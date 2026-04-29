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

Luxora now has an ASP.NET Core backend foundation and selected frontend routes call the API. There is no customer authentication, payment gateway integration, inventory service, email/SMS notification, or image upload flow.

The cart is stored locally in the browser. Product browsing, checkout submission, and admin catalog/order pages can use the backend when it is running, with local preview fallbacks for development.

Backend checkout requests support `pay_on_delivery` and `manual_lipa_payment`, but no online payment is processed and manual LIPA payments are not automatically verified. Admin API endpoints require HttpOnly cookie-based admin authentication.

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

Create a local frontend env file from the example:

```bash
cp .env.example .env
```

Configure the backend API base URL:

```text
VITE_API_BASE_URL=http://localhost:5000/api
```

The product browsing pages use the backend when available and fall back to local preview data when the API cannot be reached. The homepage featured products, cart, checkout preview, and admin mockup still use local data for now.

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

Run MongoDB locally before starting the API. With Docker, one simple local option is:

```bash
docker run --name luxora-mongo -p 27017:27017 -d mongo:7
```

If you already have a local MongoDB instance, make sure it is reachable at the connection string in `appsettings.json`.

Run the ASP.NET Core API:

```bash
dotnet run --project backend/Luxora.Api/Luxora.Api.csproj
```

The frontend API client expects the backend to be running at `VITE_API_BASE_URL`. If your ASP.NET app uses a different local port, update `.env` and restart Vite.

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

Development-only seed endpoint:

```text
POST /api/dev/seed
```

`/api/dev/seed` is available only when the API runs in the Development environment. It inserts missing initial Luxora categories and products into MongoDB for local Swagger/API testing, and it does not overwrite existing records. It also creates one development-only admin account if missing:

```text
Email: admin@luxora.local
Password: ChangeMe123!
```

These credentials are for local development only and must never be used in production.

Before testing API-backed product or category data on `/products` and `/products/:id`, start MongoDB, run the backend, then call the seed endpoint once from Swagger or curl:

```bash
curl -X POST http://localhost:5000/api/dev/seed
```

Then run the frontend with `VITE_API_BASE_URL` set in `.env`. If the backend is unavailable, the product browsing pages fall back to local preview data and show a small notice.

To test checkout request submission:

1. Start MongoDB.
2. Run the ASP.NET backend.
3. Call `POST /api/dev/seed` so checkout item ids exist in MongoDB.
4. Set `VITE_API_BASE_URL` in `.env`.
5. Run the frontend.
6. Add products to the bag and submit `/checkout`.

The checkout form sends customer details, fulfillment preference, payment method, notes, and item `productId`/`quantity` pairs. It does not send the frontend subtotal as trusted data; the backend recalculates totals from MongoDB products. If the backend is unavailable, the page falls back to a local preview confirmation and clearly labels it as local-only.

`/admin/orders` can read and update backend checkout requests when the API is running. It supports local preview fallback when the backend is unavailable. Backend admin endpoints require an authenticated admin cookie.

`/admin/products` and `/admin/categories` can read, create, update, and delete backend catalog records when the API is running. If the backend is unavailable, both pages show local preview data with mutation actions disabled.

Admin fallback data is read-only. Create, edit, delete, and status mutation actions are disabled whenever an admin page is showing local preview data instead of backend data.

Admin auth endpoints:

```text
POST /api/auth/admin/login
POST /api/auth/admin/logout
GET /api/auth/admin/me
```

Admin endpoints require authentication:

```text
GET /api/admin/products
GET /api/admin/products/{id}
POST /api/admin/products
PUT /api/admin/products/{id}
DELETE /api/admin/products/{id}
GET /api/admin/categories
GET /api/admin/categories/{id}
POST /api/admin/categories
PUT /api/admin/categories/{id}
DELETE /api/admin/categories/{id}
GET /api/admin/checkout-requests
GET /api/admin/checkout-requests/{id}
PATCH /api/admin/checkout-requests/{id}/status
PATCH /api/admin/checkout-requests/{id}/payment-status
```

Admin auth uses an HttpOnly cookie named `Luxora.AdminAuth`. Frontend API requests must include credentials; the built-in API client does this with `credentials: 'include'`. Do not store admin tokens in localStorage.

Frontend admin routes are protected by `/admin/login`. On app load, the frontend calls `GET /api/auth/admin/me` to restore an existing admin session from the HttpOnly cookie. Login calls `POST /api/auth/admin/login`; logout calls `POST /api/auth/admin/logout`. The frontend does not store admin tokens in `localStorage` or `sessionStorage`.

The admin cookie currently uses `SameSite=Lax`, which is practical for local same-site development with Vite and the API. Production deployments with frontend and backend on different sites may require `SameSite=None` and `Secure=true`; review cookie domain, HTTPS, and CORS credentials settings before launch.

Admin authorization is intentionally simple for now: one `Admin` role. Production still needs hardened account management, password rotation, lockout/rate limiting, deployment-specific cookie domain/SameSite review, and removal of development seed credentials.

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
  "CheckoutRequestsCollectionName": "checkoutRequests",
  "AdminUsersCollectionName": "adminUsers"
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
