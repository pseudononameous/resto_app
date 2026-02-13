# RestoApp API (Node.js)

Express API for RestoApp. Structure follows **node_api_kit** (routes → controller → services, shared response utils). Unified restaurant commerce platform with MySQL.

## Setup

```bash
cp .env.example .env
# Edit .env: set DB_* and JWT_SECRET

npm install
npm run dev   # or npm start
```

Server runs at `http://localhost:8000`. API base path: `/api`.

## Endpoints

- `GET /api/v1/health` – health check
- `POST /api/v1/auth/register` – register (body: `email`, `password`, `name`)
- `POST /api/v1/auth/login` – login (body: `email`, `password`)
- `GET /api/v1/auth/me` – current user (requires `Authorization: Bearer <token>`)
- Public: `GET /api/v1/public/menu`, `/public/locations`, `/public/place-order`, etc.
- CRUD: orders, locations, delivery-zones, menus, products, categories, reservations, etc.

## Stack

- Node 18+
- Express, cors, dotenv, axios, morgan, Sequelize, MySQL
- Config in `config/`, response helpers in `utils/response/` (node_api_kit style)
