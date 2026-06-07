# XRent — Project Task Breakdown

> Car rental system. Backend: Spring Boot + JWT + MySQL + Flyway + REST. Frontend: Vue 3.
> This document tracks all work as phased, checkable tasks. Backend and frontend tasks are listed separately within each phase.
>
> **Session handoff note:** Backend complete. Frontend Phases 0, 2, and 3 complete.
> The next session should resume at **Phase 4 Frontend** — toast/error notification system,
> then **Phase 5** integration testing, then **Phase 7** documentation polish.
> All core functionality (auth, car CRUD, bookings) is working end-to-end.

---

## Phase 0 — Project Setup & Tooling ✅

### Backend ✅
- [x] Initialize Spring Boot project (Spring Initializr): Web, Spring Security, Spring Data JPA, Validation, Flyway, MySQL Driver, Lombok
- [x] Configure `application.yml` (datasource, JPA `ddl-auto: validate`, Flyway enabled, Jackson ISO dates)
- [x] Set up profile separation: `application-dev.yml`, `application-prod.yml`
- [x] Externalize secrets (DB credentials, JWT secret) via environment variables
- [x] MySQL via Docker — `docker-compose.yml` at project root (MySQL 8.0, xrent/xrent123, port 3306, named volume)
- [x] Add base package structure (feature packages: auth, user, car, booking, config, security, common)

### Frontend ✅
- [x] Scaffold Vue 3 project with Vite (JavaScript only, no TypeScript)
- [x] Add Vue Router 4, Pinia 2, Axios 1.x
- [x] Set up `.env` / `.env.production` with `VITE_API_BASE_URL`
- [x] Create folder structure: `src/router/`, `src/stores/`, `src/services/`, `src/views/`, `src/components/`, `src/layouts/`
- [x] Create `main.js`, `App.vue`, `vite.config.js`, `index.html`
- [x] Create `services/http.js` — Axios instance, JWT request interceptor, 401 response interceptor
- [x] Create `layouts/AppLayout.vue` — wraps all pages with NavBar + footer + `<router-view>`
- [x] Create `components/common/NavBar.vue` and `AppFooter.vue`

---

## Phase 1 — Database & Migrations (Flyway) ✅

### Backend ✅
- [x] `V1__init.sql` — all tables: users, roles, user_roles, cars, bookings (FKs, indexes, CHECK constraints)
- [x] `V2__seed_data.sql` — roles (ROLE_USER, ROLE_ADMIN), admin user (admin@xrent.com / Admin@xrent1), 6 sample cars
- [x] Flyway runs cleanly on empty DB
- [x] JPA entities match migration schema (`ddl-auto: validate` passes)

> **Note:** Two migration files used (`V1__init.sql` + `V2__seed_data.sql`). Do NOT rename — Flyway checksums are fixed.

---

## Phase 2 — Authentication & Authorization ✅

### Backend ✅
- [x] `User`, `Role` entities with Many-to-Many (`user_roles` join table)
- [x] `UserRepository` (`findByEmail`, `existsByEmail`), `RoleRepository` (`findByName`)
- [x] `CustomUserDetailsService` — loads user by email
- [x] `BCryptPasswordEncoder` (cost 10)
- [x] `JwtTokenProvider` — generate / validate / parse (JJWT 0.12.x API)
- [x] `JwtAuthenticationFilter` (`OncePerRequestFilter`) — reads `Authorization: Bearer` header
- [x] `SecurityFilterChain` — stateless, CORS, public routes, JSON 401/403 handlers
- [x] `POST /api/auth/register` → 201 + JWT
- [x] `POST /api/auth/login` → 200 + JWT
- [x] `@EnableMethodSecurity` — `@PreAuthorize` ready
- [x] DTOs: `RegisterRequest`, `LoginRequest`, `AuthResponse`
- [x] `GlobalExceptionHandler` — 400 / 401 / 403 / 404 / 409 / 500

