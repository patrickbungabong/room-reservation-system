# Room Reservation API Documentation

Base URL: `http://localhost:5000/api` (or your deployed backend URL)

## Authentication

All routes except `POST /auth/register` and `POST /auth/login` require the header:

```
Authorization: Bearer <JWT_TOKEN>
```

---

## Auth

### POST /auth/register

Register a new user (default role: student).

**Body (JSON):**
- `name` (string, required)
- `email` (string, required, unique)
- `password` (string, required, min 6 chars)
- `role` (optional: `"student"` | `"admin"`)

**Response:** `201` – `{ success, user: { id, name, email, role }, token }`

---

### POST /auth/login

Login and receive JWT.

**Body (JSON):**
- `email` (string, required)
- `password` (string, required)

**Response:** `200` – `{ success, user: { id, name, email, role }, token }`

---

## Users (authenticated)

### GET /users

List all users. **Admin only.**

**Query:** `page`, `limit`

**Response:** `200` – `{ success, users, total, page, limit, totalPages }`

---

### GET /users/:id

Get user by ID.

**Response:** `200` – `{ success, user }`

---

### PUT /users/:id

Update user (name, email, password, role).

**Body (JSON):** optional `name`, `email`, `password`, `role`

**Response:** `200` – `{ success, user }`

---

### DELETE /users/:id

Delete user. **Admin only.**

**Response:** `200` – `{ success, message }`

---

## Rooms (authenticated)

### GET /rooms

List rooms with optional filters and pagination.

**Query:** `page`, `limit`, `capacityMin`, `capacityMax`, `isActive` (boolean)

**Response:** `200` – `{ success, rooms, total, page, limit, totalPages }`

---

### GET /rooms/:id

Get room by ID.

**Response:** `200` – `{ success, room }`

---

### POST /rooms

Create room. **Admin only.**

**Body (JSON):**
- `name` (string, required)
- `capacity` (number, required, ≥ 1)
- `location` (string, required)
- `description` (optional)
- `isActive` (optional, default true)

**Response:** `201` – `{ success, room }`

---

### PUT /rooms/:id

Update room. **Admin only.**

**Body (JSON):** same as create (all optional)

**Response:** `200` – `{ success, room }`

---

### DELETE /rooms/:id

Delete room. **Admin only.**

**Response:** `200` – `{ success, message }`

---

## Reservations (authenticated)

### POST /reservations

Create a reservation (status: pending). Students only create for themselves.

**Body (JSON):**
- `room` (MongoID, required)
- `date` (ISO date, required)
- `startTime` (string, HH:MM, required)
- `endTime` (string, HH:MM, required)
- `purpose` (string, required)

**Response:** `201` – `{ success, reservation }`

**Rules:** Room must be active, date not in the past, no time conflict with approved reservations.

---

### GET /reservations/my

Get current user’s reservations.

**Query:** `page`, `limit`

**Response:** `200` – `{ success, reservations, total, page, limit, totalPages }`

---

### GET /reservations

List all reservations. **Admin only.**

**Query:** `page`, `limit`, `status`, `roomId`, `fromDate`, `toDate`

**Response:** `200` – `{ success, reservations, total, page, limit, totalPages }`

---

### GET /reservations/:id

Get reservation by ID. Students can only get their own.

**Response:** `200` – `{ success, reservation }`

---

### PUT /reservations/:id/approve

Approve a pending reservation. **Admin only.**

**Body (JSON):** optional `adminComment`

**Response:** `200` – `{ success, reservation }`

---

### PUT /reservations/:id/reject

Reject a pending reservation. **Admin only.**

**Body (JSON):** optional `adminComment`

**Response:** `200` – `{ success, reservation }`

---

### PUT /reservations/:id/cancel

Cancel a pending (or rejected/cancelled) reservation. Student can cancel own; admin can cancel any non-approved.

**Response:** `200` – `{ success, reservation }`

---

### DELETE /reservations/:id

Delete a reservation. **Admin only.**

**Response:** `200` – `{ success, message }`

---

## HTTP Status Codes

- `200` – OK
- `201` – Created
- `400` – Bad request (validation / business rule)
- `401` – Unauthorized (missing or invalid token)
- `403` – Forbidden (wrong role)
- `404` – Not found
- `409` – Conflict (e.g. duplicate email, time conflict)
- `429` – Too many requests (rate limit)
- `500` – Server error

Errors: `{ success: false, message: "..." }`

---

## Swagger UI

When the backend is running, interactive docs are at:

**http://localhost:5000/api-docs**
