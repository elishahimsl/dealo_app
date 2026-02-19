-- Allow authenticated users to insert products, offers, and price snapshots
-- (needed for the camera pipeline to store discovered products)

CREATE POLICY "Authenticated users can insert products"
  ON public.products FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert offers"
  ON public.offers FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update offers"
  ON public.offers FOR UPDATE
  USING (true);

CREATE POLICY "Authenticated users can insert price snapshots"
  ON public.price_snapshots FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
