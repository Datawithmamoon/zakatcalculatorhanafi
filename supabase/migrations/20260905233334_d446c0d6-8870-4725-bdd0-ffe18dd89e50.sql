ALTER TABLE public.app_settings
  ADD COLUMN IF NOT EXISTS fitrana_amount_per_person numeric NOT NULL DEFAULT 300,
  ADD COLUMN IF NOT EXISTS fitrana_wheat_kg numeric NOT NULL DEFAULT 2.045,
  ADD COLUMN IF NOT EXISTS fitrana_wheat_price_per_kg numeric NOT NULL DEFAULT 150,
  ADD COLUMN IF NOT EXISTS ushr_rate_rain numeric NOT NULL DEFAULT 0.10,
  ADD COLUMN IF NOT EXISTS ushr_rate_irrigated numeric NOT NULL DEFAULT 0.05;