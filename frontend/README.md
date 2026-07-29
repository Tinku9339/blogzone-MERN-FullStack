# BlogZone — Frontend

A full MERN frontend for the BlogZone backend: a public blog (browse, read,
comment) plus an authenticated writer's dashboard (posts, comments, profile,
AI-assisted drafting, image uploads).

Built with **React 18 + Vite + React Router + Tailwind CSS + Axios**.

---

## 1. What's included

- **Public site** — home page with a featured post + grid, a searchable
  archive, category filtering, and a full post page with approved comments
  and a comment form (comments go into a moderation queue).
- **Auth** — signup and login backed by the API's JWT (`/api/auth/*`). The
  token is stored in `localStorage` and attached to every request; a 401
  anywhere in the app logs the user out automatically.
- **Dashboard** (`/dashboard`, protected) — post/comment stats from
  `/api/dashboard/stats`, with a shortcut to pending comments.
- **Posts** (`/dashboard/blogs`) — list every post (published + drafts),
  search, filter, toggle publish state, delete.
- **Post editor** (`/dashboard/blogs/new`, `/dashboard/blogs/:id/edit`) —
  title, category, cover image (uploaded straight to Cloudinary via
  `/api/upload`), and a description field with a **"Draft with AI"** button
  that calls `/api/blogs/generate-description`.
- **Comments** (`/dashboard/comments`) — review, approve, or delete any
  comment, filterable by pending/approved.
- **Profile** (`/dashboard/profile`) — edit name/bio/about/writing
  categories/avatar, and a separate change-password form.

Every API call in `src/api/*.js` is commented with the exact backend route
it hits, so if a controller ever changes, the matching frontend call is easy
to find.

---

## 2. Backend setup (do this first)

The frontend expects the backend running at `http://localhost:5000` (or
whatever you set in `VITE_API_URL`).

```bash
cd backend/server
npm install
npm run start      # or: npm run server   (nodemon, auto-restart)
```

Before starting it, open `backend/server/.env` and check these values:

- `MONGO_URI` — must point to a MongoDB instance you control. The URI that
  shipped in this project has live-looking credentials in it — **rotate
  that database password / regenerate the connection string** before using
  it anywhere public, since it was included in a file you uploaded here.
- `JWT_SECRET` — fine for local dev; use a long random string in production.
- `GEMINI_API_KEY` — needed for the "Draft with AI" button
  (`/api/blogs/generate-description`). If this key isn't valid, every
  other feature still works — you'll just see an error toast when you
  click "Draft with AI", and you can type the description by hand instead.
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET`
  — currently placeholders (`your_cloud_name`, etc.). **Image upload won't
  work until you fill these in** with a real Cloudinary account (free tier
  is fine). Without them, `/api/upload` will fail and you won't be able to
  set a cover image or avatar.
- `FRONTEND_URL` — not set by default. The backend's CORS list already
  allows `http://localhost:5173` (Vite's default dev port), so local dev
  works out of the box. If you deploy the frontend elsewhere, add its URL
  to `FRONTEND_URL` in the backend `.env`.

The health check is at `http://localhost:5000/api/dashboard/health`.

---

## 3. Frontend setup

```bash
cd blogzone-frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`. `.env` already points it at the
backend:

```
VITE_API_URL=http://localhost:5000/api
```

Change this if your backend runs somewhere else (and add that origin to the
backend's CORS list / `FRONTEND_URL`).

Build for production with `npm run build`; preview the build with
`npm run preview`.

---

## 4. How access works

The backend has no admin/role field — **any authenticated user can create,
edit, and delete any post, and can moderate any comment.** This frontend
mirrors that: signing up gives you full access to `/dashboard`. There's no
separate "reader" vs "admin" account type — it's a single-desk publishing
model (think one or a few trusted writers, not a multi-tenant platform).

Public visitors (no login) can browse published posts and leave a comment;
comments stay hidden until an authenticated user approves them in
**Comments**.

---

## 5. Project structure

```
blogzone-frontend/
  src/
    api/          axios instance + one module per backend resource
    context/       AuthContext (token, user, login/signup/logout)
    components/    shared UI (cards, forms, dialogs, uploader, nav)
    layouts/       PublicLayout (site chrome) / AdminLayout (dashboard shell)
    pages/         one file per route
    utils/         categories list + date/formatting helpers
```

---

## 6. Troubleshooting

- **"Network Error" / requests never resolve** — the backend isn't running,
  or `VITE_API_URL` doesn't match its address/port.
- **CORS error in the browser console** — the frontend's origin isn't in
  the backend's `allowedOrigins` list in `server.js`. Add it or set
  `FRONTEND_URL`.
- **Image upload fails** — fill in real Cloudinary credentials in the
  backend `.env` (see above).
- **"Draft with AI" fails** — check `GEMINI_API_KEY` in the backend `.env`;
  everything else in the app works without it.
- **401 right after logging in** — check that `JWT_SECRET` is set in the
  backend `.env` (an empty secret breaks `jsonwebtoken`).