### Frontend ✅
- [x] `authService.js` — `register(email, password, fullName)`, `login(email, password)`
- [x] `stores/auth.js` — state: token, user, roles, loading, error; actions: register, login, logout, restoreSession; getters: isAuthenticated, isAdmin
- [x] Token stored in `localStorage`, restored on app load via `restoreSession()` called in `main.js` before router
- [x] Axios request interceptor attaches `Authorization: Bearer <token>` from authStore
- [x] Axios response interceptor: on 401 → calls `authStore.clearAuth()` + redirects to `/login`
- [x] `LoginView.vue` — email + password form, loading state, backend error display, link to register
- [x] `RegisterView.vue` — fullName + email + password form, minlength=8 client-side, loading, backend error, link to login
- [x] Router guard: `requiresAuth: true` → redirects unauthenticated to `/login`
- [x] Router guard: `requiresAdmin: true` → redirects non-admin to `/`
- [x] Router guard: `guestOnly: true` → redirects authenticated away from `/login` and `/register`
- [x] `NavBar.vue` — shows Login/Register for guests; shows My Bookings + Admin dropdown + user name + Logout for authenticated; Admin dropdown only for ROLE_ADMIN
- [x] `HomeView.vue` — personalized greeting for authenticated users, CTA links for guests

---

## Phase 3 — Core Module (Cars + Bookings CRUD) ✅

### Backend — Cars ✅
- [x] `Car` entity + `CarRepository` (`existsByLicensePlate`, `existsByLicensePlateAndIdNot`, `findByAvailable`)
- [x] `CarService` — CRUD, availability filter, duplicate license-plate check
- [x] `CarController` — `GET /api/cars` (public, paginated + `?available=true/false`), `GET /api/cars/{id}` (public), `POST/PUT/DELETE` (ADMIN)
- [x] DTOs: `CarRequest` (validated), `CarResponse`, `CarMapper`
- [x] Swagger / OpenAPI: `OpenApiConfig` with JWT bearer auth scheme at `/swagger-ui.html`

### Backend — Bookings ✅
- [x] `Booking.java` entity — `@ManyToOne(LAZY)` to User and Car, `@Enumerated(STRING)` status
- [x] `BookingRepository` — `findByUserId(Pageable)` + JPQL overlap query `countOverlappingBookings`
- [x] `BookingMapper` — `toResponse(Booking)`, accesses lazy-loaded associations within `@Transactional`
- [x] `BookingService` — `createBooking` (date validation, overlap check, price = dailyPrice × days, status=CONFIRMED), `getUserBookings`, `getAllBookings`, `cancelBooking` (ownership check via `AccessDeniedException`)
- [x] `BookingController` — `POST /api/bookings` (AUTH), `GET /api/bookings/me` (AUTH), `DELETE /api/bookings/{id}` (owner or ADMIN), `GET /api/bookings` (ADMIN)
- [x] `Car.java` updated — `@OneToMany(mappedBy = "car", fetch = LAZY) List<Booking> bookings`
- [x] `GlobalExceptionHandler` — `@ExceptionHandler(AccessDeniedException.class)` → 403

### Frontend — Cars ✅
- [x] `carService.js` — `getAll(page, size, available)`, `getById(id)`, `create(data)`, `update(id, data)`, `delete(id)`
- [x] `stores/car.js` — state: cars, currentCar, loading, error, currentPage, totalPages, filterAvailable; actions: fetchCars, fetchCarById, createCar, updateCar, deleteCar, nextPage, prevPage; getters: hasNextPage, hasPrevPage
- [x] `components/cars/CarCard.vue` — car display card, availability badge, link to detail, slot for extra actions
- [x] `views/cars/CarListView.vue` — paginated grid, availability filter buttons (All/Available/Unavailable), loading/empty/error states
- [x] `views/cars/CarDetailView.vue` — fetch car by route param, full detail display, `BookingForm` component embedded
- [x] `views/admin/CarManageView.vue` — admin table (make, model, year, plate, price, status), edit/delete buttons, pagination (ADMIN only)
- [x] `views/admin/AdminCarFormView.vue` — create/edit form with all fields, uses `?id=` query param to detect edit mode (ADMIN only)

