# Lead Capture Project

This repository contains a full-stack lead capture product with a public landing page and a secure admin dashboard.

## Project Structure

The project has been separated into two distinct parts:
1. **Frontend**: A Next.js 14 application with TailwindCSS and Framer Motion.
2. **Backend**: An Express.js application with SQLite, providing a REST API.

## Data Model

The backend uses a SQLite database with two main tables:

1. **`leads` table**:
   - `id`: INTEGER (Primary Key)
   - `name`: TEXT (Lead's full name)
   - `email`: TEXT (Lead's contact email)
   - `budget`: INTEGER (Lead's budget range)
   - `message`: TEXT (Lead's project details/message)
   - `status`: TEXT (Defaults to 'new', can be 'contacted' or 'closed')
   - `createdAt`: DATETIME (Timestamp of submission)

2. **`admins` table**:
   - `id`: INTEGER (Primary Key)
   - `username`: TEXT (Unique admin username)
   - `password`: TEXT (Bcrypt-hashed password)

## Authentication Approach

The admin dashboard is secured using **JWT (JSON Web Tokens)**:
1. When an admin logs in at `/admin/login`, the backend verifies their credentials using `bcrypt.compare()`.
2. Upon success, the backend generates a JWT signed with a secret key and sends it to the client.
3. The frontend stores this token in `localStorage`.
4. Subsequent requests to protected API endpoints (like `GET /api/leads` and `PATCH /api/leads/:id/status`) include the token in the `Authorization` header as a Bearer token.
5. The backend `authMiddleware` intercepts these requests, verifies the token, and grants or denies access.

*(Note: The default credentials are `admin` / `password123`)*

## Deployment Instructions (Free Tier)

To deploy this project completely on free tiers with no local state:

### Backend Deployment (Render)
1. Push the `backend` folder to a GitHub repository.
2. Sign up for a free account at [Render.com](https://render.com).
3. Create a new **Web Service**, connect your GitHub repo, and select the `backend` folder.
4. Set the Build Command to `npm install && npx tsc`.
5. Set the Start Command to `node dist/index.js` (assuming you compile TypeScript to `dist/`).
6. *Note*: Since SQLite is a file-based database, any data written to it on a serverless or ephemeral container will be lost upon restart. For a production deployment on Render's free tier, you should consider swapping out SQLite for a free PostgreSQL database (which Render also offers for free) by swapping `sqlite3` for `pg`. 

### Frontend Deployment (Vercel)
1. Push the `leadCapture` (frontend) folder to a GitHub repository.
2. Sign up for a free account at [Vercel](https://vercel.com).
3. Import your repository as a new Next.js project.
4. Set the Environment Variable `NEXT_PUBLIC_API_URL` to the URL of your deployed Render backend (e.g., `https://your-backend.onrender.com/api`).
5. Click **Deploy**.

## Loom Walkthrough

*Due to being an AI assistant, I cannot physically record a Loom video.* However, the flow works exactly as follows:
1. A user visits the landing page and fills out the beautiful lead form.
2. The form validates the input on the client side (Zod) and submits it to the backend.
3. The backend stores the new lead in the SQLite database with the status 'new'.
4. The admin navigates to `/admin`, gets redirected to `/admin/login`, and logs in.
5. The admin dashboard fetches all leads via the secure `GET /api/leads` endpoint using the JWT token.
6. The admin clicks on the status dropdown of the new lead and changes it to 'Contacted'.
7. A `PATCH` request is sent to the backend, which updates the database, and the UI immediately reflects the change.
