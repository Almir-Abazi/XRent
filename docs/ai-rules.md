# XRent — Coding Rules & Standards

Conventions for this project. Applies to humans and AI assistants contributing code. Keep it simple — this is a focused academic project, not enterprise infrastructure.

---

## 1. Spring Boot (Backend)

### Architecture
- Strict layering: **Controller → Service → Repository**. No skipping layers, no business logic in controllers.
- Controllers handle HTTP only (parse request, call service, return response).
- Services hold business logic and are `@Transactional` where they mutate data.
- Repositories are Spring Data JPA interfaces — no custom JDBC unless justified.

### DTOs & entities
- **Never expose JPA entities directly** in controllers. Use request/response DTOs.
- Map entity ↔ DTO in a dedicated mapper (manual or MapStruct). Keep mapping out of controllers.
- Request DTOs use Bean Validation annotations (`@NotNull`, `@Email`, `@Positive`, `@Future`, etc.).

### Naming & style
- Packages by feature (`car`, `booking`, `auth`), not by layer.
- Classes: `XxxController`, `XxxService`, `XxxRepository`, `XxxRequest`, `XxxResponse`.
- Use constructor injection (no `@Autowired` on fields). Lombok `@RequiredArgsConstructor` is fine.
- Prefer `Optional` from repositories; throw `ResourceNotFoundException` when absent.

### Persistence
- **Flyway owns the schema.** JPA runs `ddl-auto: validate` — never `update` or `create`.
- Every schema change = a new versioned migration (`V{n}__description.sql`). Never edit an applied migration.
- Use `BigDecimal` for money, `LocalDate`/`Instant` for time. No floats for currency.

### Error handling
- One `@RestControllerAdvice` (`GlobalExceptionHandler`) for all exceptions.
- Throw domain exceptions from services; map them to HTTP status in the advice.
- Return the standard error shape (see architecture.md). Never leak stack traces or SQL.

---

## 2. Vue 3 (Frontend)

### Component style
- Use `<script setup>` with the Composition API everywhere.
- One responsibility per component. Views compose smaller components.
- Props down, events up. No mutating props.

### State & data
- **Pinia** for shared state (auth, cars, bookings). Local UI state stays in the component.
- All HTTP goes through Axios service modules in `services/` — components never call `axios` directly.
- Single Axios instance (`http.js`) with interceptors for the token and 401 handling.

### Routing
- Vue Router with navigation guards for auth-required and role-required routes.
- Lazy-load route components.

### UX baseline
- Every data view handles three states: **loading, empty, error**.
- Validate forms client-side, but treat the backend as the source of truth (render its validation errors).

### Style
- `camelCase` for variables/functions, `PascalCase` for components.
- Keep templates declarative; push logic into computed properties / composables.

---

## 3. Security Rules (JWT & Roles)

- **Stateless** sessions only (`SessionCreationPolicy.STATELESS`). No server-side session store.
- Passwords hashed with **BCrypt**. Never store or log plaintext passwords.
- JWT secret comes from an **environment variable**, never committed to source.
- JWT carries user id + roles; set a reasonable expiry. Validate signature + expiry on every request via `JwtAuthenticationFilter`.
- Authorize at the method level with `@PreAuthorize("hasRole('ADMIN')")` for admin actions; don't rely on the frontend to hide buttons.
- Roles stored as `ROLE_USER` / `ROLE_ADMIN`. Default new registrations to `USER`.
- Backend re-checks ownership (e.g. a USER can only cancel *their own* booking) — never trust client-supplied user ids.
- CORS restricted to the known frontend origin, not `*`, in production.
- Frontend stores the token but treats it as untrusted UI hint only; all real enforcement is server-side.

---

## 4. Best Practices

- **No overengineering.** Build only what the requirements ask for. No premature abstractions, no speculative config, no microservices.
- **Clean architecture, small footprint.** Clear layers, small classes, descriptive names beat clever code.
- **Single source of truth** for schema (Flyway) and for auth state (backend).
- **Consistent responses.** Same success/error JSON shapes across endpoints.
- **Fail loudly in dev, safely in prod.** Validate inputs; return meaningful 4xx; never expose internals on 5xx.
- **Commit migrations and code together** so the schema and entities never drift.
- **Tests for logic that can break**: booking-overlap rules, auth gating. Don't chase 100% coverage of trivial getters.
- **Secrets out of git.** Use `.env` / environment variables; provide `.env.example` instead.
- Keep dependencies minimal — every added library should earn its place.
