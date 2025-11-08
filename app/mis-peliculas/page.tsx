import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NavBar } from "@/components/nav-bar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MovieListCard } from "@/components/movie-list-card"
import { Card } from "@/components/ui/card"

export default async function MisPeliculasPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Obtener películas vistas
  const { data: watchedMovies } = await supabase
    .from("watched_movies")
    .select(
      `
      *,
      movies(*)
    `,
    )
    .eq("user_id", user.id)
    .order("watched_date", { ascending: false })

  // Obtener watchlist
  const { data: watchlist } = await supabase
    .from("watchlist")
    .select(
      `
      *,
      movies(*)
    `,
    )
    .eq("user_id", user.id)
    .order("added_date", { ascending: false })

  return (
    <div className="min-h-svh bg-background">
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-2 text-3xl font-bold">Mis Películas</h1>
        <p className="mb-8 text-muted-foreground">Gestiona tus películas vistas y por ver</p>

        <Tabs defaultValue="vistas" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="vistas">Vistas ({watchedMovies?.length || 0})</TabsTrigger>
            <TabsTrigger value="porver">Por Ver ({watchlist?.length || 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="vistas" className="mt-6">
            {watchedMovies && watchedMovies.length > 0 ? (
              <div className="space-y-4">
                {watchedMovies.map((item) => (
                  <MovieListCard
                    key={item.id}
                    movie={item.movies}
                    type="watched"
                    rating={item.rating}
                    notes={item.notes}
                    date={item.watched_date}
                    itemId={item.id}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-lg text-muted-foreground">Aún no has marcado ninguna película como vista</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Ve a la cartelera y comienza a registrar las películas que ves
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="porver" className="mt-6">
            {watchlist && watchlist.length > 0 ? (
              <div className="space-y-4">
                {watchlist.map((item) => (
                  <MovieListCard
                    key={item.id}
                    movie={item.movies}
                    type="watchlist"
                    date={item.added_date}
                    itemId={item.id}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-lg text-muted-foreground">Tu lista de películas por ver está vacía</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Agrega películas desde la cartelera para no olvidarlas
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
