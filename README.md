# LeadFlow

LeadFlow is a modern, production-grade Lead Management CRM and Landing Page ecosystem. It allows users to capture leads via a beautiful landing page and seamlessly manage them through a secure, high-performance admin dashboard.

**✨ Fun Fact: 100% of the frontend and most of the backend was entirely *vibe coded*!**

## 🏗️ Architecture Overview

The project is split into a decoupled Client-Server architecture, ensuring maximum scalability and separation of concerns.

### 🎨 Frontend (Next.js & Vercel)
The frontend is built using **Next.js 16 (App Router)** and is deployed on **Vercel** for global CDN edge delivery.
- **Styling:** Tailwind CSS with a heavy emphasis on modern, premium aesthetics (glassmorphism, curated HSL color tokens).
- **Animations:** Framer Motion powers all micro-interactions, layout transitions, and dashboard entrance animations.
- **Data Fetching:** TanStack Query (React Query) handles all API caching, background refetching, and optimistic UI updates.
- **Layout:** Strictly architected 100vh flexbox dashboard layout that prevents global page scrolling, keeping the UI locked and app-like.

### ⚙️ Backend (Express & Render)
The backend is a purely RESTful API built with **Node.js, Express, and TypeScript**, deployed securely on **Render**.
- **Type Safety:** Fully typed requests and responses.
- **Modularity:** Isolated database controllers (`db.ts`), authentication middleware, and robust global error handling.

### 🗄️ Database (Supabase / PostgreSQL)
Data persistence is handled by **Supabase (PostgreSQL)**.
- **Connection Pooling:** We utilize Supabase's **Transaction Pooler (IPv4 via Supavisor)** on port `6543`. This guarantees flawless outbound connectivity from Render and completely bypasses standard IPv6 ISP restrictions.
- **Automated Migrations:** The backend automatically executes an `initDb()` schema check on startup, safely spinning up the `leads`, `admins`, and `notifications` tables if they do not exist.
- **Parameter Binding:** Custom query interpreters safely convert standard `?` parameter syntax into PostgreSQL's strict `$1` syntax on the fly to prevent SQL Injection.

## 🔒 Authentication & Security

Security is treated as a first-class citizen across both the frontend and backend.

- **Password Hashing:** Passwords are never stored in plaintext. The backend uses `bcrypt` with a high cost-factor to securely hash and salt all admin credentials.
- **Stateless Sessions (JWT):** Upon login, the server cryptographically signs a JSON Web Token (JWT) using a secure `JWT_SECRET`.
- **Hybrid Cookie Strategy:** 
  1. **API Requests:** The frontend stores the token in `localStorage` and strictly attaches it to the `Authorization: Bearer <token>` header for all TanStack Query data fetches.
  2. **Route Protection (Middleware):** A server action safely copies the token into a `SameSite=Strict` HttpOnly browser cookie. The Next.js Middleware reads this cookie on the Edge to instantly block unauthorized visitors from ever rendering the `/admin` dashboard layout.

## 🚀 Local Development

To run the project locally, you will need two terminal windows.

### 1. Start the Backend
Navigate to the `backend` folder, set up your `.env`, and start the server:
```bash
cd backend
npm install
npm run dev
```
**Required `.env` variables (Backend):**
- `DATABASE_URL` (Supabase Connection Pooler URL)
- `JWT_SECRET` (A secure random string)
- `PORT` (Defaults to 5000)

### 2. Start the Frontend
Navigate to the `frontend` folder, set up your `.env.local`, and start the Next.js app:
```bash
cd frontend
npm install
npm run dev
```
**Required `.env.local` variables (Frontend):**
- `NEXT_PUBLIC_API_URL` (e.g., `http://localhost:5000/api`)

Once both servers are running, visit `http://localhost:3000` to view the landing page, or `http://localhost:3000/admin/login` to access the dashboard.
