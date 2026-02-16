# Supabase Edge Functions

This folder contains TypeScript edge functions for the DeaLo backend.

## Available Functions

- `ingest-product` - Ingest product data from external APIs
- `search-products` - Search products with Google CSE
- `calculate-dlo-score` - Calculate DLO scores for offers
- `refresh-prices` - Daily price refresh cron job
- `generate-affiliate-link` - Generate affiliate links
- `get-user-saved` - Get user's saved products
- `save-product` - Save a product for a user
- `delete-saved-product` - Remove a saved product

## Deploy

```bash
supabase functions deploy <function-name>
```

## Local Development

```bash
supabase functions serve
```
