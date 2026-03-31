# HomeRent

HomeRent is a rental management platform with:
- A React + Vite frontend
- A Node.js + Express + TypeScript backend API
- PostgreSQL storage (Supabase-compatible)

This README is a complete local setup guide to get the project running from scratch.

## Tech stack

- Frontend: React, Vite, TypeScript, Tailwind CSS
- Backend: Express, TypeScript, PostgreSQL, JWT auth
- Services: Cloudinary (uploads), SMTP (OTP emails)

## Project structure

- `.`: frontend app (Vite)
- `backend/`: backend API and database init script

## Prerequisites

Install and prepare these before starting:

1. Node.js 18+ and npm
2. PostgreSQL database (local Postgres or Supabase Postgres)
3. Cloudinary account (for image uploads)
4. SMTP credentials (for OTP and password reset emails)
5. Git

## Step-by-step local setup

Follow every step in order.

### 1) Clone the repository

```bash
git clone <your-repo-url>
cd homerent
```

### 2) Install frontend dependencies

From the project root:

```bash
npm install
```

### 3) Install backend dependencies

```bash
cd backend
npm install
cd ..
```

### 4) Configure frontend environment

Create a root `.env` file (same level as `package.json`) and add:

```env
PORT=8080
VITE_API_BASE_URL=http://localhost:8085
```

Notes:
- `VITE_API_BASE_URL` must point to your backend API URL.
- If your backend uses a different port, update this value.

### 5) Configure backend environment

Create `backend/.env` and add:

```env
PORT=8085
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DB_SSL=true
JWT_SECRET=replace_with_a_secure_random_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CLIENT_URL=http://localhost:8080,http://127.0.0.1:8080

SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM=your_sender_email_or_name
```

Important:
- `CLIENT_URL` is comma-separated and should include every frontend origin you use.
- Keep credentials private and never commit real secrets.
- If your Postgres instance does not require SSL, set `DB_SSL=false`.

### 6) Initialize database schema and seed admin

```bash
cd backend
npm run db:init
cd ..
```

What this does:
- Creates required tables and indexes
- Seeds default admin if it does not already exist:
  - Email: `eloibuyange@gmail.com`
  - Password: `Admin@123`

### 7) Start backend server

In terminal 1:

```bash
cd backend
npm run dev
```

Backend should be available at:
- API: `http://localhost:8085`
- Swagger docs: `http://localhost:8085/docs`
- Health check: `http://localhost:8085/health`

### 8) Start frontend server

In terminal 2:

```bash
npm run dev
```

Frontend should run at:
- `http://localhost:8080`

### 9) Open the app

Visit `http://localhost:8080` and use the seeded admin credentials above.

## Default login credentials

- Admin (seeded by `npm run db:init`)
  - Email: `eloibuyange@gmail.com`
  - Password: `Admin@123`
- Landlord
  - A landlord is created after an admin approves a landlord application.
  - The landlord email is the same email used in the approved application.
  - Default landlord password on approval: `Landlord@123`

## Useful commands

### Frontend (run from root)

```bash
npm run dev
npm run build
npm run preview
```

### Backend (run from `backend/`)

```bash
npm run dev
npm run build
npm run start
npm run db:init
npm run prisma:generate
npm run prisma:validate
npm run prisma:studio
```

## Troubleshooting

- If frontend cannot call backend, confirm `VITE_API_BASE_URL` in root `.env`.
- If CORS errors appear, ensure your frontend URL is listed in `CLIENT_URL` in `backend/.env`.
- If DB connection fails, recheck `DATABASE_URL` and `DB_SSL`.
- If OTP emails do not send, verify SMTP host/port/user/pass.

