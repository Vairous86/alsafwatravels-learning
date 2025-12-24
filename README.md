# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
---

## Supabase login (device-linked username)

This project includes a device-linked login system using Supabase. To set it up:

1. Open your Supabase project (https://efzhjgorhdenmipriqip.supabase.co) and go to the SQL Editor.
2. Run `db/supabase_users.sql` to create the `users` table and the `login_or_register` RPC function.
3. The frontend uses the publishable key in `src/utils/supabase.ts` and the login UI at `src/components/Login.tsx`.

Notes:
- The RPC function implements the required logic: **it does NOT create new users**. If the provided username is not found the RPC returns `username_invalid` (اليوزر نيم خطأ). If the username exists and has a NULL `serial`, the RPC assigns a serial and returns `serial_assigned`. If the username exists with a `serial` and the `device_id` does not match, the RPC returns `device_mismatch` (الجهاز غير مطابق).
- Direct table writes from the public/anonymous role are blocked; the RPC runs with `SECURITY DEFINER` and is granted to `anon`. (The RPC itself performs the necessary writes.)