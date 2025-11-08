"use client"

import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, Star, Trash2 } from "lucide-react"
import type { Movie } from "@/lib/types"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface MovieListCardProps {
  movie: Movie
  type: "watched" | "watchlist"
  rating?: number | null
  notes?: string | null
  date: string
  itemId: string
}

export function MovieListCard({ movie, type, rating, notes, date, itemId }: MovieListCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    setIsDeleting(true)
    const table = type === "watched" ? "watched_movies" : "watchlist"

    await supabase.from(table).delete().eq("id", itemId)

    router.refresh()
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-4 p-4 sm:flex-row">
        {/* Poster */}
        <Link href={`/pelicula/${movie.id}`} className="relative h-40 w-28 flex-shrink-0 overflow-hidden rounded">
          <Image
            src={movie.poster_url || "/placeholder.svg?height=600&width=400"}
            alt={movie.title}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
        </Link>

        {/* Información */}
        <div className="flex flex-1 flex-col justify-between">
          <div className="space-y-2">
            <div>
              <Link href={`/pelicula/${movie.id}`}>
                <h3 className="text-lg font-semibold hover:underline">{movie.title}</h3>
              </Link>
              <div className="mt-1 flex flex-wrap gap-1">
                {movie.genre.slice(0, 3).map((genre) => (
                  <Badge key={genre} variant="outline" className="text-xs">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>

            {movie.description && <p className="line-clamp-2 text-sm text-muted-foreground">{movie.description}</p>}

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{movie.duration_minutes} min</span>
              </div>
              {movie.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{movie.rating.toFixed(1)}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {type === "watched" ? "Vista el " : "Agregada el "}
                  {new Date(date).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {type === "watched" && rating && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Tu calificación:</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {type === "watched" && notes && (
              <div className="rounded bg-muted p-2">
                <p className="text-sm italic text-muted-foreground">"{notes}"</p>
              </div>
            )}
          </div>

          <div className="mt-3 flex gap-2">
            <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
              <Link href={`/pelicula/${movie.id}`}>Ver Detalles</Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete} disabled={isDeleting}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
