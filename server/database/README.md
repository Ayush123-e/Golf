# 🛠 Supabase SQL Instructions

This directory contains `schema.sql`. Note that SQL commands CANNOT be run directly in your terminal.

### How to Apply Changes
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open the **SQL Editor** in the left sidebar.
3. Paste the contents of `schema.sql` into a new query.
4. Click **Run**.

### Verification
Once run, your tables (profiles, scores, draws, etc.) will be live. You can then run the following command in the `server/` directory to verify the connection:

```bash
npm run test:db
```

### Why "create" failed in terminal
The error `zsh: command not found: create` happened because your terminal is a shell for your Mac, not for PostgreSQL. Only the Supabase Dashboard or a dedicated DB client can understand `create table`.
