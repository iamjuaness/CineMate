import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NavBar } from "@/components/nav-bar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileForm } from "@/components/profile-form"
import { PreferencesForm } from "@/components/preferences-form"
import { UserStats } from "@/components/user-stats"

export default async function PerfilPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Obtener perfil
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Obtener preferencias
  const { data: preferences } = await supabase.from("user_preferences").select("*").eq("user_id", user.id).maybeSingle()

  // Obtener ubicaciones para el selector
  const { data: locations } = await supabase.from("locations").select("*").order("city", { ascending: true })

  // Calcular estadísticas
  const { count: watchedCount } = await supabase
    .from("watched_movies")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  const { count: watchlistCount } = await supabase
    .from("watchlist")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  const { count: ticketsCount } = await supabase
    .from("tickets")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  const { data: ticketsData } = await supabase.from("tickets").select("total_amount").eq("user_id", user.id)

  const totalSpent = ticketsData?.reduce((sum, ticket) => sum + ticket.total_amount, 0) || 0

  // Género favorito
  const { data: watchedMovies } = await supabase.from("watched_movies").select("movies(genre)").eq("user_id", user.id)

  const genreCounts: Record<string, number> = {}
  watchedMovies?.forEach((item: any) => {
    item.movies.genre.forEach((genre: string) => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1
    })
  })

  const favoriteGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"

  // Promedio de calificación
  const { data: ratings } = await supabase
    .from("watched_movies")
    .select("rating")
    .eq("user_id", user.id)
    .not("rating", "is", null)

  const avgRating =
    ratings && ratings.length > 0
      ? (ratings.reduce((sum, item) => sum + (item.rating || 0), 0) / ratings.length).toFixed(1)
      : "N/A"

  return (
    <div className="min-h-svh bg-background">
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Mi Perfil</h1>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Columna izquierda: Perfil y Preferencias */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileForm profile={profile} userId={user.id} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferencias de Contenido</CardTitle>
              </CardHeader>
              <CardContent>
                <PreferencesForm preferences={preferences} locations={locations || []} userId={user.id} />
              </CardContent>
            </Card>
          </div>

          {/* Columna derecha: Estadísticas */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Mis Estadísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <UserStats
                  watchedCount={watchedCount || 0}
                  watchlistCount={watchlistCount || 0}
                  ticketsCount={ticketsCount || 0}
                  totalSpent={totalSpent}
                  favoriteGenre={favoriteGenre}
                  avgRating={avgRating}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
