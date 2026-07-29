# BlogZone — Full MERN App

This package contains **both halves** of BlogZone:

```
backend/     your original Express + MongoDB API (unchanged, node_modules removed to keep this small)
frontend/    the new React + Vite frontend, wired up to it
```

## Quickest path to running it

```bash
# 1) Backend
cd backend
npm install
# open .env and fill in real Cloudinary credentials (and rotate the Mongo
# password if this project is ever made public — see frontend/README.md §2)
npm run start

# 2) Frontend, in a second terminal
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**. The API is expected at
**http://localhost:5000/api** (already set in `frontend/.env`).

Full details — every route the frontend calls, the access model, and a
troubleshooting section — are in **`frontend/README.md`**.
