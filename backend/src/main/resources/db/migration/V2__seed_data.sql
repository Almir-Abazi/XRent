-- ============================================================
-- XRent – seed data (dev / demo)
-- ============================================================

-- ------------------------------------------------------------
-- Roles
-- ------------------------------------------------------------
INSERT INTO roles (name) VALUES
    ('ROLE_USER'),
    ('ROLE_ADMIN');

-- ------------------------------------------------------------
-- Admin user
-- Email   : admin@xrent.com
-- Password: Admin@xrent1
-- Hash    : BCrypt cost-10 (generated with BCryptPasswordEncoder)
--
-- To regenerate the hash in a Java snippet:
--   new BCryptPasswordEncoder(10).encode("Admin@xrent1")
-- ------------------------------------------------------------
INSERT INTO users (email, password, full_name) VALUES
    (
        'admin@xrent.com',
        '$2a$10$N.zmdr9zkMEJ54Tp17NbNeQTbSMlhB/fXkFqjgAZs3T1DnNc9Wuoe',
        'XRent Admin'
    );

-- Assign ROLE_ADMIN to the admin user
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM   users u
JOIN   roles r ON r.name = 'ROLE_ADMIN'
WHERE  u.email = 'admin@xrent.com';

-- ------------------------------------------------------------
-- Sample cars (for local dev / UI testing)
-- ------------------------------------------------------------
INSERT INTO cars (make, model, year, license_plate, daily_price, available) VALUES
    ('Toyota',     'Corolla',   2022, 'BA-123-AA', 45.00,  TRUE),
    ('Volkswagen', 'Golf',      2023, 'BA-456-BB', 55.00,  TRUE),
    ('BMW',        '3 Series',  2021, 'BA-789-CC', 90.00,  TRUE),
    ('Renault',    'Clio',      2023, 'BA-321-DD', 40.00,  TRUE),
    ('Mercedes',   'C-Class',   2022, 'BA-654-EE', 110.00, TRUE),
    ('Skoda',      'Octavia',   2023, 'BA-987-FF', 50.00,  FALSE);
