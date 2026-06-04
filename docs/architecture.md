# XRent — Architecture

Car rental system. This document describes the system architecture, folder structure, entity design, and API surface.

---

## 1. System Architecture

```
┌─────────────────────┐         HTTPS / REST (JSON)        ┌──────────────────────┐
│   Vue 3 Frontend    │  ───────────────────────────────▶  │  Spring Boot Backend │
│  (Vite, SPA)        │  ◀───────────────────────────────  │  (REST API)          │
│                     │   JWT in Authorization header      │                      │
│  - Views/Components │                                     │  - Controllers       │
│  - Pinia stores     │                                     │  - Services          │
│  - Axios services   │                                     │  - Repositories      │
│  - Router + guards  │                                     │  - Security (JWT)    │
└─────────────────────┘                                     └──────────┬───────────┘
                                                                        │ JPA / JDBC
                                                                        ▼
                                                             ┌──────────────────────┐
                                                             │      MySQL DB         │
                                                             │  schema managed by    │
                                                             │      Flyway           │
                                                             └──────────────────────┘
```

**Key decisions (implemented)**
- **Stateless auth**: no server sessions; JWT carries identity + roles. Spring Security session policy = `STATELESS`.
- **Layered backend**: Controller → Service → Repository. DTOs at the boundary; entities never leave the service layer directly.
- **Schema ownership**: Flyway owns the schema. JPA runs in `validate` mode — it never alters tables.
- **SPA frontend**: Vue Router handles client-side routing; backend serves JSON only.
- **JWT library**: JJWT 0.12.x — uses `Jwts.builder().subject()`, `Jwts.parser().verifyWith()` API (not the deprecated 0.11.x `setSubject`/`parserBuilder` API).
- **MySQL via Docker**: `docker-compose.yml` at project root. Credentials: `xrent`/`xrent123`, DB `xrent`, port 3306. Backend connects from IntelliJ to `localhost:3306`.
- **Public car browsing**: `GET /api/cars/**` is `permitAll` — no auth needed to list/view cars.
- **Swagger**: `springdoc-openapi-starter-webmvc-ui:2.7.0` — UI at `/swagger-ui.html`, raw spec at `/v3/api-docs`. Secured paths are `permitAll` in `SecurityConfig`.
- **Timestamps**: `spring.jackson.serialization.write-dates-as-timestamps: false` — `Instant` fields serialize as ISO-8601 strings (e.g. `"2026-06-04T10:00:00Z"`).
- **Error shape**: all errors (filter-chain 401/403 AND controller-chain exceptions) return the same JSON: `{ timestamp, status, error, message, path }`.

---

## 2. Backend Folder Structure

```
backend/
├── src/main/java/com/xrent/
│   ├── XRentApplication.java
│   ├── config/
│   │   ├── SecurityConfig.java          # SecurityFilterChain, CORS, JWT filter, password encoder
│   │   └── OpenApiConfig.java           # Swagger UI + JWT bearer auth scheme
│   ├── security/
│   │   ├── JwtTokenProvider.java        # generate/validate/parse (JJWT 0.12.x)
│   │   ├── JwtAuthenticationFilter.java # OncePerRequestFilter — reads Authorization: Bearer
│   │   └── CustomUserDetailsService.java
│   ├── auth/
│   │   ├── AuthController.java          # POST /api/auth/register, /login
│   │   ├── AuthService.java
│   │   └── dto/ (RegisterRequest, LoginRequest, AuthResponse)
│   ├── user/
│   │   ├── User.java                    # entity — @Table("users")
│   │   ├── Role.java                    # entity — @Table("roles")
│   │   ├── UserRepository.java
│   │   └── RoleRepository.java
│   ├── car/
│   │   ├── Car.java                     # entity — @Table("cars")
│   │   ├── CarRepository.java
│   │   ├── CarService.java
│   │   ├── CarController.java
│   │   └── dto/ (CarRequest, CarResponse, CarMapper)
│   ├── booking/
│   │   ├── BookingStatus.java           # enum: PENDING, CONFIRMED, CANCELLED  ← exists
│   │   ├── Booking.java                 # entity — @Table("bookings")           ← TODO
│   │   ├── BookingRepository.java       # overlap JPQL query                    ← TODO
│   │   ├── BookingService.java                                                   ← TODO
│   │   ├── BookingController.java                                                ← TODO
│   │   └── dto/ (BookingRequest ✅, BookingResponse ✅, BookingMapper ← TODO)
│   └── common/
│       └── exception/
│           ├── GlobalExceptionHandler.java   # @RestControllerAdvice
│           ├── ResourceNotFoundException.java
│           ├── BadRequestException.java
│           ├── ConflictException.java
│           └── ErrorResponse.java            # { timestamp, status, error, message, path }
└── src/main/resources/
    ├── application.yml                  # ddl-auto: validate, Jackson ISO dates, CORS, JWT
    ├── application-dev.yml              # show-sql, debug logging, dev credential defaults
    ├── application-prod.yml             # HikariCP pool settings, warn-level logging
    └── db/migration/
        ├── V1__init.sql                 # ALL tables in one migration (users, roles, user_roles, cars, bookings)
        └── V2__seed_data.sql            # roles, admin user, 6 sample cars
```

