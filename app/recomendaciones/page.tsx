import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NavBar } from "@/components/nav-bar"
import { MovieGrid } from "@/components/movie-grid"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Settings, Sparkles } from "lucide-react"

export default async function RecomendacionesPage() {
  const supabase = await createClient()

  // Autenticación
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Preferencias
  const { data: preferences } = await supabase
    .from("user_preferences")
    .select("*, locations(name, id)")
    .eq("user_id", user.id)
    .maybeSingle()

  // Recuperar géneros y ubicación preferida
  const favoriteGenres = preferences?.favorite_genres || []
  const locationPref = preferences?.locations

  // Buscar películas que tienen al menos un género en favorito y, si hay ubicación preferida, que tengan funciones en esa ubicación:
  let filters = []
  if (favoriteGenres.length > 0) {
    filters.push(`genre.cs.{${favoriteGenres.map((g: string) => `"${g}"`).join(",")}}`)
  }

  let moviesQuery = supabase
    .from("movies")
    .select(
      `
      *,
      showtimes:showtimes!inner(
        id,
        location_id,
        locations (
          id,
          name
        )
      )
      `
    )
    .order("release_date", { ascending: false })

  // Filtrar por géneros (ARRAY column search)
  if (filters.length > 0) {
    moviesQuery = moviesQuery.or(filters.join(","))
  }

  // Fetch movies
  let { data: movies } = await moviesQuery

  // Si hay ubicación preferida, filtrarla a nivel JS (en SQL sería con otro join/filter anidado)
  if (locationPref) {
    movies = movies?.filter((movie: any) =>
      movie.showtimes.some((st: any) => st.locations?.id === locationPref.id)
    )
  }

  // Quitar duplicados por id
  movies = movies?.filter(
    (movie: any, index: number, self: any[]) =>
      self.findIndex((m: any) => m.id === movie.id) === index
  )

  const hasPreferences = favoriteGenres.length > 0

  return (
    <div className="min-h-svh bg-background">
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <h1 className="text-4xl font-bold">Recomendaciones</h1>
            </div>
            <p className="text-muted-foreground">
              {hasPreferences
                ? "Películas seleccionadas especialmente para ti"
                : "Configura tus preferencias para obtener mejores recomendaciones"}
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/perfil">
              <Settings className="mr-2 h-4 w-4" />
              Preferencias
            </Link>
          </Button>
        </div>

        {hasPreferences && (
          <Card className="mb-6 p-4">
            <p className="text-sm text-muted-foreground">
              Basado en tus géneros favoritos:{" "}
              <span className="font-medium text-foreground">{favoriteGenres.join(", ")}</span>
              {locationPref && (
                <>
                  {" "}
                  | Ubicación preferida:{" "}
                  <span className="font-medium text-foreground">{locationPref.name}</span>
                </>
              )}
            </p>
          </Card>
        )}

        {movies && movies.length > 0 ? (
          <MovieGrid movies={movies} />
        ) : (
          <Card className="p-12 text-center">
            <Sparkles className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-semibold">No hay recomendaciones disponibles</h2>
            <p className="mb-4 text-muted-foreground">
              {hasPreferences
                ? "No encontramos películas que coincidan con tus preferencias en este momento"
                : "Configura tus géneros favoritos para comenzar a recibir recomendaciones personalizadas"}
            </p>
            <Button asChild>
              <Link href="/perfil">Configurar Preferencias</Link>
            </Button>
          </Card>
        )}
      </main>
    </div>
  )
}
