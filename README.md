# Store Rating App

A full-stack web application where users can rate registered stores from **1 to 5**. It uses a **single login system** for three roles — System Administrator, Normal User and Store Owner — and each role sees different functionality after signing in.

Built for the FullStack Intern Coding Challenge.

## Tech Stack

| Layer    | Technology                                                                 |
| -------- | -------------------------------------------------------------------------- |
| Backend  | Node.js, Express 5, Sequelize ORM, express-validator, JWT, bcryptjs        |
| Database | MySQL                                                                      |
| Frontend | React 19, Vite, Redux Toolkit, React Router, Tailwind CSS 4, shadcn/ui, Sonner |

## Features

### System Administrator
- Dashboard with total users, total stores and total submitted ratings
- Add new stores, normal users and admin users (name, email, password, address, role)
- View, **filter** (name, email, address, role) and **sort** lists of stores and users
- Store list shows name, email, address and rating
- User details page; store owners also show their store's rating
- Log out

### Normal User
- Sign up through a registration page, then log in
- View all registered stores and **search by name and address**
- Each store shows its name, address, overall rating and the user's own rating
- **Submit** a rating (1–5) and **modify** it later (one rating per user per store)
- Update password
- Log out

### Store Owner
- Log in and update password
- Dashboard with the store's **average rating** and a sortable list of users who rated it
- Log out

### Form validation (enforced on both frontend and backend)
| Field    | Rule                                                              |
| -------- | ----------------------------------------------------------------- |
| Name     | 20–60 characters                                                  |
| Address  | Max 400 characters                                                |
| Password | 8–16 characters, at least one uppercase letter and one special character |
| Email    | Standard email format                                             |
| Rating   | Whole number from 1 to 5                                          |

## Security & Best Practices
- Passwords are hashed with **bcrypt** (never stored in plain text)
- JWT stored in an **httpOnly cookie**, so JavaScript on the page cannot read it (XSS-safe); the session survives page refresh
- **Role-based access control** on every protected API route and on frontend routes
- Server-side validation with `express-validator`, plus inline client-side validation
- Generic "Invalid email or password" login error (does not reveal which emails exist)
- Sort fields are whitelisted and user-supplied values are validated, avoiding SQL injection through sorting/filtering
- CORS restricted to the configured frontend origin

## Project Structure

```
store-rating-app/
├── backend/
│   ├── config/            # Sequelize/MySQL connection
│   ├── controllers/       # auth, admin, user, owner
│   ├── middleware/        # validators + validation error handler
│   ├── models/            # User, Store, Rating (+ associations)
│   ├── routes/            # auth, admin, user, owner
│   ├── scripts/seed.js    # creates first admin + demo data
│   └── server.js
└── frontend/
    └── src/
        ├── common/        # route guard (CheckAuth), reusable form
        ├── components/    # admin / user / store_owner / shared UI
        ├── pages/         # auth, admin, common (update password)
        ├── store/         # Redux slices: auth, admin, shop, owner
        ├── lib/           # axios instance, validation helpers
        └── config/        # form control definitions
```

## Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8+ (running locally or remotely)

### 1. Clone the repository
```bash
git clone https://github.com/Sehajpreet-kaur/store-rating-app.git
cd store-rating-app
```

### 2. Create the database
```sql
CREATE DATABASE store_rating_db;
```
Tables are created automatically when the backend starts (`sequelize.sync`).

### 3. Configure and run the backend
```bash
cd backend
npm install
```
Create `backend/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=store_rating_db
JWT_SECRET=use_a_long_random_string
CLIENT_BASE_URL=http://localhost:5173
```
Seed the first admin and demo data, then start the server:
```bash
npm run seed
npm run dev
```
The API runs at `http://localhost:5000`.

### 4. Configure and run the frontend
```bash
cd frontend
npm install
```
Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```
```bash
npm run dev
```
Open `http://localhost:5173`.

> Open the app at `localhost` (not `127.0.0.1`) so it matches `CLIENT_BASE_URL`; otherwise the auth cookie won't be sent.

## Demo Accounts (created by `npm run seed`)

| Role         | Email               | Password     |
| ------------ | ------------------- | ------------ |
| Admin        | admin@example.com   | Admin@1234   |
| Store Owner  | owner@example.com   | Owner@1234   |
| Normal User  | user@example.com    | User@1234    |

New public sign-ups are always created as **Normal Users**. Admins create admins and store owners from the dashboard. Change or delete these demo accounts before deploying anywhere public.

## API Reference

Base URL: `http://localhost:5000/api`. All routes except register/login require the auth cookie.

### Auth
| Method | Endpoint          | Access     | Description                         |
| ------ | ----------------- | ---------- | ----------------------------------- |
| POST   | `/auth/register`  | Public     | Sign up as a normal user            |
| POST   | `/auth/login`     | Public     | Log in (sets httpOnly cookie)       |
| POST   | `/auth/logout`    | Any        | Clear the cookie                    |
| GET    | `/auth/me`        | Logged in  | Current user (used on page refresh) |
| PUT    | `/auth/password`  | Logged in  | Update own password                 |

### Admin
| Method | Endpoint           | Description                                  |
| ------ | ------------------ | -------------------------------------------- |
| GET    | `/admin/dashboard` | Total users, stores and ratings              |
| GET    | `/admin/users`     | List users (filter and sort)                 |
| GET    | `/admin/users/:id` | User details (owners include store rating)   |
| POST   | `/admin/users`     | Create user / admin / store owner            |
| GET    | `/admin/stores`    | List stores (filter and sort)                |
| POST   | `/admin/stores`    | Create a store                               |

### Normal User
| Method | Endpoint                        | Description                                                        |
| ------ | ------------------------------- | ------------------------------------------------------------------ |
| GET    | `/user/stores`                  | Stores with overall and own rating. Query: `name`, `address`, `sortBy`, `sortOrder` |
| POST   | `/user/stores/:storeId/rating`  | Submit or update a rating. Body: `{ "value": 1-5 }`                |

### Store Owner
| Method | Endpoint           | Description                                            |
| ------ | ------------------ | ------------------------------------------------------ |
| GET    | `/owner/dashboard` | Own store, average rating and the users who rated it   |

## Database Schema

- **users** — `id`, `name`, `email` (unique), `password` (hashed), `address`, `role` (`admin` | `normal` | `store_owner`)
- **stores** — `id`, `name`, `email`, `address`, `ownerId` → users
- **ratings** — `id`, `value` (1–5), `userId` → users, `storeId` → stores; unique on (`userId`, `storeId`) so each user has at most one rating per store

## Deployment Notes
- Set `NODE_ENV=production`, serve both apps over **HTTPS**, and set `CLIENT_BASE_URL` to the deployed frontend URL. The auth cookie then switches to `SameSite=None; Secure` for cross-domain use.
- Use a strong, unique `JWT_SECRET` and never commit `.env` files (add them to `.gitignore`).
- Cookie authentication across separate domains should be paired with CSRF protection in a production system.

## Author

Sehajpreet Kaur — [GitHub](https://github.com/Sehajpreet-kaur)
