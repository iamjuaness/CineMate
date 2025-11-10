"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";

interface PurchaseFormProps {
  showtimeId: string;
  price: number;
  availableSeats: number;
  userId: string;
}

export function PurchaseForm({
  showtimeId,
  price,
  availableSeats,
  userId,
}: PurchaseFormProps) {
  const [seatsCount, setSeatsCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const totalAmount = seatsCount * price;

  const handlePurchase = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const ticketId = `${timestamp}-${randomString}`;
      const qrCode = `CINEMATE-${ticketId}`;

      // Llamar a la función RPC
      const { data, error: rpcError } = await supabase.rpc("purchase_tickets", {
        p_user_id: userId,
        p_showtime_id: showtimeId,
        p_seats_count: seatsCount,
        p_total_amount: totalAmount,
        p_qr_code: qrCode,
      });

      if (rpcError) {
        // Manejar errores específicos
        if (rpcError.message.includes('No hay suficientes asientos')) {
          throw new Error(rpcError.message);
        } else if (rpcError.message.includes('Función no encontrada')) {
          throw new Error('Esta función ya no está disponible');
        } else {
          throw rpcError;
        }
      }

      if (!data) {
        throw new Error('No se pudo completar la compra');
      }

      // Redirigir a mis boletos
      router.push("/mis-boletos");
      router.refresh();
    } catch (err) {
      console.error("[CineMate] Error al comprar boletos:", err);
      setError(
        err instanceof Error ? err.message : "Error al procesar la compra. Por favor, intenta de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

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
              disabled={seatsCount <= 1 || isLoading}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center text-2xl font-semibold">
              {seatsCount}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setSeatsCount(Math.min(availableSeats, seatsCount + 1))
              }
              disabled={seatsCount >= availableSeats || isLoading}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Boletos ({seatsCount})
            </span>
            <span>${(seatsCount * price).toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t pt-2 text-lg font-semibold">
            <span>Total</span>
            <span>${totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400">
          {error}
        </div>
      )}

      <Button
        className="w-full"
        size="lg"
        onClick={handlePurchase}
        disabled={isLoading || availableSeats === 0}
      >
        {isLoading ? "Procesando compra..." : "Confirmar Compra"}
      </Button>

      {availableSeats === 0 && (
        <p className="mt-4 text-center text-sm text-red-500">
          Esta función está agotada
        </p>
      )}

      {availableSeats > 0 && (
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Al confirmar la compra, recibirás tu boleto con código QR
        </p>
      )}
    </Card>
  );
}
