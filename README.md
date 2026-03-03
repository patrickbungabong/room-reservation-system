# Room Reservation System (MERN)

Production-ready Room Reservation System: **React (Vite)** frontend, **Node.js + Express** backend, **MongoDB**, JWT auth, role-based access (Student / Admin).

## Features

- **Students:** Register, login, view rooms, create reservation requests, view/cancel own reservations
- **Admins:** Login, CRUD rooms, view all reservations, approve/reject requests, manage users
- **Tech:** Controller → Service → Repository pattern, validation, error handling, rate limiting, Winston logging, Swagger, dark mode UI

## Project Structure

```
reservation-system/
├── backend/                 # Express API
│   ├── src/
│   │   ├── config/          # DB, Swagger
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   └── scripts/seed.js
│   ├── server.js
│   ├── Dockerfile
│   └── package.json
├── frontend/                # React (Vite)
│   ├── src/
│   │   ├── api/
│   │   ├── context/
│   │   ├── components/
│   │   └── pages/
│   └── package.json
├── postman/                 # Postman collection
├── docker-compose.yml
├── API.md
└── README.md
```

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

## Installation

### 1. Clone / open project

```bash
cd reservation-system
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env: set MONGODB_URI, JWT_SECRET, etc.
npm install
npm run dev
```

Backend runs at **http://localhost:5000**.

### 3. Frontend

```bash
cd frontend
npm install
# Optional: create .env with VITE_API_URL=http://localhost:5000/api
npm run dev
```

Frontend runs at **http://localhost:5173**.

### 4. Seed data (optional)

With backend and MongoDB running:

```bash
cd backend
npm run seed
```

Creates:
- **Admin:** admin@example.com / admin123  
- **Student:** student1@example.com / student123  

## Environment Variables

### Backend (.env)

| Variable         | Description              | Example                          |
|------------------|--------------------------|----------------------------------|
| NODE_ENV         | environment              | development / production          |
| PORT             | API port                 | 5000                             |
| MONGODB_URI      | MongoDB connection       | mongodb://localhost:27017/room-reservation |
| JWT_SECRET       | JWT signing secret       | long-random-string                |
| JWT_EXPIRE       | Token expiry             | 7d                               |
| RATE_LIMIT_WINDOW_MS | Rate limit window (ms) | 900000                            |
| RATE_LIMIT_MAX   | Max requests per window   | 100                              |
| FRONTEND_URL     | CORS origin              | http://localhost:5173            |

### Frontend (.env)

| Variable      | Description     | Example                     |
|---------------|-----------------|-----------------------------|
| VITE_API_URL  | Backend API URL | http://localhost:5000/api   |

## Docker

### MongoDB only

```bash
docker-compose up -d mongodb
# Then run backend/frontend locally with MONGODB_URI=mongodb://localhost:27017/room-reservation
```

### Backend + MongoDB

```bash
export JWT_SECRET=your-secret
docker-compose up -d
# API: http://localhost:5000
```

## Testing

### Backend (Jest)

```bash
cd backend
npm test
```

Covers auth (register/login) and reservation service (inactive room, past date, time conflict, approve/cancel rules).

### API (Postman)

1. Import `postman/Room-Reservation-API.postman_collection.json`.
2. Run **Login** (e.g. admin@example.com / admin123); collection variable `token` is set automatically.
3. Call other endpoints; they use `Authorization: Bearer {{token}}`.

## API Documentation

- **API.md** – Endpoint list, request/response, status codes.
- **Swagger UI** – http://localhost:5000/api-docs (when backend is running).

## Deployment

### Backend (e.g. Render)

1. Create a Web Service; connect repo, root: `reservation-system/backend` (or monorepo root and set root to backend).
2. Add MongoDB (e.g. Atlas); set **MONGODB_URI**.
3. Set **JWT_SECRET**, **NODE_ENV=production**, **PORT** (if needed).
4. Build: `npm ci`, Start: `npm start`.

### Frontend (e.g. Vercel)

1. Connect repo; root: `reservation-system/frontend` (or set in dashboard).
2. Build: `npm run build`, Output: `dist`.
3. Set **VITE_API_URL** to your deployed backend URL (e.g. `https://your-api.onrender.com/api`).

### Notes

- Use a strong **JWT_SECRET** in production.
- Keep **FRONTEND_URL** (and CORS) aligned with the deployed frontend URL.
- For Render free tier, add a health check to `/api/health`.

## License

MIT.