### Frontend — Bookings ✅
- [x] `bookingService.js` — `create(carId, startDate, endDate)`, `getMyBookings(page, size)`, `getAllBookings(page, size)`, `cancel(id)`
- [x] `stores/booking.js` — state: bookings, currentBooking, loading, error, currentPage, totalPages, bookingType; actions: fetchMyBookings, fetchAllBookings, createBooking, cancelBooking, nextPage, prevPage; getters: hasNextPage, hasPrevPage
- [x] `components/bookings/BookingForm.vue` — date inputs, live `dayCount` + `totalPrice` calculation, validation (end > start), submit calls bookingStore, redirects to `/bookings/me` on success
- [x] `views/bookings/MyBookingsView.vue` — user's bookings table (car, dates, total, status, cancel button), pagination, loading/empty/error states
- [x] `views/admin/AllBookingsView.vue` — admin table with userEmail + all booking fields, cancel button, pagination (ADMIN only)

---

## Phase 4 — Global Exception Handling & Validation

### Backend ✅
- [x] Standard error shape: `{ timestamp, status, error, message, path }`
- [x] `MethodArgumentNotValidException` → 400 (field messages joined)
- [x] `BadCredentialsException` → 401 (`"Invalid email or password"`)
- [x] `AccessDeniedException` → 403
- [x] `DataIntegrityViolationException` → 409 (FK constraint on car delete with bookings)
- [x] `ResourceNotFoundException` → 404
- [x] `ConflictException` → 409 (duplicate license plate)
- [x] No stack traces or SQL exposed

### Frontend ⏳
- [ ] Build `Notification.vue` toast component (success/error/info, auto-dismiss after ~4s)
- [ ] Create `stores/notification.js` (Pinia) — queue of toasts, add/remove actions
- [ ] Integrate notifications into all store actions (show success on create/update/delete, error on failure)
- [ ] Inline form field error rendering from backend 400 validation responses (field-level messages)
- [ ] Ensure all data views handle `loading`, `empty`, `error` states consistently (already partially done)

---

## Phase 5 — Integration

- [x] CORS configured — `app.cors.allowed-origins` defaults to `http://localhost:5173`
- [ ] End-to-end smoke test: register → login → browse cars → book → view bookings → cancel
- [ ] Verify role gating: USER blocked from admin routes (UI + API both reject)
- [ ] Verify token expiry: expired JWT triggers 401 → interceptor clears auth → redirects to login
- [ ] Verify overlap check: attempting double-booking of same car/dates returns 400
- [ ] Verify car delete blocked when bookings exist (409 from FK constraint)

---

## Phase 6 — Testing & Quality

### Backend
- [ ] Unit tests for `BookingService` (overlap logic, date validation, price calculation)
- [ ] Repository tests (`@DataJpaTest`) for `BookingRepository.countOverlappingBookings`
- [ ] Controller/integration tests (`@SpringBootTest` + MockMvc) for auth + cars + bookings
- [ ] Security tests: protected endpoints reject missing/invalid token
- [ ] Verify Flyway migrations apply on test DB

### Frontend
- [ ] Component tests for `LoginView`, `RegisterView`, `BookingForm` (Vitest)
- [ ] Store tests for `authStore` (login, logout, restoreSession)
- [ ] Manual smoke test of all flows end-to-end

---

## Phase 7 — Documentation & Delivery

- [ ] Update README: add frontend run instructions, `.env` setup, full flow walkthrough
- [x] API documentation — Swagger UI at `http://localhost:8080/swagger-ui.html`
- [x] Seed/demo credentials documented in README
- [ ] Final review against professor's requirements checklist
- [ ] Add `404 Not Found` route/view for unknown paths

---

## Requirements Traceability

