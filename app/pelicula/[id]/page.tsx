import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Clock, Star, Calendar, MapPin } from "lucide-react";
import { ShowtimesList } from "@/components/showtimes-list";
import { MovieActions } from "@/components/movie-actions";
import { parseISO, isBefore } from "date-fns";

export default async function PeliculaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { id } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/auth/login");
  }

  // Obtener película
  const { data: movie } = await supabase
    .from("movies")
    .select("*")
    .eq("id", id)
    .single();

  if (!movie) {
    notFound();
  }

  // Hora actual en UTC para comparaciones
  const nowUTC = new Date();

  // Obtener funciones disponibles agrupadas por ubicación
  const { data: rawShowtimes } = await supabase
    .from("showtimes")
    .select(
      `
      *,
      locations(*)
    `
    )
    .eq("movie_id", id)
    .gte("show_datetime", nowUTC.toISOString()) // Comparar con datetime completo
    .order("show_datetime", { ascending: true });

  // Filtrar funciones que no han pasado (doble verificación en cliente)
  const showtimes = rawShowtimes?.filter((showtime) => {
    const showtimeUTC = parseISO(showtime.show_datetime);
    return !isBefore(showtimeUTC, nowUTC);
  }) || [];

  // Verificar si está en watchlist o visto
  const { data: watchlistItem } = await supabase
    .from("watchlist")
    .select("id")
    .eq("user_id", user.id)
    .eq("movie_id", id)
    .single();

  const { data: watchedItem } = await supabase
    .from("watched_movies")
    .select("id, rating")
    .eq("user_id", user.id)
    .eq("movie_id", id)
    .single();

  // Agrupar funciones por ubicación
  const showtimesByLocation = showtimes.reduce((acc: any, showtime: any) => {
    const locationId = showtime.location_id;
    if (!acc[locationId]) {
      acc[locationId] = {
        location: showtime.locations,
        showtimes: [],
      };
    }
    acc[locationId].showtimes.push(showtime);
    return acc;
  }, {});

  return (
    <div className="min-h-svh bg-background">
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* Poster */}
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg lg:sticky lg:top-24 lg:h-fit">
            <Image
              src={movie.poster_url || "/placeholder.svg?height=600&width=400"}
              alt={movie.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Información */}
          <div className="space-y-6">
            <div>
              <h1 className="mb-2 text-4xl font-bold">{movie.title}</h1>
              <div className="mb-4 flex flex-wrap gap-2">
                {movie.genre.map((genre) => (
                  <Badge key={genre} variant="secondary">
                    {genre}
                  </Badge>
                ))}
              </div>
              <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{movie.duration_minutes} minutos</span>
                </div>
                {movie.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{movie.rating.toFixed(1)}/5.0</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(movie.release_date).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <MovieActions
                movieId={movie.id}
                isInWatchlist={!!watchlistItem}
                isWatched={!!watchedItem}
                currentRating={watchedItem?.rating}
              />
            </div>

            {movie.description && (
              <div>
                <h2 className="mb-2 text-xl font-semibold">Sinopsis</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {movie.description}
                </p>
              </div>
            )}

            {movie.director && (
              <div>
                <h2 className="mb-2 text-xl font-semibold">Director</h2>
                <p className="text-muted-foreground">{movie.director}</p>
              </div>
            )}

            {movie.cast && movie.cast.length > 0 && (
              <div>
                <h2 className="mb-2 text-xl font-semibold">Reparto</h2>
                <p className="text-muted-foreground">{movie.cast.join(", ")}</p>
              </div>
            )}

            {/* Funciones */}
            <div>
              <h2 className="mb-4 text-2xl font-semibold">
                Horarios y Ubicaciones
              </h2>
              {showtimesByLocation &&
              Object.keys(showtimesByLocation).length > 0 ? (
                <div className="space-y-4">
                  {Object.values(showtimesByLocation).map((item: any) => (
                    <Card key={item.location.id} className="p-4">
                      <div className="mb-3 flex items-start gap-2">
                        <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                        <div>
                          <h3 className="font-semibold">
                            {item.location.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {item.location.city} - {item.location.address}
                          </p>
                        </div>
                      </div>
                      <ShowtimesList showtimes={item.showtimes} />
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">
                    No hay funciones disponibles para esta película
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
