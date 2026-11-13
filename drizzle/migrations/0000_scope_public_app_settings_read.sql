DROP POLICY IF EXISTS "Settings are public to read" ON public.app_settings;
CREATE POLICY "Settings are public to read" ON public.app_settings
  FOR SELECT TO anon, authenticated
  USING (id = 'global');