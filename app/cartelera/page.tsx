import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NavBar } from "@/components/nav-bar"
import { MovieGrid } from "@/components/movie-grid"
import { LocationFilter } from "@/components/location-filter"

export default async function CarteleraPage({
  searchParams,
}: {
  searchParams: Promise<{ ubicacion?: string }>
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const params = await searchParams
  const selectedLocationId = params.ubicacion

  // Obtener todas las ubicaciones
  const { data: locations } = await supabase.from("locations").select("*").order("city", { ascending: true })

  // Obtener películas con sus funciones
  let query = supabase
    .from("movies")
    .select(
      `
      *,
      showtimes!inner(
        id,
        location_id,
        show_date,
        show_time,
        available_seats,
        price,
        locations(id, name, city)
      )
    `,
    )
    .eq("in_theaters", true)
    .gte("showtimes.show_date", new Date().toISOString().split("T")[0])

  // Filtrar por ubicación si está seleccionada
  if (selectedLocationId) {
    query = query.eq("showtimes.location_id", selectedLocationId)
  }

  const { data: movies } = await query

  // Eliminar duplicados de películas
  const uniqueMovies =
    movies?.reduce((acc: any[], movie: any) => {
      if (!acc.find((m) => m.id === movie.id)) {
        acc.push(movie)
      }
      return acc
    }, []) || []

  return (
    <div className="min-h-svh bg-background">
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 space-y-4">
          <h1 className="text-4xl font-bold">Cartelera</h1>
          <p className="text-muted-foreground">Descubre las películas disponibles en tu ciudad</p>
          <LocationFilter locations={locations || []} selectedLocationId={selectedLocationId} />
        </div>
        <MovieGrid movies={uniqueMovies} />
      </main>
    </div>
  )
}
