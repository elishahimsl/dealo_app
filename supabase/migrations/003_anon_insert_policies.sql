-- Allow anonymous users (not logged in) to insert products and offers
-- so the scan pipeline works without requiring authentication.
-- Saved products and user interactions still require authentication.

-- Products: allow anon inserts (product data is public)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Anon users can insert products' AND tablename = 'products'
  ) THEN
    CREATE POLICY "Anon users can insert products"
      ON public.products FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

-- Products: allow anon select (product data is public)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Anon users can read products' AND tablename = 'products'
  ) THEN
    CREATE POLICY "Anon users can read products"
      ON public.products FOR SELECT
      USING (true);
  END IF;
END $$;

-- Offers: allow anon inserts
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Anon users can insert offers' AND tablename = 'offers'
  ) THEN
    CREATE POLICY "Anon users can insert offers"
      ON public.offers FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

-- Offers: allow anon select
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Anon users can read offers' AND tablename = 'offers'
  ) THEN
    CREATE POLICY "Anon users can read offers"
      ON public.offers FOR SELECT
      USING (true);
  END IF;
END $$;

-- Price snapshots: allow anon inserts
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Anon users can insert price_snapshots' AND tablename = 'price_snapshots'
  ) THEN
    CREATE POLICY "Anon users can insert price_snapshots"
      ON public.price_snapshots FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

-- Merchants: allow anon select (needed for merchant lookups during scan)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Anon users can read merchants' AND tablename = 'merchants'
  ) THEN
    CREATE POLICY "Anon users can read merchants"
      ON public.merchants FOR SELECT
      USING (true);
  END IF;
END $$;

-- Score profiles: allow anon select (needed for DLO score calculation)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Anon users can read score_profiles' AND tablename = 'score_profiles'
  ) THEN
    CREATE POLICY "Anon users can read score_profiles"
      ON public.score_profiles FOR SELECT
      USING (true);
  END IF;
END $$;
