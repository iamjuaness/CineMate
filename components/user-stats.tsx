import { Film, BookMarked, Ticket, DollarSign, Star, Award } from "lucide-react"

interface UserStatsProps {
  watchedCount: number
  watchlistCount: number
  ticketsCount: number
  totalSpent: number
  favoriteGenre: string
  avgRating: string
}

export function UserStats({
  watchedCount,
  watchlistCount,
  ticketsCount,
  totalSpent,
  favoriteGenre,
  avgRating,
}: UserStatsProps) {
  const stats = [
    {
      label: "Películas Vistas",
      value: watchedCount,
      icon: Film,
    },
    {
      label: "Por Ver",
      value: watchlistCount,
      icon: BookMarked,
    },
    {
      label: "Boletos Comprados",
      value: ticketsCount,
      icon: Ticket,
    },
    {
      label: "Total Gastado",
      value: `$${totalSpent.toLocaleString()}`,
      icon: DollarSign,
    },
    {
      label: "Género Favorito",
      value: favoriteGenre,
      icon: Award,
    },
    {
      label: "Calificación Promedio",
      value: avgRating,
      icon: Star,
    },
  ]

  return (
    <div className="space-y-4">
      {stats.map((stat) => (
        <div key={stat.label} className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <stat.icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-lg font-semibold">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