> **Migration note:** The original plan listed four separate migration files (V1–V4). The actual
> implementation uses two files: `V1__init.sql` for the complete schema and `V2__seed_data.sql`
> for seed data. Do NOT rename or edit applied migrations — Flyway checksums are immutable.

> Organized by **feature package** (auth, user, car, booking) rather than by layer. Easier to navigate and keeps a small project cohesive.

---

## 3. Frontend Folder Structure

```
frontend/
├── index.html
├── vite.config.js
├── .env / .env.production         # VITE_API_BASE_URL
└── src/
    ├── main.js
    ├── App.vue
    ├── router/
    │   └── index.js               # routes + navigation guards
    ├── stores/                    # Pinia
    │   ├── auth.js
    │   ├── car.js
    │   └── booking.js
    ├── services/                  # Axios API modules
    │   ├── http.js                # axios instance + interceptors
    │   ├── authService.js
    │   ├── carService.js
    │   └── bookingService.js
    ├── views/
    │   ├── auth/ (LoginView.vue, RegisterView.vue)
    │   ├── cars/ (CarListView.vue, CarDetailView.vue)
    │   ├── bookings/ (MyBookingsView.vue)
    │   └── admin/ (CarManageView.vue, AllBookingsView.vue)
    ├── components/
    │   ├── layout/ (NavBar.vue, AppFooter.vue)
    │   ├── cars/ (CarCard.vue, CarForm.vue)
    │   └── common/ (Notification.vue, LoadingSpinner.vue)
    └── assets/
```

---

## 4. Entity Design

Suggested entities for a car rental system:

### User
| Field | Type | Notes |
|---|---|---|
| id | Long (PK) | |
| email | String | unique, login identifier |
| password | String | BCrypt hash |
| fullName | String | |
| roles | Set\<Role\> | Many-to-Many |
| createdAt | Instant | |

### Role
| Field | Type | Notes |
|---|---|---|
| id | Long (PK) | |
| name | String (enum: ROLE_USER, ROLE_ADMIN) | unique |

### Car  ← **primary domain entity**
| Field | Type | Notes |
|---|---|---|
| id | Long (PK) | |
| make | String | e.g. Toyota |
| model | String | e.g. Corolla |
| year | int | |
| licensePlate | String | unique |
| dailyPrice | BigDecimal | |
| available | boolean | |
| bookings | List\<Booking\> | One-to-Many |

### Booking
| Field | Type | Notes |
|---|---|---|
| id | Long (PK) | |
| user | User | Many-to-One |
| car | Car | Many-to-One |
| startDate | LocalDate | |
| endDate | LocalDate | |
| totalPrice | BigDecimal | computed |
| status | enum (PENDING, CONFIRMED, CANCELLED) | |
| createdAt | Instant | |

### Relationships
```
User  ──< Booking >──  Car          (Booking is the join between User and Car)
User  >──────────────<  Role        (Many-to-Many via user_roles)

User   1 ───── N  Booking   (a user has many bookings)
Car    1 ───── N  Booking   (a car has many bookings over time)
User   N ───── M  Role      (role-based authorization)
```

`Booking` is effectively an association entity carrying extra attributes (dates, price, status) — the natural way to model a User renting a Car over a period.

---

## 5. API Structure

Base path: `/api`

### Auth (public)
| Method | Path | Body | Returns |
|---|---|---|---|
| POST | `/api/auth/register` | RegisterRequest | AuthResponse (token) |
| POST | `/api/auth/login` | LoginRequest | AuthResponse (token) |

### Cars ✅ implemented
| Method | Path | Access | Security mechanism | Notes |
|---|---|---|---|---|
| GET | `/api/cars` | public | `SecurityConfig` permitAll | paginated, `?available=true/false` filter |
| GET | `/api/cars/{id}` | public | `SecurityConfig` permitAll | |
| POST | `/api/cars` | ADMIN | `@PreAuthorize("hasRole('ADMIN')")` | creates car |
| PUT | `/api/cars/{id}` | ADMIN | `@PreAuthorize("hasRole('ADMIN')")` | full update |
| DELETE | `/api/cars/{id}` | ADMIN | `@PreAuthorize("hasRole('ADMIN')")` | 409 if car has bookings |

### Bookings ⏳ in progress
| Method | Path | Access | Security mechanism | Notes |
|---|---|---|---|---|
| POST | `/api/bookings` | AUTH | filter chain `.anyRequest().authenticated()` | overlap check, calculates total price |
| GET | `/api/bookings/me` | AUTH | filter chain | own bookings, paginated |
| DELETE | `/api/bookings/{id}` | AUTH (owner) | filter chain + service ownership check | sets status=CANCELLED |
| GET | `/api/bookings` | ADMIN | `@PreAuthorize("hasRole('ADMIN')")` | all bookings, paginated |

### Standard error response
```json
{
  "timestamp": "2026-06-03T10:15:30Z",
  "status": 404,
  "error": "Not Found",
  "message": "Car with id 42 not found",
  "path": "/api/cars/42"
}
```
