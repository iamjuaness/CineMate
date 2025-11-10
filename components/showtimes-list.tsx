"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import type { Showtime } from "@/lib/types";
import { parseISO, format, isBefore } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { es } from "date-fns/locale";

interface ShowtimesListProps {
  showtimes: Showtime[];
}

export function ShowtimesList({ showtimes }: ShowtimesListProps) {
  const router = useRouter();
  const TIMEZONE = "America/Bogota";
  const nowUTC = new Date();

  // Agrupar por fecha
  const showtimesByDate = showtimes.reduce((acc: any, showtime: Showtime) => {
    // Parsear datetime que YA viene con timezone correcto de la BD
    const showtimeUTC = parseISO(showtime.show_datetime);
    const showtimeColombia = toZonedTime(showtimeUTC, TIMEZONE);
    const dateKey = format(showtimeColombia, "yyyy-MM-dd");
    
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push({
      ...showtime,
      utc: showtimeUTC,
      colombia: showtimeColombia,
    });
    return acc;
  }, {});

  return (
    <div className="space-y-3">
      {(Object.entries(showtimesByDate) as [string, any[]][]).map(
        ([date, times]) => {
          const firstShowtime = times[0];
          const formattedDate = format(
            firstShowtime.colombia,
            "EEEE, d 'de' MMMM",
            { locale: es }
          );

          return (
            <div key={date}>
              <p className="mb-2 text-sm font-medium capitalize">
                {formattedDate}
              </p>
              <div className="flex flex-wrap gap-2">
                {times.map((showtime: any) => {
                  const isPast = isBefore(showtime.utc, nowUTC);
                  const isSoldOut = showtime.available_seats === 0;
                  const formattedHour = format(showtime.colombia, "HH:mm");

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
