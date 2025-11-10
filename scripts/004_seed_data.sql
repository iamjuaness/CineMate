-- Datos de ejemplo para desarrollo

-- Insertar ubicaciones de ejemplo
INSERT INTO public.locations (name, city, address) VALUES
  ('Cine Armenia Central', 'Armenia', 'Cra 15 #20-35'),
  ('Cine Buenavista Horizonte', 'Buenavista', 'Calle 3 #8-23'),
  ('Cine Calarcá Plaza', 'Calarcá', 'Av. 25 de Noviembre #7-14'),
  ('Cine Circasia Vive', 'Circasia', 'Cra 6 #10-40'),
  ('Cine Córdoba Esencial', 'Córdoba', 'Calle 9 #5-61'),
  ('Cine Filandia Mirador', 'Filandia', 'Cra 4 #12-06'),
  ('Cine Génova Azul', 'Génova', 'Cra 2 #3-21'),
  ('Cine La Tebaida Sol', 'La Tebaida', 'Av. Principal #20-11'),
  ('Cine Montenegro Premium', 'Montenegro', 'Cra 14 #8-18'),
  ('Cine Pijao Central', 'Pijao', 'Calle 7 #5-42'),
  ('Cine Quimbaya Plaza', 'Quimbaya', 'Cra 9 #6-17'),
  ('Cine Salento Natural', 'Salento', 'Cra 3 #1-44')
ON CONFLICT DO NOTHING;


-- Insertar películas de ejemplo
INSERT INTO public.movies (
  title, description, poster_url, backdrop_url, duration_minutes, genre, rating, release_date, director, actors
) VALUES
  (
    'Dune: Parte Dos',
    'Paul Atreides se une a los Fremen para vengar a su familia y salvar el planeta Arrakis.',
    'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    'https://image.tmdb.org/t/p/w500/ylkdrn23p3gQcHx7ukIfuy2CkTE.jpg',
    166,
    ARRAY['Ciencia Ficción', 'Aventura'],
    4.8,
    '2024-03-01',
    'Denis Villeneuve',
    ARRAY['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Austin Butler']
  ),
  (
    'Bob Marley: One Love',
    'La historia real del icono musical Bob Marley y su lucha por la paz.',
    'https://image.tmdb.org/t/p/w500/tn6fGquvQXzUsbSIWg1OV2GBMNW.jpg',
    'https://image.tmdb.org/t/p/w500/lHPap2xBR7DgWLiu6RsfKESgzAi.jpg',
    104,
    ARRAY['Drama', 'Biografía', 'Musical'],
    4.6,
    '2024-02-14',
    'Reinaldo Marcus Green',
    ARRAY['Kingsley Ben-Adir', 'Lashana Lynch', 'James Norton']
  ),
  (
    'Kung Fu Panda 4',
    'Po debe encontrar un nuevo Guerrero Dragón mientras protege el Valle de la Paz.',
    'https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg',
    'https://image.tmdb.org/t/p/w500/kYgQzzjNis5jJalYtIHgrom0gOx.jpg',
    94,
    ARRAY['Animación', 'Comedia', 'Aventura'],
    4.2,
    '2024-03-15',
    'Mike Mitchell',
    ARRAY['Jack Black', 'Awkwafina', 'Bryan Cranston']
  ),
  (
    'Deadpool y Wolverine',
    'Deadpool se une a Wolverine en una aventura que desafía el multiverso.',
    'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    'https://image.tmdb.org/t/p/w500/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
    128,
    ARRAY['Acción', 'Comedia'],
    4.7,
    '2024-07-25',
    'Shawn Levy',
    ARRAY['Ryan Reynolds', 'Hugh Jackman', 'Morena Baccarin']
  ),
  (
    'Inside Out 2',
    'Alegría, Tristeza y las demás emociones de Riley enfrentan nuevos desafíos adolescentes.',
    'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
    'https://image.tmdb.org/t/p/w500/p5ozvmdgsmbWe0H8Xk7Rc8SCwAB.jpg',
    99,
    ARRAY['Animación', 'Comedia', 'Familiar'],
    4.5,
    '2024-06-14',
    'Kelsey Mann',
    ARRAY['Amy Poehler', 'Phyllis Smith', 'Lewis Black']
  ),
  (
    'Gladiator II',
    'La esperada secuela del clásico de Ridley Scott.',
    'https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg',
    'https://image.tmdb.org/t/p/w500/euYIwmwkmz95mnXvufEmbL6ovhZ.jpg',
    154,
    ARRAY['Acción', 'Drama'],
    4.4,
    '2024-11-22',
    'Ridley Scott',
    ARRAY['Paul Mescal', 'Denzel Washington', 'Pedro Pascal']
  ),
  (
    'Madame Web',
    'Historia de la heroína de Marvel en un thriller sobrenatural.',
    'https://image.tmdb.org/t/p/w500/rULWuutDcN5NvtiZi4FRPzRYWSh.jpg',
    'https://image.tmdb.org/t/p/w500/pwGmXVKUgKN13psUjlhC9zBcq1o.jpg',
    116,
    ARRAY['Acción', 'Ciencia Ficción'],
    3.7,
    '2024-02-14',
    'S.J. Clarkson',
    ARRAY['Dakota Johnson', 'Sydney Sweeney', 'Isabela Merced']
  ),
  (
    'El Apicultor',
    'Un ex-agente de operaciones encubiertas busca venganza.',
    'https://image.tmdb.org/t/p/w500/owuAPJZlkBTTyDkmolF6gRyfsZs.jpg',
    'https://image.tmdb.org/t/p/w500/j5mVeVYoZcxS7xgGckHa9e0SqH7.jpg',
    105,
    ARRAY['Acción', 'Thriller'],
    4.0,
    '2024-01-12',
    'David Ayer',
    ARRAY['Jason Statham', 'Emmy Raver-Lampman']
  ),
  (
    'Furiosa: de la saga Mad Max',
    'Precuela de Mad Max, centrada en el personaje Furiosa.',
    'https://image.tmdb.org/t/p/w500/iADOJ8Zymht2JPMoy3R7xceZprc.jpg',
    'https://image.tmdb.org/t/p/w500/raph7qjAGTMXaIjVxt6ZDSXRzUr.jpg',
    151,
    ARRAY['Acción', 'Aventura'],
    4.6,
    '2024-05-24',
    'George Miller',
    ARRAY['Anya Taylor-Joy', 'Chris Hemsworth']
  ),
  (
    'Godzilla y Kong: El nuevo imperio',
    'Godzilla y Kong enfrentan una nueva amenaza en la Tierra Hueca.',
    'https://image.tmdb.org/t/p/w500/z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg',
    'https://image.tmdb.org/t/p/w500/lLh39Th5plbrQgbQ4zyIULsd0Pp.jpg',
    115,
    ARRAY['Acción', 'Ciencia Ficción'],
    4.1,
    '2024-03-29',
    'Adam Wingard',
    ARRAY['Rebecca Hall', 'Brian Tyree Henry']
  ),
  (
    'Wicked',
    'Historia de la bruja de Oz antes de los hechos de El Mago de Oz.',
    'https://image.tmdb.org/t/p/w500/xDGbZ0JJ3mYaGKy4Nzd9Kph6M9L.jpg',
    'https://image.tmdb.org/t/p/w500/uKb22E0nlzr914bA9KyA5CVCOlV.jpg',
    140,
    ARRAY['Musical', 'Fantasía'],
    4.3,
    '2024-12-13',
    'Jon M. Chu',
    ARRAY['Cynthia Erivo', 'Ariana Grande']
  ),
  (
    'Moana 2',
    'Moana regresa para una nueva aventura por las islas del Pacífico.',
    'https://image.tmdb.org/t/p/w500/aLVkiINlIeCkcZIzb7XHzPYgO6L.jpg',
    'https://image.tmdb.org/t/p/w500/zo8CIjJ2nfNOevqNajwMRO6Hwka.jpg',
    102,
    ARRAY['Animación', 'Aventura'],
    4.5,
    '2024-11-27',
    'David G. Derrick Jr.',
    ARRAY['Auli’i Cravalho', 'Dwayne Johnson']
  ),
  (
    'Joker 2: Folie à Deux',
    'El regreso de Joker acompañado de Harley Quinn.',
    'https://image.tmdb.org/t/p/w500/if8QiqCI7WAGImKcJCfzp6VTyKA.jpg',
    'https://image.tmdb.org/t/p/w500/uGmYqxh8flqkudioyFtD7IJSHxK.jpg',
    136,
    ARRAY['Drama', 'Thriller'],
    4.6,
    '2024-10-04',
    'Todd Phillips',
    ARRAY['Joaquin Phoenix', 'Lady Gaga']
  )
