import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { NavBar } from "@/components/nav-bar"
import { PurchaseForm } from "@/components/purchase-form"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin } from "lucide-react"

export default async function ComprarBoletoPage({
  params,
}: {
  params: Promise<{ showtimeId: string }>
}) {
  const supabase = await createClient()
  const { showtimeId } = await params

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Obtener información de la función
  const { data: showtime } = await supabase
    .from("showtimes")
    .select(
      `
      *,
      movies(*),
      locations(*)
    `,
    )
    .eq("id", showtimeId)
    .single()

  if (!showtime || !showtime.movies || !showtime.locations) {
    notFound()
  }

  return (
    <div className="min-h-svh bg-background">
      <NavBar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Comprar Boletos</h1>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Información de la película y función */}
          <Card className="p-6">
            <div className="mb-4 flex gap-4">
              <div className="relative h-32 w-24 flex-shrink-0 overflow-hidden rounded">
                <Image
                  src={showtime.movies.poster_url || "/placeholder.svg?height=600&width=400" || "/placeholder.svg"}
                  alt={showtime.movies.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="mb-2 text-xl font-semibold">{showtime.movies.title}</h2>
                <div className="mb-2 flex flex-wrap gap-1">
                  {showtime.movies.genre.slice(0, 2).map((genre: string) => (
                    <Badge key={genre} variant="secondary" className="text-xs">
                      {genre}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{showtime.movies.duration_minutes} min</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 border-t pt-4">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{showtime.locations.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {showtime.locations.city} - {showtime.locations.address}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <p className="font-medium">
                  {new Date(showtime.show_date).toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <p className="font-medium">{showtime.show_time.substring(0, 5)}</p>
              </div>

              <div className="flex items-center justify-between border-t pt-3">
                <span className="text-sm text-muted-foreground">Precio por boleto</span>
                <span className="text-lg font-semibold">${showtime.price.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Asientos disponibles</span>
                <span className="font-medium">{showtime.available_seats}</span>
              </div>
            </div>
          </Card>

          {/* Formulario de compra */}
          <PurchaseForm
            showtimeId={showtimeId}
            price={showtime.price}
            availableSeats={showtime.available_seats}
            userId={user.id}
          />
        </div>
      </main>
    </div>
  )
}
