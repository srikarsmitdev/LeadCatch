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
