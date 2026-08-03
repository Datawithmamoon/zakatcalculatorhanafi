-- ROLES ---------------------------------------------------------------
create type public.app_role as enum ('admin','moderator','user');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users can view own profile" on public.profiles for select to authenticated using (auth.uid() = id or public.has_role(auth.uid(),'admin'));
create policy "Users can update own profile" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);

create policy "Users can view own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id or public.has_role(auth.uid(),'admin'));

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email))
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'user')
  on conflict (user_id, role) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- SETTINGS ------------------------------------------------------------
create table public.app_settings (
  id text primary key default 'global',
  base_currency text not null default 'PKR',
  currency_symbol text not null default 'PKR',
  gold_price_per_gram numeric not null default 30500,
  silver_price_per_gram numeric not null default 360,
  nisab_gold_grams numeric not null default 87.48,
  nisab_silver_grams numeric not null default 612.36,
  zakat_rate numeric not null default 0.025,
  default_nisab_basis text not null default 'silver',
  price_source text not null default 'gold-api.com (spot) + exchangerate-api.com',
  price_source_url text not null default 'https://api.gold-api.com',
  prices_updated_at timestamptz not null default now(),
  auto_refresh_enabled boolean not null default true,
  refresh_interval_minutes integer not null default 60,
  updated_at timestamptz not null default now()
);
grant select on public.app_settings to anon, authenticated;
grant insert, update on public.app_settings to authenticated;
grant all on public.app_settings to service_role;
alter table public.app_settings enable row level security;
create policy "Settings are public to read" on public.app_settings for select to anon, authenticated using (true);
create policy "Admins manage settings" on public.app_settings for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger app_settings_touch before update on public.app_settings for each row execute function public.touch_updated_at();

insert into public.app_settings (id) values ('global');

-- CURRENCY RATES ------------------------------------------------------
create table public.currency_rates (
  code text primary key,
  name text not null,
  rate_per_usd numeric not null,
  source text not null default 'exchangerate-api.com',
  updated_at timestamptz not null default now()
);
grant select on public.currency_rates to anon, authenticated;
grant insert, update, delete on public.currency_rates to authenticated;
grant all on public.currency_rates to service_role;
alter table public.currency_rates enable row level security;
create policy "Rates are public to read" on public.currency_rates for select to anon, authenticated using (true);
create policy "Admins manage rates" on public.currency_rates for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger currency_rates_touch before update on public.currency_rates for each row execute function public.touch_updated_at();

insert into public.currency_rates (code, name, rate_per_usd) values
  ('USD','US Dollar',1),
  ('PKR','Pakistani Rupee',278),
  ('INR','Indian Rupee',83.5),
  ('SAR','Saudi Riyal',3.75),
  ('AED','UAE Dirham',3.67),
  ('GBP','British Pound',0.79),
  ('EUR','Euro',0.92),
  ('BDT','Bangladeshi Taka',117),
  ('MYR','Malaysian Ringgit',4.5),
  ('TRY','Turkish Lira',33);

-- FAQS ----------------------------------------------------------------
create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question_en text not null,
  question_ur text not null default '',
  answer_en text not null,
  answer_ur text not null default '',
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.faqs to anon, authenticated;
grant insert, update, delete on public.faqs to authenticated;
grant all on public.faqs to service_role;
alter table public.faqs enable row level security;
create policy "Published FAQs are public" on public.faqs for select to anon, authenticated using (published or public.has_role(auth.uid(),'admin'));
create policy "Admins manage faqs" on public.faqs for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger faqs_touch before update on public.faqs for each row execute function public.touch_updated_at();

insert into public.faqs (question_en, question_ur, answer_en, answer_ur, sort_order) values
  ('What is the Nisab in Hanafi fiqh?','فقہ حنفی میں نصاب کیا ہے؟','Nisab is the minimum wealth that makes Zakat obligatory: 87.48g of gold or 612.36g of silver. For cash and mixed wealth the Hanafi school applies the silver Nisab.','نصاب وہ کم سے کم مال ہے جس پر زکوٰۃ واجب ہوتی ہے: 87.48 گرام سونا یا 612.36 گرام چاندی۔ نقدی اور مخلوط اموال میں فقہ حنفی چاندی کا نصاب لیتی ہے۔',1),
  ('What is Hawl?','حول کیا ہے؟','Hawl is one full lunar year of ownership over Nisab-level wealth. Zakat is due once the year completes.','حول کا مطلب ہے نصاب کے برابر مال پر ایک مکمل قمری سال کا گزرنا۔ سال پورا ہونے پر زکوٰۃ واجب ہوتی ہے۔',2),
  ('Is Zakat due on my house or car?','کیا مکان یا گاڑی پر زکوٰۃ ہے؟','No. Personal residence, personal vehicle, clothing and tools of trade are Hajat-e-Asliyah (essential needs) and are not Zakatable.','نہیں۔ رہائشی مکان، ذاتی گاڑی، کپڑے اور آلاتِ حرفت حاجاتِ اصلیہ میں شامل ہیں، ان پر زکوٰۃ نہیں۔',3),
  ('How are debts owed to me treated?','مجھے ملنے والے قرض کا حکم؟','Strong (likely recoverable) debt is Zakatable now. Weak or doubtful debt is counted only when actually received.','قرضِ قوی (جس کی وصولی یقینی ہو) پر ابھی زکوٰۃ ہے۔ قرضِ ضعیف یا مشکوک پر وصولی کے بعد حساب ہوگا۔',4);

-- EDUCATIONAL CONTENT -------------------------------------------------
create table public.educational_content (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category text not null default 'general',
  title_en text not null,
  title_ur text not null default '',
  body_en text not null,
  body_ur text not null default '',
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.educational_content to anon, authenticated;
grant insert, update, delete on public.educational_content to authenticated;
grant all on public.educational_content to service_role;
alter table public.educational_content enable row level security;
create policy "Published content is public" on public.educational_content for select to anon, authenticated using (published or public.has_role(auth.uid(),'admin'));
create policy "Admins manage content" on public.educational_content for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger educational_content_touch before update on public.educational_content for each row execute function public.touch_updated_at();

insert into public.educational_content (slug, category, title_en, title_ur, body_en, body_ur, sort_order) values
  ('zakatable-assets','assets','Which assets are Zakatable?','کن اموال پر زکوٰۃ ہے؟','Gold and silver in any form, cash and bank balances, business inventory, shares and investments held for trade, and strong receivables.','ہر شکل میں سونا چاندی، نقدی و بینک بیلنس، مالِ تجارت، تجارتی حصص و سرمایہ کاری اور قرضِ قوی۔',1),
  ('hajat-e-asliyah','assets','Hajat-e-Asliyah (non-Zakatable)','حاجاتِ اصلیہ','Home you live in, personal vehicle, household goods, professional tools, and diamonds or gemstones not held for trade.','رہائشی مکان، ذاتی گاڑی، گھریلو سامان، پیشہ ورانہ اوزار اور غیر تجارتی ہیرے جواہرات۔',2),
  ('liabilities','liabilities','Which debts can be deducted?','کون سے قرض منہا ہوں گے؟','Immediate debts due now: unpaid bills, rent, salaries, short-term loans and the current instalment of long-term financing.','فوری واجب الادا قرض: بل، کرایہ، تنخواہیں، قلیل المدتی قرض اور طویل المدتی قرض کی موجودہ قسط۔',3);