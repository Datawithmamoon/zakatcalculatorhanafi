create schema if not exists private;
grant usage on schema private to anon, authenticated, service_role;

create or replace function private.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

revoke all on function private.has_role(uuid, public.app_role) from public;
grant execute on function private.has_role(uuid, public.app_role) to anon, authenticated, service_role;

drop policy "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles for select to authenticated
using ((auth.uid() = id) or private.has_role(auth.uid(), 'admin'));

drop policy "Users can view own roles" on public.user_roles;
create policy "Users can view own roles" on public.user_roles for select to authenticated
using ((auth.uid() = user_id) or private.has_role(auth.uid(), 'admin'));

drop policy "Admins manage rates" on public.currency_rates;
create policy "Admins manage rates" on public.currency_rates for all to authenticated
using (private.has_role(auth.uid(), 'admin')) with check (private.has_role(auth.uid(), 'admin'));

drop policy "Admins manage faqs" on public.faqs;
create policy "Admins manage faqs" on public.faqs for all to authenticated
using (private.has_role(auth.uid(), 'admin')) with check (private.has_role(auth.uid(), 'admin'));

drop policy "Published FAQs are public" on public.faqs;
create policy "Published FAQs are public" on public.faqs for select to anon, authenticated
using (published or private.has_role(auth.uid(), 'admin'));

drop policy "Admins manage content" on public.educational_content;
create policy "Admins manage content" on public.educational_content for all to authenticated
using (private.has_role(auth.uid(), 'admin')) with check (private.has_role(auth.uid(), 'admin'));

drop policy "Published content is public" on public.educational_content;
create policy "Published content is public" on public.educational_content for select to anon, authenticated
using (published or private.has_role(auth.uid(), 'admin'));

drop policy "Admins manage settings" on public.app_settings;
create policy "Admins manage settings" on public.app_settings for all to authenticated
using (private.has_role(auth.uid(), 'admin')) with check (private.has_role(auth.uid(), 'admin'));

drop function if exists public.has_role(uuid, public.app_role);