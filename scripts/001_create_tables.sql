-- Crear tabla de perfiles de usuario (gestión de usuarios)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Crear tabla de ubicaciones (ciudades/cines)
create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null,
  address text not null,
  created_at timestamp with time zone default now()
);

-- Crear tabla de películas
create table if not exists public.movies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  poster_url text,
  backdrop_url text,
  duration_minutes integer not null,
  genre text[] not null,
  -- Cambiado decimal a numeric para compatibilidad con PostgreSQL
  rating numeric(2,1),
  release_date date not null,
  director text,
  actors text[],
  trailer_url text,
  in_theaters boolean default true,
  created_at timestamp with time zone default now()
);

-- Crear tabla de funciones (showtimes)
create table if not exists public.showtimes (
  id uuid primary key default gen_random_uuid(),
  movie_id uuid not null references public.movies(id) on delete cascade,
  location_id uuid not null references public.locations(id) on delete cascade,
  show_date date not null,
  show_time time not null,
  available_seats integer not null,
  total_seats integer not null,
  -- Cambiado decimal a numeric para compatibilidad con PostgreSQL
  price numeric(10,2) not null,
  created_at timestamp with time zone default now()
);

-- Crear tabla de compras de boletos
create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  showtime_id uuid not null references public.showtimes(id) on delete cascade,
  seats_count integer not null,
  -- Cambiado decimal a numeric para compatibilidad con PostgreSQL
  total_amount numeric(10,2) not null,
  purchase_date timestamp with time zone default now(),
  qr_code text,
  status text not null default 'active' check (status in ('active', 'used', 'cancelled'))
);

-- Crear tabla de películas vistas
create table if not exists public.watched_movies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  movie_id uuid not null references public.movies(id) on delete cascade,
  watched_date timestamp with time zone default now(),
  rating integer check (rating >= 1 and rating <= 5),
  notes text,
  unique(user_id, movie_id)
);

-- Crear tabla de películas por ver (watchlist)
create table if not exists public.watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  movie_id uuid not null references public.movies(id) on delete cascade,
  added_date timestamp with time zone default now(),
  unique(user_id, movie_id)
);

-- Crear tabla de preferencias de usuario para recomendaciones
create table if not exists public.user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  favorite_genres text[] not null default '{}',
  preferred_location_id uuid references public.locations(id),
  updated_at timestamp with time zone default now()
);

-- Crear índices para mejorar el rendimiento
create index if not exists idx_showtimes_movie on public.showtimes(movie_id);
create index if not exists idx_showtimes_location on public.showtimes(location_id);
create index if not exists idx_showtimes_date on public.showtimes(show_date);
create index if not exists idx_tickets_user on public.tickets(user_id);
create index if not exists idx_watched_user on public.watched_movies(user_id);
create index if not exists idx_watchlist_user on public.watchlist(user_id);
