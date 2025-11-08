"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Minus, Plus } from "lucide-react"

interface PurchaseFormProps {
  showtimeId: string
  price: number
  availableSeats: number
  userId: string
}

export function PurchaseForm({ showtimeId, price, availableSeats, userId }: PurchaseFormProps) {
  const [seatsCount, setSeatsCount] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const totalAmount = seatsCount * price

  const handlePurchase = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Generar código QR simple (en producción usar una librería)
      const qrCode = `CINEMATE-${showtimeId}-${Date.now()}`

      // Crear el ticket
      const { error: ticketError } = await supabase.from("tickets").insert({
        user_id: userId,
        showtime_id: showtimeId,
        seats_count: seatsCount,
        total_amount: totalAmount,
        qr_code: qrCode,
        status: "active",
      })

      if (ticketError) throw ticketError

      // Actualizar asientos disponibles
      const { error: updateError } = await supabase.rpc("update_available_seats", {
        showtime_id: showtimeId,
        seats_to_subtract: seatsCount,
      })

      // Si no existe el RPC, actualizar manualmente
      if (updateError) {
        const { error: manualUpdateError } = await supabase
          .from("showtimes")
          .update({
            available_seats: availableSeats - seatsCount,
          })
          .eq("id", showtimeId)

        if (manualUpdateError) throw manualUpdateError
      }

      // Redirigir a mis boletos
      router.push("/mis-boletos")
      router.refresh()
    } catch (err) {
      console.error("[v0] Error al comprar boletos:", err)
      setError(err instanceof Error ? err.message : "Error al procesar la compra")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-xl font-semibold">Selecciona tus boletos</h3>

      <div className="mb-6 space-y-4">
        <div>
          <Label>Cantidad de boletos</Label>
          <div className="mt-2 flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSeatsCount(Math.max(1, seatsCount - 1))}
              disabled={seatsCount <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center text-2xl font-semibold">{seatsCount}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSeatsCount(Math.min(availableSeats, seatsCount + 1))}
              disabled={seatsCount >= availableSeats}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Boletos ({seatsCount})</span>
            <span>${(seatsCount * price).toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t pt-2 text-lg font-semibold">
            <span>Total</span>
            <span>${totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      <Button className="w-full" size="lg" onClick={handlePurchase} disabled={isLoading || availableSeats === 0}>
        {isLoading ? "Procesando..." : "Confirmar Compra"}
      </Button>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Al confirmar la compra, recibirás tu boleto con código QR
      </p>
    </Card>
  )
}
