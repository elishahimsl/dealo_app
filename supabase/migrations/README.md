# Supabase Migrations

This folder contains SQL migration files for the DeaLo database schema.

To run migrations:
```bash
supabase db push
```

To generate new migrations:
```bash
supabase db diff --schema public --use-migra
```
