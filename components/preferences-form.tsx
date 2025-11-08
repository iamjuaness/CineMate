"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { useRouter } from "next/navigation"
import type { UserPreferences, Location } from "@/lib/types"
import { X } from "lucide-react"

interface PreferencesFormProps {
  preferences: UserPreferences | null
  locations: Location[]
  userId: string
}

const AVAILABLE_GENRES = [
  "Acción",
  "Aventura",
  "Comedia",
  "Drama",
  "Terror",
  "Ciencia Ficción",
  "Fantasía",
  "Romance",
  "Suspenso",
  "Misterio",
  "Animación",
  "Documental",
]

export function PreferencesForm({ preferences, locations, userId }: PreferencesFormProps) {
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>(preferences?.favorite_genres || [])
  const [preferredLocationId, setPreferredLocationId] = useState<string>(
    preferences?.preferred_location_id || "defaultLocationId",
  )
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const addGenre = (genre: string) => {
    if (!favoriteGenres.includes(genre)) {
      setFavoriteGenres([...favoriteGenres, genre])
    }
  }

  const removeGenre = (genre: string) => {
    setFavoriteGenres(favoriteGenres.filter((g) => g !== genre))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase.from("user_preferences").upsert(
        {
          user_id: userId,
          favorite_genres: favoriteGenres,
          preferred_location_id: preferredLocationId === "defaultLocationId" ? null : preferredLocationId,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        },
      )

      if (error) throw error

      setMessage({
        type: "success",
        text: "Preferencias actualizadas correctamente",
      })
      router.refresh()
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Error al actualizar",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Géneros Favoritos</Label>
        <Select onValueChange={addGenre}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona tus géneros favoritos" />
          </SelectTrigger>
          <SelectContent>
            {AVAILABLE_GENRES.map((genre) => (
              <SelectItem key={genre} value={genre}>
                {genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {favoriteGenres.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {favoriteGenres.map((genre) => (
              <Badge key={genre} variant="secondary" className="gap-1">
                {genre}
                <button type="button" onClick={() => removeGenre(genre)} className="ml-1 hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Ubicación Preferida</Label>
        <Select value={preferredLocationId} onValueChange={setPreferredLocationId}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una ubicación" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="defaultLocationId">Sin preferencia</SelectItem>
            {locations.map((location) => (
              <SelectItem key={location.id} value={location.id}>
                {location.name} - {location.city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {message && (
        <div
          className={`rounded-lg border p-3 text-sm ${
            message.type === "success"
              ? "border-green-200 bg-green-50 text-green-600"
              : "border-red-200 bg-red-50 text-red-600"
          }`}
        >
          {message.text}
        </div>
      )}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Guardando..." : "Guardar Preferencias"}
      </Button>
    </form>
  )
}
