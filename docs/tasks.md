# XRent — Project Task Breakdown

> Car rental system. Backend: Spring Boot + JWT + MySQL + Flyway + REST. Frontend: Vue 3.
> This document tracks all work as phased, checkable tasks. Backend and frontend tasks are listed separately within each phase.
>
> **Session handoff note:** Backend complete. Frontend Phase 0 (scaffolding) complete.
> The next session should resume at **Phase 2 Frontend** — implement auth views (login, register) and authService.
> All stores, router, HTTP client, and folder structure are ready.

---

## Phase 0 — Project Setup & Tooling ✅

### Backend ✅
- [x] Initialize Spring Boot project (Spring Initializr): Web, Spring Security, Spring Data JPA, Validation, Flyway, MySQL Driver, Lombok
- [x] Configure `application.yml` (datasource, JPA `ddl-auto: validate`, Flyway enabled, Jackson ISO dates)
- [x] Set up profile separation: `application-dev.yml`, `application-prod.yml`
- [x] Externalize secrets (DB credentials, JWT secret) via environment variables
- [x] MySQL via Docker — `docker-compose.yml` at project root (MySQL 8.0, xrent/xrent123, port 3306, named volume)
- [x] Add base package structure (see architecture.md)

### Frontend — Phase 0 ✅
- [x] Scaffold Vue 3 project with Vite
- [x] Add Vue Router, Pinia, Axios
- [x] Set up `.env` files for API base URL (`VITE_API_BASE_URL=http://localhost:8080`)
- [x] Create folder structure: router/, stores/, services/, views/, components/, layouts/
- [x] Create main.js, App.vue, vite.config.js
- [x] Create services/http.js (axios instance + JWT interceptor + 401 redirect)
- [x] Create stub stores: auth.js, car.js, booking.js
- [x] Create AppLayout.vue (NavBar, Footer, main router-view)
- [x] Create route placeholders (no business logic yet)

---

## Phase 1 — Database & Migrations (Flyway) ✅

### Backend ✅
- [x] `V1__init.sql` — all tables in one migration: users, roles, user_roles, cars, bookings (with FKs, indexes, CHECK constraints)
- [x] `V2__seed_data.sql` — roles (ROLE_USER, ROLE_ADMIN), admin user (admin@xrent.com / Admin@xrent1), 6 sample cars
- [x] Flyway runs cleanly on empty DB (verified against Docker container)
- [x] JPA entities match migration schema (`ddl-auto: validate` passes)

> **Note:** The original plan called for four separate migration files (V1–V4). The actual implementation
> uses two files: `V1__init.sql` for the full schema and `V2__seed_data.sql` for seed data.
> Do NOT rename or split these — Flyway checksums are tied to the current filenames.

---

## Phase 2 — Authentication & Authorization ✅

### Backend ✅
- [x] `User`, `Role` entities with Many-to-Many (`user_roles` join table)
- [x] `UserRepository` (`findByEmail`, `existsByEmail`), `RoleRepository` (`findByName`)
- [x] `CustomUserDetailsService` implements `UserDetailsService` (loads by email)
- [x] `BCryptPasswordEncoder` (cost 10) via `SecurityConfig` bean
- [x] `JwtTokenProvider` — generate / validate / parse (JJWT 0.12.x API)
- [x] `JwtAuthenticationFilter` (`OncePerRequestFilter`) — reads `Authorization: Bearer` header
- [x] `SecurityFilterChain` — stateless, CORS, public routes, auth/access-denied handlers (JSON)
- [x] `POST /api/auth/register` — creates user with `ROLE_USER`, returns JWT
- [x] `POST /api/auth/login` — validates credentials, returns JWT
- [x] `@EnableMethodSecurity` — `@PreAuthorize` ready for ADMIN endpoints
- [x] DTOs: `RegisterRequest`, `LoginRequest`, `AuthResponse`
- [x] `GlobalExceptionHandler` (`@RestControllerAdvice`) — 400 / 401 / 403 / 404 / 409 / 500
- [x] `ErrorResponse`, `ResourceNotFoundException`, `BadRequestException`, `ConflictException`

