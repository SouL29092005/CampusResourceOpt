# Campus Timetable & Resource Management System

A full-stack web application for managing campus resources — library books, laboratory equipment, room bookings, courses, and timetables — with role-based dashboards for students, faculty, librarians, lab admins, and administrators.

**Author:** Souvik Layek · IIT (ISM) Dhanbad

---

## Table of Contents

- [Overview](#overview)
- [Features by Role](#features-by-role)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Architecture](#architecture)
- [API Overview](#api-overview)
- [Automated Jobs](#automated-jobs)
- [Future Improvements](#future-improvements)
- [Author](#author)

---

## Overview

Campus Resource Opt centralizes day-to-day campus operations into a single platform. Users authenticate with JWT, and each role gets a tailored dashboard. Admins manage the full system; operational staff (librarians, lab admins) handle their domains; students and faculty interact with resources they are allowed to use.

**Live routes (frontend):**

| Route | Role |
|-------|------|
| `/` | Public landing page |
| `/login` | Authentication |
| `/admin/*` | Admin panel |
| `/student/dashboard` | Student |
| `/faculty/dashboard` | Faculty |
| `/librarian/dashboard` | Librarian |
| `/lab-admin/dashboard` | Lab Admin |

---

## Features by Role

### Admin
- Dashboard with system-wide statistics (users, books, equipment, active bookings)
- User management with role-specific profile creation
- Library catalog oversight
- Laboratory equipment management (add, view, delete, monitor bookings)
- Room management
- Course management
- Timetable upload (CSV) and viewing

### Student
- View issued library books
- Browse available lab equipment
- Book equipment within allowed time windows (max 2-day duration, up to 3 days ahead)
- View and cancel own equipment bookings
- Profile view

### Faculty
- Browse and book campus rooms
- View and cancel own room bookings
- Profile view and edit (qualification, courses)

### Librarian
- Add books to the catalog
- Search books and issue to students
- Return books with fine calculation
- Mark books as lost or damaged
- View active and overdue issues
- Profile view

### Lab Admin
- Add equipment (automatically assigned under their `maintainedBy` record)
- View and delete only equipment they maintain
- View active bookings on their equipment
- Cancel bookings on managed equipment
- Profile view (lab name, qualification, managed equipment)

---

## Tech Stack

<p align="center">
  <img src="https://skillicons.dev/icons?i=react,vite,tailwind,nodejs,express,mongodb,jest" alt="Core tech stack" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Radix_UI-161618?style=for-the-badge&logo=radix-ui&logoColor=white" alt="Radix UI" />
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongodb&logoColor=white" alt="Mongoose" />
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.io" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" alt="Jest" />
  <img src="https://img.shields.io/badge/Supertest-000000?style=for-the-badge&logo=jest&logoColor=white" alt="Supertest" />
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint" />
  <img src="https://img.shields.io/badge/node--cron-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="node-cron" />
  <img src="https://img.shields.io/badge/bcrypt-000000?style=for-the-badge&logo=security&logoColor=white" alt="bcrypt" />
</p>

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, Vite, React Router, Tailwind CSS, Radix UI, Axios, Lucide Icons |
| **Backend** | Node.js, Express 5, MongoDB, Mongoose |
| **Auth** | JWT, bcrypt |
| **Real-time** | Socket.io (initialized, ready for extensions) |
| **Automation** | node-cron (booking status, overdue tracking) |
| **Testing** | Jest, Supertest |

---

## Project Structure

```
CampusResourceOpt/
├── backend/
│   └── src/
│       ├── config/          # Database connection
│       ├── middlewares/     # JWT auth, role-based access
│       ├── jobs/            # Cron jobs (bookings, overdue items)
│       ├── modules/
│       │   ├── admin/       # Dashboard stats
│       │   ├── auth/        # Login, password change
│       │   ├── library/     # Books, issues, returns
│       │   ├── laboratory/  # Equipment & bookings
│       │   ├── room/        # Rooms & room bookings
│       │   ├── timetable/   # Courses, timetable entries
│       │   └── users/       # Users & role profiles
│       ├── utils/           # JWT, counters, helpers
│       ├── app.js
│       ├── routes.js
│       └── server.js
│
└── frontend/
    └── src/
        ├── api/             # Axios API wrappers
        ├── components/      # Shared UI, layouts, profile
        └── pages/
            ├── admin/       # Admin panel pages
            ├── student/
            ├── faculty/
            ├── librarian/
            └── labadmin/
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **MongoDB** (local instance or MongoDB Atlas)
- **npm**

### 1. Clone the repository

```bash
git clone <repository-url>
cd CampusResourceOpt
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory (see [Environment Variables](#environment-variables)).

Start the backend:

```bash
npm run dev
```

The API runs at `http://localhost:5000` by default.

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` by default.

### 4. Create an admin user

Create the first admin through MongoDB directly, or use the admin user management page once any admin account exists. The backend exposes a seed script entry point:

```bash
cd backend
npm run seed-admin
```

> **Note:** Ensure `scripts/seedAdmin.js` exists and your `.env` is configured before running the seed command.

### 5. Log in

Open `http://localhost:5173/login` and sign in with your credentials. You will be redirected to the dashboard matching your role.

---

## Environment Variables

Create `backend/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/campus_resource_opt
JWT_SECRET=your_secure_jwt_secret_here
PORT=5000
ENABLE_CRON=true
```

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `PORT` | Backend server port (default: `5000`) |
| `ENABLE_CRON` | Set to `false` to disable automated background jobs |

The frontend Axios client is configured to call `http://localhost:5000/api`. Update `frontend/src/api/axios.js` if your backend URL differs.

---

## Available Scripts

### Backend (`backend/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start server with nodemon (hot reload) |
| `npm start` | Start production server |
| `npm test` | Run Jest test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run seed-admin` | Seed initial admin user |

### Frontend (`frontend/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## Architecture

The backend follows a **controller → service → model** pattern. Each feature lives in its own module under `backend/src/modules/`. Routes are aggregated in `routes.js` under the `/api` prefix.

```
Client (React)
    │
    ▼
Axios  ──►  Express Routes  ──►  Middleware (JWT + Role)
                                      │
                                      ▼
                               Controller  ──►  Service  ──►  Mongoose Model
                                      │
                                      ▼
                                   MongoDB
```

**Authentication flow:** Login returns a JWT → stored in `localStorage` → attached to every API request via an Axios interceptor → `protect` middleware validates the token → `allowRoles` restricts access by role.

**Profile system:** Each role has a dedicated profile schema (`StudentProfile`, `FacultyProfile`, `LibrarianProfile`, `LabAdminProfile`) linked to the core `User` model.

---

## API Overview

All endpoints are prefixed with `/api`.

| Module | Base Path | Purpose |
|--------|-----------|---------|
| Auth | `/auth` | Login, change password |
| Users | `/users` | User CRUD, profile (`/users/me`) |
| Library | `/library` | Books, issue, return, search |
| Lab | `/lab` | Equipment CRUD, bookings, free slots |
| Room | `/room` | Room management |
| Room Booking | `/roomBooking` | Faculty/admin room bookings |
| Timetable | `/timetable` | CSV upload, timetable entries |
| Courses | `/subject` | Course management |
| Admin | `/admin` | Dashboard statistics |

**Health check:** `GET /health`

---

## Automated Jobs

When `ENABLE_CRON=true`, the backend runs scheduled jobs:

| Job | Purpose |
|-----|---------|
| **Booking status** | Marks equipment bookings as completed, updates equipment availability (`available` / `in-use`) |
| **Room booking status** | Updates room booking lifecycle |
| **Issue overdue** | Tracks overdue library book issues |

---

## Future Improvements

The following enhancements would extend the platform beyond its current scope:

### User Experience
- **Real-time notifications** — Use the existing Socket.io setup for live booking confirmations, overdue alerts, and cancellation notices
- **Student timetable view** — Let students and faculty view their personal timetable pulled from uploaded CSV data
- **Mobile-friendly PWA** — Offline-capable progressive web app for on-campus mobile use
- **Dark mode** — Theme toggle across all dashboards
- **Password reset / forgot password** — Email-based recovery flow

### Resource Management
- **Equipment waitlist** — Queue students when all slots are booked, with auto-promotion on cancellation
- **Maintenance scheduling** — Block equipment for planned maintenance with calendar integration
- **QR code scanning** — Fast book issue/return and equipment check-in via QR codes
- **Bulk CSV import** — Import users, books, and equipment in batch from admin panel
- **Fine payment integration** — Online payment gateway for library fines

### Analytics & Reporting
- **Usage analytics dashboard** — Charts for equipment utilization, room occupancy, and library circulation trends
- **Export reports** — PDF/CSV exports for bookings, issues, and fines
- **Audit logs** — Track who changed what and when across all modules

### Platform & DevOps
- **Docker Compose setup** — One-command local and production deployment (MongoDB + backend + frontend)
- **CI/CD pipeline** — Automated lint, test, and deploy on push
- **Expanded test coverage** — Integration tests for all role-based flows
- **API documentation** — Swagger/OpenAPI spec for all endpoints
- **Rate limiting & security hardening** — Helmet, request throttling, input sanitization

### Scalability
- **Multi-campus support** — Separate resource pools per campus or department
- **Role delegation** — Sub-admin roles with granular permissions
- **iCal / Google Calendar sync** — Export room and equipment bookings to external calendars
- **Email/SMS reminders** — Automated reminders before booking start and due dates

---

## Author

**Souvik Layek**  
Indian Institute of Technology (Indian School of Mines), Dhanbad
