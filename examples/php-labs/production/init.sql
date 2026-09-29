CREATE TABLE runtime_probe (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    probe_key text NOT NULL UNIQUE,
    created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO runtime_probe (probe_key) VALUES ('compose-ready');
