import { createClient } from "@/lib/supabase/server"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, TicketIcon, CheckCircle, XCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface PageProps {
  params: Promise<{
    qrCode: string
  }>
}

export default async function ValidateTicketPage({ params }: PageProps) {
  const { qrCode } = await params
  const supabase = await createClient()

  // Buscar el ticket con el código QR
  const { data: ticket, error } = await supabase
    .from("tickets")
    .select(`
      *,
      showtimes (
        *,
        movies (*),
        locations (*)
      )
    `)
    .eq("qr_code", qrCode)
    .single()

  if (error || !ticket) {
    return (
      <div className="container mx-auto max-w-2xl py-10">
        <Card className="p-8 text-center">
          <XCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
          <h1 className="mb-2 text-2xl font-bold text-red-600">Boleto Inválido</h1>
          <p className="text-muted-foreground">
            El código QR escaneado no corresponde a ningún boleto válido.
          </p>
          <Button asChild className="mt-6">
            <Link href="/">Volver al Inicio</Link>
          </Button>
        </Card>
      </div>
    )
  }

  const movie = ticket.showtimes.movies
  const location = ticket.showtimes.locations
  
  // Parsear fecha correctamente sin offset UTC
  const [year, month, day] = ticket.showtimes.show_date.split("-").map(Number)
  const [hours, minutes] = ticket.showtimes.show_time.split(":").map(Number)
  const showDateTime = new Date(year, month - 1, day, hours, minutes)
  
  // Fecha actual en Colombia
  const nowColombia = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Bogota" })
  )
  
  const isPast = showDateTime < nowColombia
  const isValid = ticket.status === "active" && !isPast

  return (
    <div className="container mx-auto max-w-3xl py-10">
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 text-center">
          {isValid ? (
            <>
              <CheckCircle className="mx-auto mb-3 h-16 w-16 text-green-500" />
              <h1 className="text-3xl font-bold text-green-600">Boleto Válido</h1>
              <p className="mt-2 text-sm text-muted-foreground">Este boleto puede ser usado para ingresar</p>
            </>
          ) : (
            <>
              <XCircle className="mx-auto mb-3 h-16 w-16 text-red-500" />
              <h1 className="text-3xl font-bold text-red-600">
                {ticket.status !== "active" ? "Boleto Usado" : "Boleto Vencido"}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">Este boleto ya no es válido</p>
            </>
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* Información de la película */}
          <div className="flex gap-4">
            <div className="relative h-40 w-28 flex-shrink-0 overflow-hidden rounded">
              <Image
                src={movie.poster_url || "/placeholder.svg"}
                alt={movie.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-2xl font-bold">{movie.title}</h2>
                <div className="mt-1 flex flex-wrap gap-1">
                  {movie.genre.map((genre: string) => (
                    <Badge key={genre} variant="outline">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Detalles del boleto */}
          <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
            <h3 className="font-semibold">Detalles del Boleto</h3>
            
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Ubicación</p>
                  <p className="font-medium">{location.name}</p>
                  <p className="text-sm">{location.city}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Calendar className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Fecha</p>
                  <p className="font-medium capitalize">
                    {showDateTime.toLocaleDateString("es-CO", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Hora</p>
                  <p className="font-medium">
                    {showDateTime.toLocaleTimeString("es-CO", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <TicketIcon className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Cantidad</p>
                  <p className="font-medium">
                    {ticket.seats_count} {ticket.seats_count === 1 ? "boleto" : "boletos"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between border-t pt-3 text-lg">
              <span className="font-semibold">Total Pagado</span>
              <span className="font-bold text-primary">${ticket.total_amount.toLocaleString()}</span>
            </div>
          </div>

          {/* Código QR */}
          <div className="rounded-lg border bg-muted/30 p-4 text-center">
            <p className="text-sm text-muted-foreground">Código de Verificación</p>
            <p className="mt-1 font-mono text-sm font-medium">{ticket.qr_code}</p>
          </div>
        </div>
      </Card>

      <div className="mt-6 text-center">
        <Button asChild variant="outline">
          <Link href="/">Volver al Inicio</Link>
        </Button>
      </div>
    </div>
  )
}
