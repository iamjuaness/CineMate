"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Confetti from "react-confetti"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EmailConfirmadoPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)
  const [showConfetti, setShowConfetti] = useState(true)
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  })
  const [mounted, setMounted] = useState(false)

  // Marcar como montado
  useEffect(() => {
    setMounted(true)
  }, [])

  // Obtener tamaño de ventana para el confetti
  useEffect(() => {
    if (!mounted) return

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [mounted])

  // Countdown y redirección
  useEffect(() => {
    if (!mounted) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push("/auth/login")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Detener confetti después de 5 segundos
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false)
    }, 5000)

    return () => {
      clearInterval(timer)
      clearTimeout(confettiTimer)
    }
  }, [router, mounted])

  // No renderizar hasta que esté montado (evita hydration mismatch)
  if (!mounted) {
    return null
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      {showConfetti && windowSize.width > 0 && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}
      
      <div className="w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-3xl font-bold"
            >
              CineMate
            </motion.h1>
          </div>

          <Card>
            <CardHeader className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  delay: 0.3, 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20 
                }}
                className="mx-auto mb-4"
              >
                <CheckCircle className="h-20 w-20 text-green-500" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <CardTitle className="text-2xl">¡Email Confirmado!</CardTitle>
                <CardDescription className="mt-2">
                  Tu cuenta ha sido verificada exitosamente
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-center text-sm text-muted-foreground"
              >
                ¡Bienvenido a CineMate! Ya puedes disfrutar de todas nuestras funciones.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-center"
              >
                <p className="mb-4 text-sm text-muted-foreground">
                  Redirigiendo al login en{" "}
                  <motion.span
                    key={countdown}
                    initial={{ scale: 1.5, color: "#16a34a" }}
                    animate={{ scale: 1, color: "#6b7280" }}
                    transition={{ duration: 0.3 }}
                    className="font-bold"
                  >
                    {countdown}
                  </motion.span>{" "}
                  segundos...
                </p>
                
                <Button
                  onClick={() => router.push("/auth/login")}
                  className="w-full"
                >
                  Ir a Iniciar Sesión Ahora
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
