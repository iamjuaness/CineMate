"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Film, Home, Ticket, User, BookMarked, LogOut, Sparkles } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function NavBar() {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const isActive = (path: string) => pathname === path

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/cartelera" className="flex items-center gap-2 font-bold">
          <Film className="h-6 w-6" />
          <span>CineMate</span>
        </Link>

        <div className="flex items-center gap-1">
          <Button variant={isActive("/cartelera") ? "secondary" : "ghost"} size="sm" asChild>
            <Link href="/cartelera">
              <Home className="mr-2 h-4 w-4" />
              Cartelera
            </Link>
          </Button>
          <Button variant={isActive("/recomendaciones") ? "secondary" : "ghost"} size="sm" asChild>
            <Link href="/recomendaciones">
              <Sparkles className="mr-2 h-4 w-4" />
              Para Ti
            </Link>
          </Button>
          <Button variant={isActive("/mis-boletos") ? "secondary" : "ghost"} size="sm" asChild>
            <Link href="/mis-boletos">
              <Ticket className="mr-2 h-4 w-4" />
              Boletos
            </Link>
          </Button>
          <Button variant={isActive("/mis-peliculas") ? "secondary" : "ghost"} size="sm" asChild>
            <Link href="/mis-peliculas">
              <BookMarked className="mr-2 h-4 w-4" />
              Películas
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/perfil" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Mi Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
