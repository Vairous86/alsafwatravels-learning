# Supabase Login Integration

This document explains the database SQL, RLS rationale, and frontend usage for the device-linked username login system.

## SQL to run
Run `db/supabase_users.sql` in your Supabase project's SQL editor (or via psql) to create the `users` table and the `login_or_register` RPC function.

Key points:
- The `users` table has columns: `id`, `username` (unique), `serial` (unique), `device_id`, `created_at`.
- Row Level Security (RLS) is **enabled** but only a `SELECT` policy is created. No insert/update policies for the anon role are defined.
- The RPC `login_or_register(p_username text, p_device_id text)` encapsulates the login logic **without creating users**: it looks up the username and returns one of `username_invalid`, `serial_assigned`, `ok`, or `device_mismatch`. If the username does not exist the RPC returns `username_invalid` (اليوزر نيم خطأ). If the username exists with a null serial, the RPC will assign a serial and return `serial_assigned`. If the username exists with a serial and the supplied `device_id` does not match, the RPC returns `device_mismatch` (الجهاز غير مطابق).
- The RPC is `SECURITY DEFINER` and has `GRANT EXECUTE` to `anon` so the frontend (using the publishable key) can call it, while direct table writes from the anon role remain blocked.

## Why this architecture?
- Security: By disallowing direct writes and using a `SECURITY DEFINER` RPC that performs validated operations, we reduce the risk of race conditions and incorrect updates from the public key.
- RLS: For a production app, it is recommended to use Supabase Auth and `auth.uid()` in RLS policies. This example demonstrates a device-linked approach without full auth for the requested scenario.

## Frontend
- The frontend component `src/components/Login.tsx` calls `supabase.rpc('login_or_register', { p_username, p_device_id })` and handles the returned `message` to decide whether login is allowed or denied. Map messages to Arabic for the UI:
  - `username_invalid` → "اليوزر نيم خطأ"
  - `device_mismatch` → "الجهاز غير مطابق"
  - `serial_assigned` and `ok` → successful login (show `serial`)
- Device IDs are stored locally (localStorage) to persist device identity across reloads.

### Example RPC calls (psql)
-- Example: unknown username
SELECT * FROM public.login_or_register('not-a-user', 'device-1');
-- returns message = 'username_invalid'

-- Example: existing user without serial
SELECT * FROM public.login_or_register('existing_no_serial', 'device-1');
-- assigns a serial and returns message = 'serial_assigned' and the new serial

-- Example: existing user with serial on same device
SELECT * FROM public.login_or_register('existing_with_serial', 'same-device-id');
-- returns message = 'ok'

-- Example: existing user with serial on different device
SELECT * FROM public.login_or_register('existing_with_serial', 'other-device-id');
-- returns message = 'device_mismatch'

## Notes & further improvements
- Consider integrating Supabase Auth to tie records to authenticated users and write stronger RLS rules using `auth.uid()`.
- Consider rate-limiting and additional validation on `username` (allowed characters, length).
- To change behavior (e.g., allow re-linking after some verification), update the RPC function server-side.
