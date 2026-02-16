-- Seed data for DeaLo database

-- Insert initial merchants
INSERT INTO public.merchants (name, domain, logo_url, affiliate_network, affiliate_tag) VALUES
('Amazon', 'amazon.com', 'https://logo.clearbit.com/amazon.com', 'amazon', 'dealo-20'),
('Target', 'target.com', 'https://logo.clearbit.com/target.com', 'impact', NULL),
('Walmart', 'walmart.com', 'https://logo.clearbit.com/walmart.com', 'impact', NULL),
('Best Buy', 'bestbuy.com', 'https://logo.clearbit.com/bestbuy.com', 'impact', NULL),
('Nike', 'nike.com', 'https://logo.clearbit.com/nike.com', 'direct', NULL);

-- Insert score profiles for different categories
INSERT INTO public.score_profiles (category, sub_scores) VALUES
('Electronics', '{
  "price": {"weight": 0.25, "label": "Price"},
  "features": {"weight": 0.25, "label": "Features"},
  "performance": {"weight": 0.2, "label": "Performance"},
  "battery": {"weight": 0.15, "label": "Battery Life"},
  "durability": {"weight": 0.15, "label": "Durability"}
}'),
('Clothing', '{
  "price": {"weight": 0.3, "label": "Price"},
  "quality": {"weight": 0.25, "label": "Quality"},
  "style": {"weight": 0.2, "label": "Style"},
  "comfort": {"weight": 0.15, "label": "Comfort"},
  "brand": {"weight": 0.1, "label": "Brand Reputation"}
}'),
('Home & Kitchen', '{
  "price": {"weight": 0.2, "label": "Price"},
  "quality": {"weight": 0.25, "label": "Quality"},
  "features": {"weight": 0.2, "label": "Features"},
  "ease_of_use": {"weight": 0.2, "label": "Ease of Use"},
  "durability": {"weight": 0.15, "label": "Durability"}
}'),
('Sports & Outdoors', '{
  "price": {"weight": 0.2, "label": "Price"},
  "performance": {"weight": 0.3, "label": "Performance"},
  "durability": {"weight": 0.2, "label": "Durability"},
  "features": {"weight": 0.15, "label": "Features"},
  "comfort": {"weight": 0.15, "label": "Comfort"}
}');
