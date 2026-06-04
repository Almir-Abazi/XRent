# XRent — Car Rental System

A full-stack car rental application built with **Spring Boot** (backend) and **Vue 3** (frontend).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Spring Boot 3.4.1, Java 21 |
| Security | Spring Security, JWT (JJWT 0.12.x) |
| Database | MySQL 8.0 (via Docker) |
| Migrations | Flyway |
| ORM | Spring Data JPA / Hibernate |
| API Docs | Swagger UI (SpringDoc OpenAPI) |
| Frontend | Vue 3, Vite, Pinia, Vue Router, Axios |

---

## Project Status

### ✅ Backend — Complete

| Area | Status |
|---|---|
| Project setup & configuration | ✅ Done |
| Flyway migrations (schema + seed data) | ✅ Done |
| JWT authentication (register / login) | ✅ Done |
| Role-based authorization (USER, ADMIN) | ✅ Done |
| Car CRUD (public read, admin write) | ✅ Done |
| Booking CRUD (create, list, cancel) | ✅ Done |
| Global exception handling | ✅ Done |
| Swagger UI | ✅ Done |
| CORS configuration | ✅ Done |

### ⏳ Frontend — In Progress

| Area | Status |
|---|---|
| Vue 3 + Vite scaffold | ⏳ Pending |
| Auth views (login, register) | ⏳ Pending |
| Car list / detail views | ⏳ Pending |
| Booking flow | ⏳ Pending |
| Admin panel | ⏳ Pending |

---

## Getting Started (Backend)

### Prerequisites

- Java 21
- Maven
- Docker (for MySQL)

### 1. Start the database

```bash
docker-compose up -d
```

This starts MySQL 8.0 on port `3306` with:
- Database: `xrent`
- User: `xrent` / Password: `xrent123`

### 2. Configure environment

Copy the example env file and fill in your values:

```bash
cp backend/.env.example backend/.env
```

The only required change for local dev is the JWT secret — the rest have working defaults.

### 3. Run the backend

```bash
cd backend
mvn spring-boot:run
```

Flyway runs automatically on startup and applies all migrations.

The API is available at: `http://localhost:8080`

### 4. Explore the API

Swagger UI: `http://localhost:8080/swagger-ui.html`

---

## API Overview

### Auth (public)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user, returns JWT |
| POST | `/api/auth/login` | Login, returns JWT |

### Cars (public read / admin write)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/cars` | Public | List all cars (paginated, `?available=true/false`) |
| GET | `/api/cars/{id}` | Public | Get car by ID |
| POST | `/api/cars` | ADMIN | Create a car |
| PUT | `/api/cars/{id}` | ADMIN | Update a car |
| DELETE | `/api/cars/{id}` | ADMIN | Delete a car |

### Bookings (authenticated)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/bookings` | USER | Create a booking (overlap check + price calc) |
| GET | `/api/bookings/me` | USER | Get own bookings (paginated) |
| DELETE | `/api/bookings/{id}` | USER (owner) | Cancel a booking |
| GET | `/api/bookings` | ADMIN | Get all bookings (paginated) |

### Error response shape

```json
{
  "timestamp": "2026-06-04T10:00:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Car not found with id: 42",
  "path": "/api/cars/42"
}
```

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@xrent.com` | `Admin@xrent1` |
| User | Register via `/api/auth/register` | — |

---

## Environment Variables

| Variable | Required | Default (dev) | Description |
|---|---|---|---|
| `JWT_SECRET` | Yes (prod) | Set in `.env` | HMAC-SHA256 signing key (min 32 chars) |
| `JWT_EXPIRATION_MS` | No | `86400000` (24h) | Token lifetime in milliseconds |
| `DB_URL` | No | `localhost:3306/xrent` | JDBC connection URL |
| `DB_USERNAME` | No | `xrent` | Database username |
| `DB_PASSWORD` | No | `xrent123` | Database password |
| `CORS_ALLOWED_ORIGINS` | Yes (prod) | `http://localhost:5173` | Allowed frontend origin |
| `SPRING_PROFILES_ACTIVE` | No | `dev` | Spring profile (`dev` / `prod`) |

---

## Project Structure

```
xrent/
├── docker-compose.yml          # MySQL container
├── docs/                       # Architecture, tasks, coding rules
└── backend/
    ├── pom.xml
    └── src/main/
        ├── java/com/xrent/
        │   ├── auth/           # Register, login, JWT response
        │   ├── booking/        # Booking entity, CRUD, overlap logic
        │   ├── car/            # Car entity, CRUD
        │   ├── user/           # User, Role entities
        │   ├── security/       # JWT provider, filter, UserDetailsService
        │   ├── config/         # SecurityConfig, OpenApiConfig
        │   └── common/         # GlobalExceptionHandler, custom exceptions
        └── resources/
            ├── application.yml
            ├── application-dev.yml
            ├── application-prod.yml
            └── db/migration/
                ├── V1__init.sql        # Full schema
                └── V2__seed_data.sql   # Roles, admin user, sample cars
```