### Frontend — Phase 2 (scaffolding done)
- [x] Router & navigation guards (auth-required + role-required)
- [x] Pinia authStore (token, user, roles, isAuthenticated, clearAuth)
- [x] Axios interceptor for JWT (`Authorization: Bearer <token>`)
- [x] Axios interceptor for 401 (redirect to login)
- [ ] Build LoginView component + form + service call + error handling
- [ ] Build RegisterView component + form + service call + error handling
- [ ] Create authService.js (`register`, `login` methods)
- [ ] Rehydrate token on app load (useAuthStore in router guards)

---

## Phase 3 — Core Module (Cars + Bookings CRUD)

### Backend — Cars ✅
- [x] `Car` entity + `CarRepository` (`existsByLicensePlate`, `existsByLicensePlateAndIdNot`, `findByAvailable`)
- [x] `CarService` — CRUD, availability filter, duplicate license-plate check, `DataIntegrityViolationException` handler
- [x] `CarController` — `GET /api/cars` (public, paginated), `GET /api/cars/{id}` (public), `POST/PUT/DELETE` (ADMIN)
- [x] DTOs: `CarRequest` (validated), `CarResponse`, `CarMapper`
- [x] Bean Validation: `@NotBlank`, `@Size`, `@Min(1886)`, `@Max(2100)`, `@Positive`
- [x] Pagination + `?available=true/false` filter
- [x] SecurityConfig updated: `GET /api/cars/**` is `permitAll`
- [x] Swagger / OpenAPI: `OpenApiConfig` with JWT bearer auth scheme — UI at `/swagger-ui.html`

### Backend — Bookings ✅
- [x] `booking/BookingStatus.java` — enum: PENDING, CONFIRMED, CANCELLED
- [x] `booking/dto/BookingRequest.java` — `carId`, `startDate` (@FutureOrPresent), `endDate` (@Future)
- [x] `booking/dto/BookingResponse.java` — flat DTO with car + user fields
- [x] `booking/Booking.java` — entity mapping `bookings` table; `@ManyToOne(LAZY)` to User and Car; `@Enumerated(STRING)` for status; `@CreationTimestamp`/`@UpdateTimestamp`
- [x] `booking/BookingRepository.java` — `findByUserId(Pageable)` + JPQL overlap query (`countOverlappingBookings`)
- [x] `booking/dto/BookingMapper.java` — `toResponse(Booking)` accessing lazy-loaded user + car within `@Transactional`
- [x] `booking/BookingService.java` — `createBooking`, `getUserBookings`, `getAllBookings`, `cancelBooking`; date validation; overlap check; total price = `dailyPrice × days`; ownership check via `AccessDeniedException`
- [x] `booking/BookingController.java` — `POST /api/bookings`, `GET /api/bookings/me`, `GET /api/bookings` (ADMIN), `DELETE /api/bookings/{id}`; uses `@AuthenticationPrincipal UserDetails`
- [x] `car/Car.java` — added `@OneToMany(mappedBy = "car", fetch = LAZY) List<Booking> bookings`
- [x] `GlobalExceptionHandler` — added `@ExceptionHandler(AccessDeniedException.class)` → 403 (for ownership violations thrown from service)

### Frontend — Phase 3 (stores & services stubbed)
- [ ] Create carService.js (getAll, getById, create, update, delete)
- [ ] Create bookingService.js (create, getMyBookings, getAllBookings, cancel)
- [ ] Implement carStore (state mutations, actions for CRUD)
- [ ] Implement bookingStore (state mutations, actions for CRUD)
- [ ] Build CarListView (fetch, paginate, filter by availability)
- [ ] Build CarDetailView (fetch by ID, display, booking button)
- [ ] Build CarForm component (create/edit modal or form page) — ADMIN only
- [ ] Admin CarManageView (CRUD interface for cars) — ADMIN only
- [ ] Booking form/modal (date picker, price calculation, submit)
- [ ] Build MyBookingsView (list user bookings, cancel button)
- [ ] Admin AllBookingsView (list all bookings, filter by status) — ADMIN only
- [ ] CarCard component (display car in list)

