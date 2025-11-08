-- Primero eliminar el trigger y función anteriores si existen
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Crear función mejorada para manejar nuevos usuarios
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  -- Insertar perfil del usuario
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = excluded.full_name;

  -- Crear preferencias de usuario por defecto
  insert into public.user_preferences (user_id, favorite_genres)
  values (new.id, '{}')
  on conflict (user_id) do nothing;

  return new;
end;
$$;

-- Crear trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Otorgar permisos necesarios
grant usage on schema public to postgres, anon, authenticated, service_role;
grant all privileges on all tables in schema public to postgres, anon, authenticated, service_role;
grant all privileges on all sequences in schema public to postgres, anon, authenticated, service_role;
