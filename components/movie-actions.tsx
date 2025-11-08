"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { BookmarkPlus, BookmarkCheck, Eye, Star } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface MovieActionsProps {
  movieId: string
  isInWatchlist: boolean
  isWatched: boolean
  currentRating?: number
}

export function MovieActions({
  movieId,
  isInWatchlist: initialWatchlist,
  isWatched: initialWatched,
  currentRating,
}: MovieActionsProps) {
  const [isInWatchlist, setIsInWatchlist] = useState(initialWatchlist)
  const [isWatched, setIsWatched] = useState(initialWatched)
  const [showRatingDialog, setShowRatingDialog] = useState(false)
  const [selectedRating, setSelectedRating] = useState(currentRating || 0)
  const router = useRouter()
  const supabase = createClient()

  const toggleWatchlist = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    if (isInWatchlist) {
      await supabase.from("watchlist").delete().eq("user_id", user.id).eq("movie_id", movieId)
      setIsInWatchlist(false)
    } else {
      await supabase.from("watchlist").insert({ user_id: user.id, movie_id: movieId })
      setIsInWatchlist(true)
    }
    router.refresh()
  }

  const markAsWatched = async (rating: number) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    if (isWatched) {
      await supabase.from("watched_movies").update({ rating }).eq("user_id", user.id).eq("movie_id", movieId)
    } else {
      await supabase.from("watched_movies").insert({ user_id: user.id, movie_id: movieId, rating })
      setIsWatched(true)
    }

    // Remover de watchlist si está
    if (isInWatchlist) {
      await supabase.from("watchlist").delete().eq("user_id", user.id).eq("movie_id", movieId)
      setIsInWatchlist(false)
    }

    setSelectedRating(rating)
    setShowRatingDialog(false)
    router.refresh()
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button variant={isInWatchlist ? "default" : "outline"} onClick={toggleWatchlist}>
          {isInWatchlist ? (
            <>
              <BookmarkCheck className="mr-2 h-4 w-4" />
              En mi lista
            </>
          ) : (
            <>
              <BookmarkPlus className="mr-2 h-4 w-4" />
              Agregar a mi lista
            </>
          )}
        </Button>
        <Button variant={isWatched ? "default" : "outline"} onClick={() => setShowRatingDialog(true)}>
          <Eye className="mr-2 h-4 w-4" />
          {isWatched ? "Actualizar calificación" : "Marcar como vista"}
        </Button>
      </div>

      <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Califica esta película</DialogTitle>
            <DialogDescription>Selecciona una calificación del 1 al 5</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-2 py-4">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                variant={selectedRating >= rating ? "default" : "outline"}
                size="lg"
                onClick={() => markAsWatched(rating)}
              >
                <Star className={`h-6 w-6 ${selectedRating >= rating ? "fill-yellow-400 text-yellow-400" : ""}`} />
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