ON CONFLICT DO NOTHING;


-- Nota: Las funciones (showtimes) se crearán dinámicamente según las ubicaciones
-- Crear funciones con TIMESTAMPTZ
DO $$
DECLARE
  movie_rec RECORD;
  location_rec RECORD;
  days_ahead INTEGER;
  colombia_datetime TIMESTAMPTZ;
BEGIN
  FOR movie_rec IN SELECT id FROM public.movies LOOP
    FOR location_rec IN SELECT id FROM public.locations LOOP
      FOR days_ahead IN 0..7 LOOP
        
        -- Función de las 3:00 PM Colombia
        colombia_datetime := (
          (CURRENT_DATE + days_ahead)::TEXT || ' 15:00:00'
        )::TIMESTAMP AT TIME ZONE 'America/Bogota';
        
        INSERT INTO public.showtimes (
          movie_id, 
          location_id, 
          show_datetime,
          available_seats, 
          total_seats, 
          price
        )
        VALUES (
          movie_rec.id,
          location_rec.id,
          colombia_datetime,
          80,
          80,
          5000
        );
        
        -- Función de las 7:00 PM Colombia
        colombia_datetime := (
          (CURRENT_DATE + days_ahead)::TEXT || ' 19:00:00'
        )::TIMESTAMP AT TIME ZONE 'America/Bogota';
        
        INSERT INTO public.showtimes (
          movie_id, 
          location_id, 
          show_datetime,
          available_seats, 
          total_seats, 
          price
        )
        VALUES (
          movie_rec.id,
          location_rec.id,
          colombia_datetime,
          80,
          80,
          8000
        );
        
        -- Función de las 9:30 PM Colombia
        colombia_datetime := (
          (CURRENT_DATE + days_ahead)::TEXT || ' 21:30:00'
        )::TIMESTAMP AT TIME ZONE 'America/Bogota';
        
        INSERT INTO public.showtimes (
          movie_id, 
          location_id, 
          show_datetime,
          available_seats, 
          total_seats, 
          price
        )
        VALUES (
          movie_rec.id,
          location_rec.id,
          colombia_datetime,
          80,
          80,
          9000
        );
        
      END LOOP;
    END LOOP;
  END LOOP;
END $$;