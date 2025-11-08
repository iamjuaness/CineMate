import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function RegistroExitosoPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-3xl font-bold">CineMate</h1>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">¡Gracias por registrarte!</CardTitle>
              <CardDescription>Revisa tu correo para confirmar tu cuenta</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Te hemos enviado un correo de confirmación. Por favor, verifica tu bandeja de entrada y haz clic en el
                enlace para activar tu cuenta antes de iniciar sesión.
              </p>
              <Button asChild>
                <Link href="/auth/login">Ir a Iniciar Sesión</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
