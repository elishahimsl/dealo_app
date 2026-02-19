-- DeaLo Database Schema
-- Category-adaptive DLO scoring with flexible JSONB breakdown

-- Users table (extends auth.users)
CREATE TABLE public.users (
  id uuid REFERENCES auth.users(id) PRIMARY KEY,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User preferences for personalization
CREATE TABLE public.user_preferences (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  preferred_categories text[],
  favorite_brands text[],
  price_sensitivity float DEFAULT 0.5, -- 0=price-insensitive, 1=price-sensitive
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Merchants/retailers
CREATE TABLE public.merchants (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  domain text UNIQUE NOT NULL,
  logo_url text,
  affiliate_network text DEFAULT 'amazon', -- amazon, impact, direct
  affiliate_tag text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products
CREATE TABLE public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  brand text,
  category text,
  description text,
  image_urls text[],
  upc text UNIQUE, -- Universal Product Code
  ean text UNIQUE, -- European Article Number
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Offers (specific product at a specific merchant)
CREATE TABLE public.offers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  merchant_id uuid REFERENCES public.merchants(id),
  price numeric NOT NULL,
  currency text DEFAULT 'USD',
  availability text DEFAULT 'in_stock', -- in_stock, out_of_stock, limited
  url text NOT NULL,
  affiliate_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Price history for tracking trends
CREATE TABLE public.price_snapshots (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  offer_id uuid REFERENCES public.offers(id) ON DELETE CASCADE,
  price numeric NOT NULL,
  currency text DEFAULT 'USD',
  recorded_at timestamptz DEFAULT now()
);

-- DLO Score profiles (category-adaptive scoring definitions)
CREATE TABLE public.score_profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category text NOT NULL,
  sub_scores jsonb NOT NULL, -- e.g., {"price": {"weight": 0.3, "label": "Price"}, "features": {"weight": 0.25, "label": "Features"}}
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(category)
);

-- DLO Scores (category-adaptive scoring)
CREATE TABLE public.dlo_scores (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  offer_id uuid REFERENCES public.offers(id) ON DELETE CASCADE,
  overall_score numeric NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  sub_scores jsonb NOT NULL, -- e.g., {"price": 85, "features": 78, "durability": 92}
  calculated_at timestamptz DEFAULT now(),
  UNIQUE(offer_id)
);

-- Saved products by users
CREATE TABLE public.saved_products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- User interactions (for personalization)
CREATE TABLE public.user_interactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  interaction_type text NOT NULL, -- view, save, compare, purchase
  metadata jsonb, -- additional context
  created_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_products_brand ON public.products(brand);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_upc ON public.products(upc);
CREATE INDEX idx_offers_product_id ON public.offers(product_id);
CREATE INDEX idx_offers_merchant_id ON public.offers(merchant_id);
CREATE INDEX idx_offers_price ON public.offers(price);
CREATE INDEX idx_price_snapshots_offer_id ON public.price_snapshots(offer_id);
CREATE INDEX idx_price_snapshots_recorded_at ON public.price_snapshots(recorded_at);
CREATE INDEX idx_saved_products_user_id ON public.saved_products(user_id);
CREATE INDEX idx_saved_products_product_id ON public.saved_products(product_id);
CREATE INDEX idx_user_interactions_user_id ON public.user_interactions(user_id);
CREATE INDEX idx_user_interactions_product_id ON public.user_interactions(product_id);
CREATE INDEX idx_user_interactions_created_at ON public.user_interactions(created_at);

-- Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dlo_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.score_profiles ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own saved products" ON public.saved_products FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own saved products" ON public.saved_products FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own interactions" ON public.user_interactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own interactions" ON public.user_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public read access for products, offers, merchants, scores
CREATE POLICY "Products are publicly viewable" ON public.products FOR SELECT USING (true);
CREATE POLICY "Offers are publicly viewable" ON public.offers FOR SELECT USING (true);
CREATE POLICY "Merchants are publicly viewable" ON public.merchants FOR SELECT USING (true);
CREATE POLICY "DLO scores are publicly viewable" ON public.dlo_scores FOR SELECT USING (true);
CREATE POLICY "Price snapshots are publicly viewable" ON public.price_snapshots FOR SELECT USING (true);
CREATE POLICY "Score profiles are publicly viewable" ON public.score_profiles FOR SELECT USING (true);

-- Function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_merchants_updated_at BEFORE UPDATE ON public.merchants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON public.offers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
