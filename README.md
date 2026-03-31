# HomeRent

HomeRent is a rental management platform with:
- A Node.js + Express + TypeScript backend API
- A static HTML/CSS/JS frontend for tenant, landlord, and admin flows
- PostgreSQL storage (Supabase-compatible)

## Backend stack

- Node.js + Express + TypeScript
- PostgreSQL (Supabase compatible)
- Cloudinary for image uploads
- JWT auth + bcrypt password hashing
- OTP email verification with Nodemailer
- Swagger docs at `/docs`

## Project structure

- `backend/` - API server, authentication, database initialization script, Swagger docs
- `frontend/` - static frontend pages and shared JS client helpers
- `vercel.json` - rewrites for Vercel static hosting routes

## Prerequisites

1. Install **Node.js 18+** (includes npm).
2. Have a **PostgreSQL database** ready (Supabase Postgres also works).
3. Have credentials for:
   - Cloudinary (image uploads)
   - SMTP provider (OTP and auth emails)
4. Clone this repository.

## 1) Clone and open the project

```bash
git clone <your-repo-url>
cd HomeRent
```

## 2) Backend environment setup

Create `backend/.env` and add the following keys:

```env
PORT=7501
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DB_SSL=true
JWT_SECRET=replace_with_a_secure_random_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CLIENT_URL=http://127.0.0.1:5501,http://localhost:5501,http://localhost:7501

SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM=your_sender_email_or_name
```

Notes:
- `CLIENT_URL` is comma-separated and must include every frontend origin you use in development.
- Keep secrets private and never commit real credentials.

## 3) Install backend dependencies

```bash
cd backend
npm install
```

## 4) Initialize database schema and seed default admin

Run:

```bash
npm run db:init
```

This creates required tables/indexes and seeds a default admin account (if it does not already exist):
- Email: `eloibuyange@gmail.com`
- Password: `Admin@123`

## 5) Start the backend server

```bash
npm run dev
```

You should see:
- API running at `http://localhost:7501`
- Swagger docs at `http://localhost:7501/docs`
- Health check at `http://localhost:7501/health`

## 6) Open the frontend

With backend running, open:
- `http://localhost:7501/` (main landing page)
- `http://localhost:7501/admin/`
- `http://localhost:7501/landlord/`
- `http://localhost:7501/tenant/`
- `http://localhost:7501/HomeRent/`

The backend serves static files from the `frontend/` folder.

## 7) Optional: frontend API base override

The frontend defaults to `http://localhost:7501` on localhost. If needed, override in browser console:

```js
localStorage.setItem("HOMERENT_API", "http://localhost:7501");
```

## Common commands (backend)

From `backend/`:

```bash
npm run dev
npm run build
npm run start
npm run db:init
npm run prisma:generate
npm run prisma:validate
npm run prisma:studio
```

## Default admin (seeded by `npm run db:init`)

- Email: `eloibuyange@gmail.com`
- Password: `Admin@123`

## Deployment notes

- `vercel.json` includes rewrites for static route mapping.
- For production, set all backend env vars securely in your hosting provider.
- Change the seeded admin password immediately after first login.
