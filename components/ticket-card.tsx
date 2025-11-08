import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Calendar, Clock, MapPin, TicketIcon, QrCode } from "lucide-react"
import type { Ticket } from "@/lib/types"

interface TicketCardProps {
  ticket: Ticket & {
    showtimes?: any
  }
  isPast?: boolean
}

export function TicketCard({ ticket, isPast }: TicketCardProps) {
  if (!ticket.showtimes?.movies || !ticket.showtimes?.locations) {
    return null
  }

  const movie = ticket.showtimes.movies
  const location = ticket.showtimes.locations

  return (
    <Card className={`overflow-hidden ${isPast ? "opacity-60" : ""}`}>
      <div className="flex flex-col gap-4 p-4 sm:flex-row">
        {/* Poster */}
        <div className="relative h-32 w-24 flex-shrink-0 overflow-hidden rounded">
          <Image
            src={movie.poster_url || "/placeholder.svg?height=600&width=400"}
            alt={movie.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Información */}
        <div className="flex-1 space-y-3">
          <div>
            <div className="mb-1 flex items-start justify-between gap-2">
              <h3 className="font-semibold">{movie.title}</h3>
              <Badge variant={isPast ? "secondary" : "default"}>
                {ticket.status === "active" && !isPast ? "Activo" : "Usado"}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1">
              {movie.genre.slice(0, 2).map((genre: string) => (
                <Badge key={genre} variant="outline" className="text-xs">
                  {genre}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <div>
                <p className="font-medium">{location.name}</p>
                <p className="text-muted-foreground">{location.city}</p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {new Date(ticket.showtimes.show_date).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{ticket.showtimes.show_time.substring(0, 5)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <TicketIcon className="h-4 w-4 text-muted-foreground" />
                <span>
                  {ticket.seats_count} {ticket.seats_count === 1 ? "boleto" : "boletos"}
                </span>
              </div>
              <div className="font-semibold">Total: ${ticket.total_amount.toLocaleString()}</div>
            </div>
            {!isPast && ticket.qr_code && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <QrCode className="h-4 w-4" />
                <span className="font-mono">{ticket.qr_code}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
