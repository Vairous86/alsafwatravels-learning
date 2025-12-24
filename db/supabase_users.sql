-- supabase_users.sql
-- Create the "users" table, enable RLS for direct table writes to be blocked,
-- and add a SECURITY DEFINER RPC to safely perform login/register logic.

-- Ensure UUID generation function
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  serial TEXT UNIQUE,
  device_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security so direct writes from the anon role are blocked by default.
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Note: no INSERT/UPDATE/DELETE policies are created for the anon role; with RLS enabled,
-- this means direct anonymous writes are denied by default.

-- Allow public SELECTs so clients can read rows when needed
CREATE POLICY select_all ON public.users FOR SELECT USING (true);

-- RPC function to encapsulate login/register logic and enforce constraints server-side.
-- SECURITY DEFINER runs as the function owner (usually a DB owner) and so can perform
-- the necessary writes while direct table access by the anon key remains disallowed.
CREATE OR REPLACE FUNCTION public.login_or_register(p_username text, p_device_id text)
RETURNS TABLE (
  id bigint,
  username text,
  serial text,
  device_id text,
  created_at timestamptz,
  message text
)
-- This function performs database writes (INSERT/UPDATE), so it must be VOLATILE (not STABLE).
LANGUAGE plpgsql VOLATILE SECURITY DEFINER AS
$$
DECLARE
  v_user public.users%ROWTYPE;
  v_newserial text;
BEGIN
  -- Look up the user by username (qualify column to avoid ambiguity with PL/pgSQL variables)
  SELECT * INTO v_user FROM public.users u WHERE u.username = p_username;

  IF FOUND THEN
    -- User exists
    IF v_user.serial IS NULL THEN
      -- First device linking: generate and save a serial and device_id
      v_newserial := gen_random_uuid()::text;
      UPDATE public.users SET serial = v_newserial, device_id = p_device_id WHERE id = v_user.id;
      RETURN QUERY SELECT u.id, u.username, u.serial, u.device_id, u.created_at, 'serial_assigned' FROM public.users u WHERE u.id = v_user.id;
    ELSE
      -- Already has a serial: check device match
      IF v_user.device_id = p_device_id THEN
        RETURN QUERY SELECT u.id, u.username, u.serial, u.device_id, u.created_at, 'ok' FROM public.users u WHERE u.id = v_user.id;
      ELSE
        RETURN QUERY SELECT u.id, u.username, u.serial, u.device_id, u.created_at, 'device_mismatch' FROM public.users u WHERE u.id = v_user.id;
      END IF;
    END IF;
  ELSE
    -- User does not exist: per business rules we DO NOT create users automatically.
    -- Return an explicit 'username_invalid' message so the frontend can show: "اليوزر نيم خطأ"
    RETURN QUERY SELECT NULL::bigint AS id, p_username AS username, NULL::text AS serial, NULL::text AS device_id, now()::timestamptz AS created_at, 'username_invalid'::text AS message;
  END IF;
END;
$$;

-- Allow the anon/public role to CALL the RPC (so frontend can use the publishable key)
GRANT EXECUTE ON FUNCTION public.login_or_register(text, text) TO anon;

-- Notes:
-- 1) Direct inserts/updates/deletes by the anon role are effectively denied because we didn't
--    create insert/update policies. The RPC uses SECURITY DEFINER so it executes with
--    sufficient privileges while the anon role cannot directly modify rows.
-- 2) For stronger guarantees integrate Supabase Auth and then use "auth.uid()" in RLS
--    policies so updates are tied to authenticated users instead of device-generated IDs.