| Requirement | Status | Where |
|---|---|---|
| User authentication (register/login) | ✅ Done | Backend + Frontend Phase 2 |
| Role-based authorization (USER, ADMIN) | ✅ Done | Backend + Frontend Phase 2/3 |
| CRUD for main entity (Cars) | ✅ Done | Backend + Frontend Phase 3 |
| CRUD for related entity (Bookings) | ✅ Done | Backend + Frontend Phase 3 |
| Flyway migrations | ✅ Done | Phase 1 |
| Global exception handling (`@RestControllerAdvice`) | ✅ Done | Backend Phase 2/3/4 |
| Entity relationship 1:N (Car ↔ Booking, User ↔ Booking) | ✅ Done | Phase 1/3 |
| Entity relationship M:N (User ↔ Role) | ✅ Done | Phase 1/2 |
| REST API with JSON | ✅ Done | Backend Phase 2/3 |
| JWT stateless auth | ✅ Done | Backend Phase 2 |
| SPA frontend with routing | ✅ Done | Frontend Phase 0/2/3 |
| Full backend↔frontend integration | ⏳ Pending verification | Phase 5 |
| Error notification UI (toasts) | ⏳ Pending | Phase 4 Frontend |
| Test coverage | ⏳ Pending | Phase 6 |

---

## Current File Inventory

### Backend
```
src/main/java/com/xrent/
├── XRentApplication.java
├── config/
│   ├── SecurityConfig.java
│   └── OpenApiConfig.java
├── security/
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   └── CustomUserDetailsService.java
├── auth/
│   ├── AuthController.java
│   ├── AuthService.java
│   └── dto/  RegisterRequest.java, LoginRequest.java, AuthResponse.java
├── user/
│   ├── User.java, Role.java
│   ├── UserRepository.java, RoleRepository.java
├── car/
│   ├── Car.java, CarRepository.java
│   ├── CarService.java, CarController.java
│   └── dto/  CarRequest.java, CarResponse.java, CarMapper.java
├── booking/
│   ├── Booking.java, BookingStatus.java, BookingRepository.java
│   ├── BookingService.java, BookingController.java
│   └── dto/  BookingRequest.java, BookingResponse.java, BookingMapper.java
└── common/exception/
    ├── GlobalExceptionHandler.java
    ├── ErrorResponse.java
    ├── ResourceNotFoundException.java
    ├── BadRequestException.java
    └── ConflictException.java

src/main/resources/
├── application.yml
├── application-dev.yml
├── application-prod.yml
└── db/migration/
    ├── V1__init.sql
    └── V2__seed_data.sql
```

### Frontend
```
frontend/src/
├── main.js                        # Vue app bootstrap, Pinia init, restoreSession()
├── App.vue                        # Root — renders AppLayout
├── router/
│   └── index.js                   # 9 routes, 3 meta guards (requiresAuth, requiresAdmin, guestOnly)
├── services/
│   ├── http.js                    # Axios instance, JWT interceptor, 401 handler
│   ├── authService.js             # register(), login()
│   ├── carService.js              # getAll(), getById(), create(), update(), delete()
│   └── bookingService.js          # create(), getMyBookings(), getAllBookings(), cancel()
├── stores/
│   ├── auth.js                    # token, user, roles, loading, error + CRUD actions
│   ├── car.js                     # cars, currentCar, pagination + CRUD actions
│   └── booking.js                 # bookings, pagination, bookingType + CRUD actions
├── layouts/
│   └── AppLayout.vue              # NavBar + main content + AppFooter
├── components/
│   ├── common/
│   │   ├── NavBar.vue             # Context-aware nav (guest vs auth vs admin)
│   │   └── AppFooter.vue
│   ├── cars/
│   │   └── CarCard.vue            # Reusable car card with availability badge
│   └── bookings/
│       └── BookingForm.vue        # Date picker + live price calc + submit
└── views/
    ├── HomeView.vue               # Guest CTA / personalized greeting
    ├── auth/
    │   ├── LoginView.vue          # Email + password, loading, backend errors
    │   └── RegisterView.vue       # fullName + email + password, validation
    ├── cars/
    │   ├── CarListView.vue        # Paginated grid + availability filter
    │   └── CarDetailView.vue      # Car info + BookingForm
    ├── bookings/
    │   └── MyBookingsView.vue     # User's bookings table, cancel button
    └── admin/
        ├── CarManageView.vue      # Admin CRUD table
        ├── AdminCarFormView.vue   # Create/edit car form (query ?id= for edit)
        └── AllBookingsView.vue    # All bookings table with cancel
```
