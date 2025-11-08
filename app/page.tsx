import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Film, MapPin, Ticket, TrendingUp } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-6xl md:text-5xl">
            Bienvenido a CineMate
          </h1>
          <p className="text-pretty text-lg text-muted-foreground sm:text-xl">
            Tu experiencia cinematográfica móvil. Descubre películas en cartelera, compra boletos y lleva el registro de
            todo lo que ves.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/registro">Comenzar Ahora</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/login">Iniciar Sesión</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/50 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold">Todo lo que necesitas en un solo lugar</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Film className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Cartelera Completa</h3>
              <p className="text-sm text-muted-foreground">Explora todas las películas disponibles en tu ciudad</p>
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Múltiples Ubicaciones</h3>
              <p className="text-sm text-muted-foreground">Encuentra funciones cerca de ti en diferentes cines</p>
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Ticket className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Compra Fácil</h3>
              <p className="text-sm text-muted-foreground">Adquiere tus boletos de forma rápida y segura</p>
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Recomendaciones</h3>
              <p className="text-sm text-muted-foreground">Descubre películas según tus gustos personales</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 text-center">
        <div className="mx-auto max-w-2xl space-y-4">
          <h2 className="text-3xl font-bold">¿Listo para tu próxima película?</h2>
          <p className="text-muted-foreground">Únete a CineMate y comienza a disfrutar del mejor cine móvil</p>
          <Button size="lg" asChild>
            <Link href="/auth/registro">Crear Cuenta Gratis</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
