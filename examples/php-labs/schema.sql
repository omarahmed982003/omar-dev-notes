CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    stock INTEGER NOT NULL CHECK (stock >= 0)
);
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS processed_jobs (
    user_id INTEGER NOT NULL REFERENCES users(id),
    job_key TEXT NOT NULL,
    fingerprint TEXT NOT NULL,
    order_id INTEGER REFERENCES orders(id),
    PRIMARY KEY (user_id, job_key)
);
CREATE TABLE IF NOT EXISTS outbox (
    id INTEGER PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id),
    event_type TEXT NOT NULL,
    sent_at TEXT,
    UNIQUE (order_id, event_type)
);
CREATE INDEX IF NOT EXISTS idx_orders_user_created ON orders (user_id, created_at);
INSERT OR IGNORE INTO users (id, name) VALUES (1, 'Omar'), (2, 'Mona');
INSERT OR IGNORE INTO products (id, name, stock) VALUES (1, 'Notebook', 5);
