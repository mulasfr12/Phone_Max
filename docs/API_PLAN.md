# Luxora API Plan

## Planned Backend Stack

- ASP.NET Core Web API.
- Database choice is undecided: MongoDB or PostgreSQL are both viable.
- Product images should be added later through cloud storage, not stored directly in the database.
- The current frontend remains local/mock-data driven until API integration is explicitly started.

## Core Backend Modules

### Products

Manage the product catalog used by the storefront and admin product views.

### Categories

Manage storefront category groups and category metadata.

### Cart / Session Strategy

The current cart persists locally in the browser. A backend version should decide whether carts are anonymous-session based, authenticated-user based, or both.

### Checkout Requests / Orders

Store checkout request submissions from the frontend-only request flow. Payment processing is not included yet.

### Admin Dashboard

Provide operational data for products, categories, order requests, and order status updates.

### Authentication Later

Admin routes are not protected yet. Before production, admin authentication and authorization are required.

## Suggested API Endpoints

### Storefront

- `GET /api/products`
- `GET /api/products/{id}`
- `GET /api/categories`
- `POST /api/checkout-requests`

### Admin

- `GET /api/admin/orders`
- `PATCH /api/admin/orders/{id}/status`
- `POST /api/admin/products`
- `PUT /api/admin/products/{id}`
- `DELETE /api/admin/products/{id}`

## Product DTO Shape

Aligned with the current frontend product model:

```json
{
  "id": "aura-x1",
  "name": "Aura X1 Pro",
  "category": "Phones",
  "finish": "Graphite Titanium",
  "spec": "Titanium frame, 256GB, night lens system",
  "shortDescription": "A flagship phone tuned for low-light photography, daily speed, and a calmer premium feel.",
  "features": [
    "6.7-inch adaptive OLED display",
    "Night lens camera system"
  ],
  "priceCents": 119900,
  "currency": "USD",
  "inStock": true,
  "stockStatus": "in_stock",
  "visual": "phone",
  "tone": "from-zinc-950 via-zinc-800 to-slate-300"
}
```

Notes:

- `priceCents` should be the source of truth for pricing math.
- `currency` should use standard currency codes such as `USD`.
- `stockStatus` can support values such as `in_stock`, `low_stock`, `waitlist`, or `out_of_stock`.
- `visual` and `tone` are frontend-only presentation hints for the current CSS placeholder visuals. These may later be replaced or supplemented by real image fields.

## Checkout Request Shape

```json
{
  "customerName": "Alex Morgan",
  "phone": "+1 555 0184",
  "email": "alex@example.com",
  "fulfillmentPreference": "delivery",
  "notes": "Preferred delivery after 5 PM.",
  "items": [
    {
      "productId": "aura-x1",
      "quantity": 1
    }
  ],
  "subtotalCents": 119900,
  "currency": "USD"
}
```

Notes:

- `email` is optional.
- `fulfillmentPreference` should support at least `delivery` and `pickup`.
- The backend should recalculate subtotal from trusted product prices instead of trusting only the client subtotal.
- Payment is not implemented yet, so checkout requests should not be treated as paid orders.

## Current Frontend Notes

- The frontend currently uses local mock product, category, admin, and order-request data.
- The local cart stores `productId`, `quantity`, and a frontend-only product snapshot in `localStorage`.
- Admin routes are not protected yet.
- Before production, admin authentication is required.
- Payment is not implemented yet.
- Product images are not implemented yet; current product visuals are CSS placeholders.
