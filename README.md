# RestoApp

**Unified restaurant commerce platform** — mobile ordering, web ordering, and in-store kiosks with a single Laravel API and **Shopify as the system of record** for commerce data.

- **Frontend:** React (Vite, TypeScript, Mantine, React Query)
- **API:** Laravel (Unified API for Shopify, Stripe, DoorDash, etc.)

## Quick start

### Prerequisites

- PHP 8.2+, Composer, Node 20+
- (Optional) Docker

### 1. API (Laravel)

```bash
cd api
cp .env.example .env
php artisan key:generate
# Set Shopify in .env (see below)
composer install
php artisan migrate
php artisan serve
```

API runs at **http://localhost:8000**.

### 2. Frontend (React)

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs at **http://localhost:3000** (or 5173).

### 3. Shopify configuration

In `api/.env`:

```env
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_xxxx
SHOPIFY_API_VERSION=2024-01
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://127.0.0.1:5173
```

Create a **Shopify custom app** (or use Admin API access) to get an access token with scopes: `read_products`, `read_orders`, `read_shop`, (optional) `read_inventory`.

### 4. Run with Docker

From project root:

```bash
docker compose up --build
```

- API: http://localhost:8000  
- Frontend: http://localhost:3000  

Set Shopify env vars in `api/.env` or via Docker Compose `environment`.

### 5. Convenience scripts (local dev)

From project root:

```bash
chmod +x start-api.sh start-frontend.sh
./start-api.sh      # Terminal 1: API on http://localhost:8000
./start-frontend.sh # Terminal 2: Frontend on http://localhost:3000 (or 5173)
```

## API endpoints (v1)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/shopify/shop` | Shop details |
| GET | `/api/v1/shopify/products` | List products (`?limit=50`) |
| GET | `/api/v1/shopify/products/{id}` | Single product |
| GET | `/api/v1/shopify/orders` | List orders (`?limit=50&status=any`) |
| GET | `/api/v1/shopify/orders/{id}` | Single order |
| GET | `/api/v1/shopify/inventory` | Inventory levels |

All Shopify data is proxied through the Laravel API; the frontend never talks to Shopify directly.

## Project structure

```
resto_app/
├── api/                 # Laravel unified API
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   └── Services/ShopifyService.php
│   ├── config/shopify.php
│   └── routes/api.php
├── frontend/            # React SPA
│   └── src/
│       ├── pages/       # Dashboard, Shopify (products, orders, shop)
│       ├── services/api.ts
│       └── routes/
├── docker-compose.yml
└── README.md
```

## Roadmap

- Stripe (payment intents)
- DoorDash (delivery)
- Auth (Sanctum) and OMS
- Webhooks (Shopify → Laravel)
