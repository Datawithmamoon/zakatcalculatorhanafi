ALTER TABLE public.app_settings
  ADD COLUMN IF NOT EXISTS inheritance_notice_en text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS inheritance_notice_ur text NOT NULL DEFAULT '';