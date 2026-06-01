-- Creates the DB login used by DATABASE_URL (Drizzle `client` pool + db.rls()).
-- Run with ADMIN_DATABASE_URL (postgres). Change the password after first migrate.
-- See README.md → "RLS database user (rls_client)".

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'rls_client') THEN
    CREATE ROLE rls_client WITH LOGIN PASSWORD 'dev-vault-rls-client-change-me';
  END IF;
END
$$;

GRANT CONNECT ON DATABASE postgres TO rls_client;
GRANT USAGE ON SCHEMA public TO rls_client;

GRANT anon TO rls_client;
GRANT authenticated TO rls_client;
