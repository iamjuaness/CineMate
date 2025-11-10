"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import type { Showtime } from "@/lib/types";

interface ShowtimesListProps {
  showtimes: Showtime[];
}

export function ShowtimesList({ showtimes }: ShowtimesListProps) {
  const router = useRouter();

  // Obtener fecha y hora actual en Colombia
  const nowColombia = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Bogota" })
  );

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
        ([date, times]) => {
          // Parsear la fecha correctamente sin conversión UTC
          // YYYY-MM-DD → parsearlo como fecha local de Colombia
          const [year, month, day] = date.split("-").map(Number);
          const dateObj = new Date(year, month - 1, day); // Mes es 0-indexed

          const formattedDate = dateObj.toLocaleDateString("es-CO", {
            weekday: "long",
            month: "long",
            day: "numeric",
          });

          return (
            <div key={date}>
              <p className="mb-2 text-sm font-medium capitalize">
                {formattedDate}
              </p>
              <div className="flex flex-wrap gap-2">
                {times.map((showtime: Showtime) => {
                  // Crear fecha/hora completa en Colombia
                  // YYYY-MM-DD + HH:mm:ss → como fecha local
                  const [showYear, showMonth, showDay] = showtime.show_date
                    .split("-")
                    .map(Number);
                  const [hours, minutes] = showtime.show_time
                    .split(":")
                    .map(Number);

                  const showtimeDate = new Date(
                    showYear,
                    showMonth - 1,
                    showDay,
                    hours,
                    minutes
                  );

                  // Verificar si está en el pasado
                  const isPast = showtimeDate < nowColombia;
                  const isSoldOut = showtime.available_seats === 0;

                  // Formatear hora
                  const formattedHour = showtimeDate.toLocaleTimeString("es-CO", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  });

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
          );
        }
      )}
    </div>
  );
}
