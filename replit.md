# EVA Cosmetics Asset Management System

## Overview
A full-stack Asset Management System for EVA Cosmetics Group. Built with React + Vite frontend and Express.js backend with PostgreSQL database.

## Architecture

### Frontend (React + Vite)
- Port: 5000 (host: 0.0.0.0)
- Framework: React 18 with React Router v6
- Styling: Tailwind CSS
- State: React Context (AuthContext, ThemeContext)
- i18n: react-i18next (English + Arabic)
- Entry: `src/main.jsx`

### Backend (Express.js)
- Port: 3001 (host: localhost)
- Entry: `backend/src/index.js`
- Auth: JWT tokens via `bcryptjs` + `jsonwebtoken`
- DB: PostgreSQL via `pg` pool

### Database (PostgreSQL)
- Managed by Replit's built-in PostgreSQL
- Connection via `DATABASE_URL` environment variable
- Schema managed in `backend/src/db/migrate.js`
- Seed data in `backend/src/seed.js`

## Database Tables
- `users` — system users with roles (user, asset_manager, admin)
- `assets` — tracked assets with assignment info
- `employees` — company employees
- `products` — inventory items
- `reports` — generated reports
- `tasks` — assigned tasks
- `notifications` — user notifications
- `chat_messages` — user-to-user messages
- `asset_assignments` — asset assignment history

## Workflows
- **Start application** — `npm run dev` on port 5000 (webview)
- **Backend API** — `cd backend && node src/index.js` on port 3001 (console)

## Demo Credentials
- Admin: `admin@eva.com` / `password123`
- Manager: `manager@eva.com` / `password123`
- User: `user@eva.com` / `password123`

## Key Files
- `vite.config.js` — Vite config with proxy to backend at localhost:3001
- `backend/.env` — Backend environment variables (DATABASE_URL, JWT_SECRET, PORT)
- `backend/src/db/pool.js` — DB connection pool (uses DATABASE_URL)
- `src/context/AuthContext.jsx` — Auth state management
- `src/utils/api.js` — API client utilities

## Environment Variables
- `DATABASE_URL` — PostgreSQL connection string (managed by Replit)
- `JWT_SECRET` — JWT signing secret (in backend/.env)
- `PORT` — Backend port (3001)

## Deployment
- Target: Autoscale
- Build: `npm run build`
- Run: `node backend/src/index.js`
