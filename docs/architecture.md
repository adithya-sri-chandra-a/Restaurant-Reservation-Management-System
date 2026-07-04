# RRMS Architecture and Implementation Plan

## 1. Product Goals
The system will allow:
- Customers to register, log in, create reservations, view their own reservations, and cancel them.
- Admins to manage all reservations, filter by date, update/cancel reservations, and ensure business rules are enforced.
- The platform to prevent double booking and capacity conflicts automatically through backend business logic.

## 2. High-Level Architecture
### Frontend
- React + Vite SPA
- Routes:
  - Public: login, register, home
  - Customer: dashboard, create reservation, my reservations
  - Admin: reservations management, date filter, reservation detail/edit
- State management: React Context + custom hooks or Zustand if needed
- API layer: Axios or Fetch wrapper with auth interceptors

### Backend
- Node.js + Express
- Structured as modular layered architecture:
  - routes/
  - controllers/
  - services/
  - models/
  - middleware/
  - utils/
  - config/
- RESTful API with JWT authentication and role-based authorization

### Database
MongoDB with Mongoose.
Collections:
- users
- tables
- reservations

## 3. Folder Structure
```text
RRMS/
  README.md
  docs/
    architecture.md
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      services/
      utils/
      app.js
      server.js
  frontend/
    src/
      api/
      components/
      context/
      hooks/
      pages/
      utils/
      App.jsx
      main.jsx
  .env.example
```

## 4. Database Schema
### User
```js
{
  _id: ObjectId,
  name: String,
  email: String,
  passwordHash: String,
  role: 'customer' | 'admin',
  phone: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Table
```js
{
  _id: ObjectId,
  tableNumber: String,
  seatingCapacity: Number,
  location: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Reservation
```js
{
  _id: ObjectId,
  customerId: ObjectId,
  tableId: ObjectId,
  guestCount: Number,
  reservationDate: Date,
  startTime: String,
  endTime: String,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed',
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 5. Business Rules
### Core Rules
- A reservation must have a valid customer, table, date, start time, and end time.
- Guest count must not exceed table seating capacity.
- A table cannot be assigned to overlapping reservations on the same date.
- A customer cannot create overlapping reservations for the same date/time.
- Admin can override or cancel any reservation if needed.

### Automatic Table Assignment
The reservation service will:
1. Validate guest count.
2. Query active tables with capacity >= guestCount.
3. Filter out tables already reserved for the requested time window.
4. Assign the best-fit table, preferring the smallest table that fits.

## 6. API Design
### Authentication
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

### Customer Endpoints
- POST /api/reservations
- GET /api/reservations/me
- PATCH /api/reservations/:id/cancel

### Admin Endpoints
- GET /api/admin/reservations
- GET /api/admin/reservations?date=YYYY-MM-DD
- PATCH /api/admin/reservations/:id
- PATCH /api/admin/reservations/:id/cancel

### Table Endpoints
- GET /api/tables
- POST /api/tables (admin only)

## 7. Middleware and Security
- authMiddleware: validates JWT and attaches user info
- roleMiddleware: restricts routes to admin only
- errorMiddleware: standardizes error responses
- validateMiddleware: validates request payloads with Joi or Zod
- rate limiting and helmet for production hardening

## 8. Business Logic Flow
### Customer Creates Reservation
1. User sends reservation request with date, time, guest count, and optional notes.
2. JWT auth middleware confirms identity.
3. Reservation service validates input and checks table availability.
4. Service chooses an appropriate table automatically.
5. Reservation is saved to MongoDB.
6. Response returns reservation details and assigned table.

### Admin Views Reservations
1. Admin calls the admin reservations endpoint with optional date filter.
2. Backend queries reservations and populates customer and table data.
3. Response includes reservation status and assignment details.

## 9. Error Handling Strategy
Use consistent API errors:
- 400: validation issues
- 401: missing or invalid JWT
- 403: forbidden role access
- 404: resource not found
- 409: reservation conflict or double booking
- 500: unexpected server error

## 10. Development Plan
### Phase 1 - Foundation
- Initialize React and Express projects
- Configure environment variables and MongoDB connection
- Create base folder structure and shared utilities

### Phase 2 - Backend Core
- Build user/auth models and JWT flow
- Implement table and reservation models
- Implement reservation availability logic

### Phase 3 - API and Security
- Add middleware for auth, roles, validation, and errors
- Implement customer and admin endpoints

### Phase 4 - Frontend
- Build auth pages and dashboard
- Add reservation form and reservation list views
- Add admin management views

### Phase 5 - Production Hardening
- Add tests, logging, env validation, deployment config, and CI/CD
