-- ============================================================
-- XRent – initial schema
-- Java type mappings:
--   Long        → BIGINT
--   int         → INT      (not SMALLINT — Hibernate validates SQL type codes)
--   String      → VARCHAR
--   BigDecimal  → DECIMAL(10,2)
--   LocalDate   → DATE
--   Instant     → TIMESTAMP
--   boolean     → BOOLEAN  (MySQL alias for TINYINT(1))
-- ============================================================

-- ------------------------------------------------------------
-- roles
-- Must be created before users because user_roles references it.
-- ------------------------------------------------------------
CREATE TABLE roles (
    id   BIGINT      NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,

    PRIMARY KEY (id),
    CONSTRAINT uq_roles_name UNIQUE (name)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- users
-- ------------------------------------------------------------
CREATE TABLE users (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    email      VARCHAR(255) NOT NULL,
    password   VARCHAR(255) NOT NULL,   -- BCrypt hash, never plaintext
    full_name  VARCHAR(255) NOT NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
                                        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    CONSTRAINT uq_users_email UNIQUE (email)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- user_roles  (Many-to-Many join table)
-- No extra columns – roles carry no per-user metadata.
-- Cascade DELETE from both sides so removing a user or a role
-- automatically cleans up the join rows.
-- ------------------------------------------------------------
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,

    PRIMARY KEY (user_id, role_id),

    CONSTRAINT fk_user_roles_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE,

    CONSTRAINT fk_user_roles_role
        FOREIGN KEY (role_id) REFERENCES roles (id)
        ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- cars  (primary domain entity)
-- ------------------------------------------------------------
CREATE TABLE cars (
    id            BIGINT         NOT NULL AUTO_INCREMENT,
    make          VARCHAR(100)   NOT NULL,
    model         VARCHAR(100)   NOT NULL,
    year          INT            NOT NULL,
    license_plate VARCHAR(20)    NOT NULL,
    daily_price   DECIMAL(10, 2) NOT NULL,
    available     BOOLEAN        NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
                                          ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    CONSTRAINT uq_cars_license_plate  UNIQUE (license_plate),
    CONSTRAINT chk_cars_year          CHECK  (year >= 1886),
    CONSTRAINT chk_cars_daily_price   CHECK  (daily_price > 0)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- bookings  (associates a user, a car, and a date range)
-- ON DELETE RESTRICT on both FKs: a user or car with bookings
-- cannot be deleted — data integrity over convenience.
-- ------------------------------------------------------------
CREATE TABLE bookings (
    id          BIGINT         NOT NULL AUTO_INCREMENT,
    user_id     BIGINT         NOT NULL,
    car_id      BIGINT         NOT NULL,
    start_date  DATE           NOT NULL,
    end_date    DATE           NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status      ENUM('PENDING', 'CONFIRMED', 'CANCELLED')
                               NOT NULL DEFAULT 'PENDING',
    created_at  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
                                        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    CONSTRAINT fk_bookings_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_bookings_car
        FOREIGN KEY (car_id) REFERENCES cars (id)
        ON DELETE RESTRICT,

    -- end_date must be strictly after start_date
    CONSTRAINT chk_bookings_dates
        CHECK (end_date > start_date),

    CONSTRAINT chk_bookings_total_price
        CHECK (total_price >= 0)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Indexes for expected query patterns
-- ------------------------------------------------------------

-- User's own bookings list (GET /api/bookings/me)
CREATE INDEX idx_bookings_user_id ON bookings (user_id);

-- Car availability check (overlapping date range queries)
CREATE INDEX idx_bookings_car_dates ON bookings (car_id, start_date, end_date);

-- Admin filter by status
CREATE INDEX idx_bookings_status ON bookings (status);
