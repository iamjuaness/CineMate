import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NavBar } from "@/components/nav-bar"
import { TicketCard } from "@/components/ticket-card"
import { Card } from "@/components/ui/card"
import { parseISO, isBefore } from "date-fns"

export default async function MisBoletosPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  // Obtener boletos del usuario
  const { data: tickets } = await supabase
    .from("tickets")
    .select(
      `
      *,
      showtimes(
        *,
        movies(*),
        locations(*)
      )
    `,
    )
    .eq("user_id", user.id)
    .order("purchase_date", { ascending: false })

  // Hora actual en UTC
  const nowUTC = new Date()

  // Separar boletos activos y pasados
  const activeTickets = tickets?.filter((ticket) => {
    if (!ticket.showtimes) return false
    
    // Parsear show_datetime que viene con timezone desde la BD
    const showtimeUTC = parseISO(ticket.showtimes.show_datetime)
    
    // Verificar si no ha pasado y está activo
    return !isBefore(showtimeUTC, nowUTC) && ticket.status === "active"
  })

  const pastTickets = tickets?.filter((ticket) => {
    if (!ticket.showtimes) return false
    
    // Parsear show_datetime
    const showtimeUTC = parseISO(ticket.showtimes.show_datetime)
    
    // Verificar si ya pasó o no está activo
    return isBefore(showtimeUTC, nowUTC) || ticket.status !== "active"
  })

  return (
    <div className="min-h-svh bg-background">
      <NavBar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-2 text-3xl font-bold">Mis Boletos</h1>
        <p className="mb-8 text-muted-foreground">Aquí encontrarás todos tus boletos comprados</p>

        {/* Boletos Activos */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">Próximas Funciones</h2>
          {activeTickets && activeTickets.length > 0 ? (
            <div className="space-y-4">
              {activeTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No tienes boletos para próximas funciones</p>
            </Card>
          )}
        </div>

        {/* Boletos Pasados */}
        {pastTickets && pastTickets.length > 0 && (
          <div>
            <h2 className="mb-4 text-xl font-semibold">Historial</h2>
            <div className="space-y-4">
              {pastTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} isPast />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
