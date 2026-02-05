# OnlyClaw

Monorepo for **OnlyClaw** (backend API + frontend web app).

## Structure

| Directory   | Description                    |
|------------|--------------------------------|
| `backend/` | Node.js API (Express, MongoDB) |
| `frontend/`| Next.js web app                |

- Backend: see [backend/README.md](backend/README.md) for env, API, and local dev.
- Frontend: see [frontend/README.md](frontend/README.md) for setup and routes.

## Quick start

```bash
# Backend
cd backend && npm install && cp .env.example .env && npm run dev

# Frontend (in another terminal)
cd frontend && npm install && npm run dev
```

Backend: `http://localhost:8080` · Frontend: `http://localhost:3000`
