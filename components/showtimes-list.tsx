"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import type { Showtime } from "@/lib/types";

interface ShowtimesListProps {
  showtimes: Showtime[];
}

export function ShowtimesList({ showtimes }: ShowtimesListProps) {
  const router = useRouter();

  // Fecha y hora actuales EN COLOMBIA
  const nowColombia = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Bogota" })
  );

  const todayColombia = nowColombia.toISOString().slice(0, 10);

  // Agrupar por fecha
  const showtimesByDate = showtimes.reduce((acc: any, showtime: Showtime) => {
    const date = showtime.show_date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(showtime);
    return acc;
  }, {});

  return (
    <div className="space-y-3">
      {(Object.entries(showtimesByDate) as [string, Showtime[]][]).map(
        ([date, times]) => (
          <div key={date}>
            <p className="mb-2 text-sm font-medium">
              {/* Fecha en zona horaria de Colombia, sumando 1 día */}
              {(() => {
                const dateObj = new Date(date);
                dateObj.setDate(dateObj.getDate() + 1);
                return dateObj.toLocaleDateString("es-ES", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  timeZone: "America/Bogota",
                });
              })()}
            </p>
            <div className="flex flex-wrap gap-2">
              {times.map((showtime: Showtime) => {
                // Combina la fecha y hora de la función
                // El formato: "YYYY-MM-DDTHH:mm:ss" en UTC
                const showtimeDateUTC = new Date(
                  `${showtime.show_date}T${showtime.show_time}`
                );

                // Convierte esa fecha/hora a horario de Colombia
                const showtimeDateColombia = new Date(
                  showtimeDateUTC.toLocaleString("en-US", {
                    timeZone: "America/Bogota",
                  })
                );

                // Verifica si está en el pasado
                const isToday =
                  showtimeDateColombia.toISOString().slice(0, 10) ===
                  todayColombia;
                const isPast = showtimeDateColombia < nowColombia;
                const isSoldOut = showtime.available_seats === 0;

                // Formatea la hora para mostrar solo HH:mm en horario colombiano
                const formattedHour = showtimeDateColombia.toLocaleTimeString(
                  "es-CO",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                    timeZone: "America/Bogota",
                  }
                );

                return (
                  <Button
                    key={showtime.id}
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(`/comprar-boleto/${showtime.id}`)
                    }
                    disabled={isPast || isSoldOut}
                    className={
                      isPast
                        ? "opacity-60 cursor-not-allowed line-through pointer-events-none"
                        : isSoldOut
                        ? "opacity-60 cursor-not-allowed"
                        : "btn-cine font-semibold"
                    }
                    title={
                      isPast
                        ? "Este horario ya ha pasado"
                        : isSoldOut
                        ? "Función agotada"
                        : "Comprar entrada"
                    }
                  >
                    {formattedHour}
                    <span className="ml-2 text-xs">
                      ${showtime.price.toLocaleString()}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>
        )
      )}
    </div>
  );
}
