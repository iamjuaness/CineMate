import { createClient } from "@/lib/supabase/server"
import type { Movie } from "./types"

export async function getRecommendations(userId: string, limit = 6): Promise<Movie[]> {
  const supabase = await createClient()

  // Obtener preferencias del usuario
  const { data: preferences } = await supabase
    .from("user_preferences")
    .select("favorite_genres, preferred_location_id")
    .eq("user_id", userId)
    .single()

  // Obtener géneros de películas vistas con buenas calificaciones
  const { data: watchedMovies } = await supabase
    .from("watched_movies")
    .select("movies(genre)")
    .eq("user_id", userId)
    .gte("rating", 4)

  // Combinar géneros favoritos con géneros de películas bien calificadas
  const favoriteGenres = preferences?.favorite_genres || []
  const watchedGenres = watchedMovies?.flatMap((item: any) => item.movies.genre || []) || []
  const allGenres = [...new Set([...favoriteGenres, ...watchedGenres])]

  // Obtener películas ya vistas para excluirlas
  const { data: watched } = await supabase.from("watched_movies").select("movie_id").eq("user_id", userId)

  const watchedIds = watched?.map((item) => item.movie_id) || []

  // Construir query de recomendaciones
  let query = supabase
    .from("movies")
    .select(
      `
      *,
      showtimes!inner(
        id,
        location_id,
        show_date
      )
    `,
    )
    .eq("in_theaters", true)
    .gte("showtimes.show_date", new Date().toISOString().split("T")[0])

  // Filtrar por ubicación preferida si existe
  if (preferences?.preferred_location_id) {
    query = query.eq("showtimes.location_id", preferences.preferred_location_id)
  }

  const { data: allMovies } = await query

  // Eliminar duplicados y películas ya vistas
  const uniqueMovies =
    allMovies?.reduce((acc: Movie[], movie: any) => {
      if (!acc.find((m) => m.id === movie.id) && !watchedIds.includes(movie.id)) {
        acc.push(movie)
      }
      return acc
    }, []) || []

  // Calcular puntuación de recomendación basada en géneros
  const scoredMovies = uniqueMovies.map((movie) => {
    const genreMatches = movie.genre.filter((g) => allGenres.includes(g)).length
    const score = genreMatches * 10 + (movie.rating || 0)
    return { ...movie, score }
  })

  // Ordenar por puntuación y rating
  const sortedMovies = scoredMovies.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return (b.rating || 0) - (a.rating || 0)
  })

  return sortedMovies.slice(0, limit)
}
