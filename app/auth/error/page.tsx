import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Lo sentimos, algo salió mal</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {params?.error ? (
                <p className="text-sm text-muted-foreground">Código de error: {params.error}</p>
              ) : (
                <p className="text-sm text-muted-foreground">Ocurrió un error no especificado.</p>
              )}
              <Button asChild>
                <Link href="/auth/login">Volver a Iniciar Sesión</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
