-- Habilitar Row Level Security en todas las tablas

-- Profiles
alter table public.profiles enable row level security;

create policy "Los usuarios pueden ver su propio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Los usuarios pueden actualizar su propio perfil"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Los usuarios pueden insertar su propio perfil"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Locations (público - todos pueden ver)
alter table public.locations enable row level security;

create policy "Cualquiera puede ver ubicaciones"
  on public.locations for select
  to authenticated
  using (true);

-- Movies (público - todos pueden ver)
alter table public.movies enable row level security;

create policy "Cualquiera puede ver películas"
  on public.movies for select
  to authenticated
  using (true);

-- Showtimes (público - todos pueden ver)
alter table public.showtimes enable row level security;

create policy "Cualquiera puede ver funciones"
  on public.showtimes for select
  to authenticated
  using (true);

-- Permitir updates solo a authenticated
CREATE POLICY "Allow authenticated update"
ON public.showtimes
FOR UPDATE
TO authenticated
USING (true);

-- Tickets (privado - solo el usuario propietario)
alter table public.tickets enable row level security;

create policy "Los usuarios pueden ver sus propios boletos"
  on public.tickets for select
  using (auth.uid() = user_id);

create policy "Los usuarios pueden crear sus propios boletos"
  on public.tickets for insert
  with check (auth.uid() = user_id);

create policy "Los usuarios pueden actualizar sus propios boletos"
  on public.tickets for update
  using (auth.uid() = user_id);

-- Watched Movies (privado - solo el usuario propietario)
alter table public.watched_movies enable row level security;

create policy "Los usuarios pueden ver sus películas vistas"
  on public.watched_movies for select
  using (auth.uid() = user_id);

create policy "Los usuarios pueden agregar películas vistas"
  on public.watched_movies for insert
  with check (auth.uid() = user_id);

create policy "Los usuarios pueden actualizar sus películas vistas"
  on public.watched_movies for update
  using (auth.uid() = user_id);

create policy "Los usuarios pueden eliminar sus películas vistas"
  on public.watched_movies for delete
  using (auth.uid() = user_id);

-- Watchlist (privado - solo el usuario propietario)
alter table public.watchlist enable row level security;

create policy "Los usuarios pueden ver su watchlist"
  on public.watchlist for select
  using (auth.uid() = user_id);

create policy "Los usuarios pueden agregar a su watchlist"
  on public.watchlist for insert
  with check (auth.uid() = user_id);

create policy "Los usuarios pueden eliminar de su watchlist"
  on public.watchlist for delete
  using (auth.uid() = user_id);

-- User Preferences (privado - solo el usuario propietario)
alter table public.user_preferences enable row level security;

create policy "Los usuarios pueden ver sus preferencias"
  on public.user_preferences for select
  using (auth.uid() = user_id);

create policy "Los usuarios pueden crear sus preferencias"
  on public.user_preferences for insert
  with check (auth.uid() = user_id);

create policy "Los usuarios pueden actualizar sus preferencias"
  on public.user_preferences for update
  using (auth.uid() = user_id);