---

## Phase 4 — Global Exception Handling & Validation

### Backend ✅ (completed during Phase 2 & 3)
- [x] Custom exceptions: `ResourceNotFoundException`, `BadRequestException`, `ConflictException`
- [x] `@RestControllerAdvice` `GlobalExceptionHandler` — single source of truth
- [x] Standard error shape: `{ timestamp, status, error, message, path }`
- [x] Validation errors (`MethodArgumentNotValidException`) → field messages joined
- [x] Auth errors: 401 via `authenticationEntryPoint`, 403 via `accessDeniedHandler` (both JSON)
- [x] `DataIntegrityViolationException` → 409 (FK RESTRICT fires on car delete with bookings)
- [x] `BadCredentialsException` → 401 with generic message ("Invalid email or password")
- [x] `AccessDeniedException` → 403 (for booking ownership violations — added to `GlobalExceptionHandler`)
- [x] No stack traces or SQL exposed in any response

### Frontend — Phase 4
- [ ] Build Notification component (toast, auto-dismiss)
- [ ] Create notificationStore (Pinia) for toast state
- [ ] Map backend errors to user-friendly messages
- [ ] Inline form field error rendering (validation responses from backend)
- [ ] Handle `loading`, `empty`, `error` states in all data views

---

## Phase 5 — Integration

- [x] CORS configured on backend (`app.cors.allowed-origins`, defaults to `http://localhost:5173`)
- [ ] End-to-end: register → login → browse cars → book → view bookings
- [ ] Verify role gating works (USER blocked from admin actions in UI + API)
- [ ] Confirm token expiry handling end-to-end
- [ ] Loading/empty/error states wired for all data views

---

## Phase 6 — Testing & Quality

### Backend
- [ ] Unit tests for services (booking overlap logic, availability)
- [ ] Repository tests (`@DataJpaTest`)
- [ ] Controller/integration tests (`@SpringBootTest` + MockMvc) for auth & CRUD
- [ ] Security tests: protected endpoints reject missing/invalid token
- [ ] Verify Flyway migrations apply on test DB

### Frontend
- [ ] Component tests for forms (Vitest)
- [ ] Store tests (auth flow, token handling)
- [ ] Manual smoke test of all flows

---

## Phase 7 — Documentation & Delivery

- [ ] README: setup, run instructions (backend + frontend), env vars, Docker
- [x] API documentation — Swagger UI at `http://localhost:8080/swagger-ui.html`
- [ ] Seed/demo credentials in README (admin@xrent.com / Admin@xrent1)
- [ ] Final review against professor's requirements checklist

---

## Requirements Traceability

| Requirement | Status | Covered by |
|---|---|---|
| User authentication (register/login) | ✅ Done | Phase 2 |
| Role-based authorization (USER, ADMIN) | ✅ Done | Phase 2 |
| CRUD for one main entity | ✅ Done (Cars + Bookings) | Phase 3 |
| Flyway migrations | ✅ Done | Phase 1 |
| Global exception handling (`@RestControllerAdvice`) | ✅ Done | Phase 2/3 |
| Entity relationship (1:N / M:N) | ✅ Done (M:N User↔Role, 1:N Car/User↔Booking) | Phase 2/3 |
| Full backend↔frontend REST integration | ⏳ Phase 2–5 in progress | Phase 2–5 |
| Frontend project setup (Vue 3, Router, Pinia, Axios) | ✅ Done | Phase 0 |

---

## Current File Inventory (backend)

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
│   └── dto/  RegisterRequest, LoginRequest, AuthResponse
├── user/
│   ├── User.java, Role.java
│   ├── UserRepository.java, RoleRepository.java
├── car/
│   ├── Car.java, CarRepository.java
│   ├── CarService.java, CarController.java
│   └── dto/  CarRequest, CarResponse, CarMapper
├── booking/
│   ├── BookingStatus.java              ← exists
│   └── dto/  BookingRequest, BookingResponse  ← exist
│   (Booking.java, BookingRepository.java, BookingMapper.java,
│    BookingService.java, BookingController.java — TO BE CREATED)
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
