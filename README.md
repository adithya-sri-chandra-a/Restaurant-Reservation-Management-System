# Restaurant Reservation Management System (RRMS)

A production-ready full-stack restaurant reservation platform built with React, Vite, Node.js, Express, MongoDB, and Mongoose. The system supports customer and admin workflows, JWT authentication, reservation booking, table management, and protected routes.

## Overview

RRMS helps restaurants manage table reservations efficiently by providing:
- Customer registration and login
- Reservation creation for a selected date, time slot, and guest count
- Automatic table assignment based on capacity and availability
- Customer access to their own bookings and cancellation
- Admin access to view, filter, update, and cancel reservations
- Admin access to create and manage restaurant tables

## Features

### Customer Features
- Register and log in securely
- Create reservations
- View personal bookings
- Cancel personal reservations

### Admin Features
- View all reservations
- Filter reservations by date
- Update reservation details
- Cancel any reservation
- View all tables
- Add or remove tables

### Technical Features
- JWT-based authentication
- Role-based authorization
- Protected frontend routes
- RESTful backend architecture
- Centralized error handling
- Reusable MongoDB seed script

## Tech Stack

### Frontend
- React
- Vite
- React Router DOM
- Axios
- Context API

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

## Project Structure

```text
RRMS/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.js
│   │   ├── server.js
│   │   └── seedTables.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── package.json
│   └── vite.config.js
├── docs/
│   └── architecture.md
└── DEPLOYMENT.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file using `.env.example` and update values:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://127.0.0.1:27017/rrms
   JWT_SECRET=your-secret-key
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=http://localhost:3000
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

5. Seed initial tables:
   ```bash
   npm run seed:tables
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file if needed:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/auth/admin`

### Customer reservations
- `POST /api/reservation/create`
- `GET /api/reservation/my-bookings`
- `DELETE /api/reservation/cancel/:id`

### Admin reservations
- `GET /api/admin/reservations`
- `GET /api/admin/reservations/date?date=YYYY-MM-DD`
- `PATCH /api/admin/reservation/:id`
- `DELETE /api/admin/reservation/:id`

### Admin tables
- `GET /api/admin/tables`
- `POST /api/admin/tables`
- `DELETE /api/admin/tables/:id`

## Reservation Logic

Reservations are handled with a simple but reliable business rule set:

1. The customer provides a date, time slot, and guest count.
2. The system checks for existing active reservations for the same user on the same date and time.
3. The system finds tables that are available and have capacity greater than or equal to the guest count.
4. The system selects the smallest suitable table to optimize space usage.
5. If no suitable table is found, the booking is rejected with an error.
6. The reservation is stored in MongoDB and linked to the assigned table.

## Role-Based Access

The application uses JWT-based authentication and role-based authorization:
- `customer` users can create and manage their own reservations.
- `admin` users can manage all reservations and restaurant tables.
- Protected routes on the frontend and backend enforce access rules.

## Assumptions

- Each reservation is tied to one table.
- Time slots are predefined on the backend.
- Tables are fixed and managed by the admin.
- The system currently supports one active reservation per user per date/time slot.

## Known Limitations

- Reservation editing is limited to basic admin updates.
- No real-time seat availability widget is implemented yet.
- No email or SMS notifications are included.
- No payment or order integration is included.

## Future Improvements

- Add email/SMS reminders
- Add real-time availability updates
- Improve admin dashboard analytics
- Add pagination and filtering for large datasets
- Add unit and integration tests
- Add Docker support for easier deployment

## Deployment

For deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## License

This project is intended for educational and prototype use.
