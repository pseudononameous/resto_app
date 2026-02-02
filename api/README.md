# RestoApp API (Node.js)

Express API for RestoApp. Structure follows **node_api_kit** (routes → controller → services, shared response utils). No database; acts as a read-only proxy to Shopify Admin API.

## Setup

```bash
cp .env.example .env
# Edit .env: set SHOPIFY_STORE_DOMAIN and SHOPIFY_ACCESS_TOKEN

npm install
npm run dev   # or npm start
```

Server runs at `http://localhost:8000`. API base path: `/api`.

## Endpoints

- `GET /api/v1/health` – health check
- `POST /api/v1/auth/register` – register (body: `email`, `password`, `name`)
- `POST /api/v1/auth/login` – login (body: `email`, `password`)
- `GET /api/v1/auth/me` – current user (requires `Authorization: Bearer <token>`)
- `GET /api/v1/shopify/shop` – shop details
- `GET /api/v1/shopify/products`, `.../products/:id`
- `GET /api/v1/shopify/orders`, `.../orders/:id`
- `GET /api/v1/shopify/inventory`, `customers`, `draft_orders`, `gift_cards`, `fulfillment_orders`, `product_feeds`, `analytics`
- `GET /api/v1/shopify/customers/:id`, `.../customers/:id/events`

Query params: `limit` (default 50, max 250), plus resource-specific (`status`, `ids`, `location_ids`, etc.).

## Stack

- Node 18+
- Express, cors, dotenv, axios, morgan
- Config in `config/`, response helpers in `utils/response/` (node_api_kit style)
