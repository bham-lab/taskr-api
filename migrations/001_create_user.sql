CREATE TABLE IF NOT EXISTS users(
    id    SERIAL PRIMARY KEY,
    name  VARCHAR(200) NOT NULL,
    email  VARCHAR(200) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    avatar  TEXT,
    avatar_public_id TEXT,
    password_reset_token TEXT,
    password_reset_expire  BIGINT,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
)
