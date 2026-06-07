# XRent — Project Status

> Last updated: 2026-06-07
> Overall progress: **~75% complete**

---

## Progress by Phase

| Phase | Area | Status | Notes |
|---|---|---|---|
| 0 | Backend setup | ✅ Complete | Spring Boot 3.4.1, Java 21, Docker MySQL |
| 0 | Frontend setup | ✅ Complete | Vue 3, Vite, Router, Pinia, Axios |
| 1 | Flyway migrations | ✅ Complete | V1 schema + V2 seed data |
| 2 | Backend auth | ✅ Complete | JWT, BCrypt, SecurityFilterChain |
| 2 | Frontend auth | ✅ Complete | Login, Register, guards, JWT interceptor |
| 3 | Backend Cars | ✅ Complete | CRUD, pagination, availability filter |
| 3 | Backend Bookings | ✅ Complete | Overlap check, price calc, ownership |
| 3 | Frontend Cars | ✅ Complete | List, detail, admin CRUD form |
| 3 | Frontend Bookings | ✅ Complete | Create, my list, admin list, cancel |
| 4 | Backend exceptions | ✅ Complete | All handlers in GlobalExceptionHandler |
| 4 | Frontend errors | ⏳ Pending | Toast notifications not yet built |
| 5 | Integration tests | ⏳ Pending | End-to-end flow not yet verified |
| 6 | Backend tests | ⏳ Pending | No unit/integration tests yet |
| 6 | Frontend tests | ⏳ Pending | No Vitest tests yet |
| 7 | Documentation | 🔄 Partial | Swagger done, README needs frontend section |

---

## Completed Backend Features

### Authentication & Security
- `POST /api/auth/register` — creates user with `ROLE_USER`, returns JWT
- `POST /api/auth/login` — validates credentials, returns JWT
- JWT validation on every request via `JwtAuthenticationFilter`
- Stateless sessions (`SessionCreationPolicy.STATELESS`)
- BCrypt password hashing (cost 10)
- Role-based authorization via `@PreAuthorize`
- CORS configured for `http://localhost:5173`

### Cars API (public read, admin write)
- `GET /api/cars` — paginated, optional `?available=true/false` filter
- `GET /api/cars/{id}` — single car by ID
- `POST /api/cars` — create (ADMIN only)
- `PUT /api/cars/{id}` — full update (ADMIN only)
- `DELETE /api/cars/{id}` — delete (ADMIN only; 409 if car has bookings)

### Bookings API (authenticated)
- `POST /api/bookings` — creates booking with overlap check + totalPrice = dailyPrice × days
- `GET /api/bookings/me` — paginated list of authenticated user's bookings
- `DELETE /api/bookings/{id}` — sets status=CANCELLED; service checks ownership
- `GET /api/bookings` — all bookings paginated (ADMIN only)

### Exception Handling (all return `{ timestamp, status, error, message, path }`)
- 400 Bad Request — validation, date order, already cancelled
- 401 Unauthorized — bad credentials, no/invalid JWT
- 403 Forbidden — wrong role, booking ownership violation
- 404 Not Found — missing car/booking/user
- 409 Conflict — duplicate license plate, FK constraint (car with bookings)
- 500 Internal Server Error — unhandled exceptions (logged, no details exposed)

### Database
- MySQL 8.0 via Docker Compose
- Flyway owns all schema changes
- JPA runs in `ddl-auto: validate` mode
- Seed data: 2 roles, 1 admin user, 6 sample cars

---

## Completed Frontend Features

### Infrastructure
- Single Axios instance with JWT request interceptor and 401 response interceptor (auto-logout)
- Pinia stores for auth, cars, and bookings
- Vue Router with lazy-loaded routes and three navigation guard types
- JWT token persisted in `localStorage`, restored on every page load/refresh

### Authentication
- Login page (email + password form, backend error display)
- Register page (fullName + email + password, min 8 chars, backend error display)
- Authenticated users redirected away from login/register
- NavBar context-aware: guest links / user links / admin dropdown

### Cars
- Public car list with availability filter (All / Available only / Unavailable)
- Paginated grid layout (`prev` / `next` navigation)
- Car detail page with all fields displayed
- Booking form embedded in car detail page
- Admin car management table (edit/delete, paginated)
- Admin car create/edit form (query param `?id=` for edit mode)

### Bookings
- Booking form with live price calculation (`days × dailyPrice`)
- Client-side date validation (end > start)
- My Bookings page — user's own bookings table with status badges, cancel button
- Admin All Bookings page — all users' bookings with email, status, cancel
- Cancel confirms before API call

### Routes & Access Control

| Route | Name | Access |
|---|---|---|
| `/` | home | public |
| `/login` | login | guest only (redirects if authenticated) |
| `/register` | register | guest only (redirects if authenticated) |
| `/cars` | carList | public |
| `/cars/:id` | carDetail | public |
| `/bookings/me` | myBookings | authenticated |
| `/admin/cars` | adminCars | ADMIN role only |
| `/admin/cars-form` | adminCarForm | ADMIN role only |
| `/admin/bookings` | adminBookings | ADMIN role only |

---

## Remaining Tasks

### High Priority (needed to complete the project)

1. **Phase 4 Frontend — Toast Notifications** (~30 min)
   - Create `stores/notification.js` (Pinia) — add/remove toast queue
   - Create `components/common/Notification.vue` — floating toasts, auto-dismiss in 4s
   - Wire toasts into all store actions (success on create/delete, error on failure)
   - Show field-level validation errors from backend 400 responses

2. **Phase 5 — Integration Verification** (~30 min)
   - Run both backend and frontend locally
   - Smoke test: register → login → browse → book → my bookings → cancel
   - Verify admin flow: login as admin → manage cars → view all bookings
   - Confirm 401 token expiry handling works end-to-end
   - Confirm overlap check returns user-friendly error

3. **Phase 7 — Final Documentation** (~20 min)
   - Update README with frontend run instructions
   - Add 404 catch-all route
   - Final review against professor requirements checklist

### Lower Priority (quality/testing)

4. **Phase 6 — Backend Tests** (optional if time-constrained)
   - Unit tests for `BookingService` overlap logic
   - `@DataJpaTest` for `BookingRepository.countOverlappingBookings`
   - MockMvc integration tests for auth endpoints

5. **Phase 6 — Frontend Tests** (optional if time-constrained)
   - Vitest component tests for `LoginView`, `BookingForm`
   - Store tests for `authStore`

---

## Recommended Next Phase

**Start with Phase 4 Frontend (toast notifications)** — it's the smallest remaining piece and makes every user action feel complete. Then immediately move to Phase 5 integration testing to verify everything works end-to-end before the final documentation pass.

Estimated remaining time: **~1.5 hours** to reach a fully deliverable state.

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@xrent.com` | `Admin@xrent1` |
| User | Register via `/register` | — |

## Quick Start

```bash
# 1. Start MySQL
docker-compose up -d

# 2. Start backend (in /backend)
mvn spring-boot:run

# 3. Start frontend (in /frontend)
npm install
npm run dev

# API: http://localhost:8080
# UI:  http://localhost:5173
# Swagger: http://localhost:8080/swagger-ui.html
```
