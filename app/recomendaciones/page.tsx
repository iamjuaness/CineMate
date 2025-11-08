import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NavBar } from "@/components/nav-bar"
import { MovieGrid } from "@/components/movie-grid"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Settings, Sparkles } from "lucide-react"
import { getRecommendations } from "@/lib/recommendations"

export default async function RecomendacionesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Obtener preferencias del usuario
  const { data: preferences } = await supabase
    .from("user_preferences")
    .select("*, locations(name)")
    .eq("user_id", user.id)
    .maybeSingle()

  // Obtener recomendaciones
  const recommendations = await getRecommendations(user.id, 12)

  const hasPreferences = preferences?.favorite_genres && preferences.favorite_genres.length > 0

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

        {hasPreferences && preferences.favorite_genres.length > 0 && (
          <Card className="mb-6 p-4">
            <p className="text-sm text-muted-foreground">
              Basado en tus géneros favoritos:{" "}
              <span className="font-medium text-foreground">{preferences.favorite_genres.join(", ")}</span>
              {preferences.locations && (
                <>
                  {" "}
                  | Ubicación preferida:{" "}
                  <span className="font-medium text-foreground">{preferences.locations.name}</span>
                </>
              )}
            </p>
          </Card>
        )}

        {recommendations.length > 0 ? (
          <MovieGrid movies={recommendations} />
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
