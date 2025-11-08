import { MovieCard } from "./movie-card"
import type { Movie } from "@/lib/types"

interface MovieGridProps {
  movies: Movie[]
}

export function MovieGrid({ movies }: MovieGridProps) {
  if (movies.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-xl border-2 border-dashed border-muted bg-card shadow-card animate-fade-in-up">
        <div className="text-center">
          <p className="title-cine text-2xl mb-2">No hay películas disponibles</p>
          <p className="text-muted-foreground">Prueba cambiando la ubicación</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  )
}
