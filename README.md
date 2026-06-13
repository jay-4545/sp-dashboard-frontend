# Amazon SP-API Frontend

Next.js 14 dashboard for managing up to 5 Amazon seller accounts. Reads data from the backend API only — never calls Amazon directly.

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | Zustand, TanStack Query |
| Deploy | Vercel |

## Setup

### Prerequisites

- Node.js 18+
- Backend API running (local or Render)

### Install & run

```bash
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:3001

npm install
npm run dev
```

App runs at `http://localhost:3000`

**Default login** (backend must be seeded):
- Email: `admin@example.com`
- Password: `Admin123!`

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL (e.g. `http://localhost:3001` or Render URL) |

## Pages

| Route | Description |
|-------|-------------|
| `/login` | Sign in |
| `/dashboard` | KPIs, revenue chart, account breakdown, top SKUs |
| `/accounts` | Seller account cards, sync status, manual sync |
| `/orders` | Filterable orders table |
| `/inventory` | Stock levels with low-stock alerts |
| `/finance` | Financial events and P&L summary |

## Deploy on Vercel

- Connect this repo to Vercel
- Set `NEXT_PUBLIC_API_URL` to your Render backend URL
- Update backend `FRONTEND_URL` to match your Vercel domain (CORS)

## Security

- JWT stored in `sessionStorage` (cleared on tab close)
- No Amazon secrets in frontend env
- Protected routes redirect to `/login` when unauthenticated
