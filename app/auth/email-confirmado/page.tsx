"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import Confetti from "react-confetti"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

function EmailConfirmadoContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [countdown, setCountdown] = useState(5)
  const [showConfetti, setShowConfetti] = useState(true)
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  })
  const [mounted, setMounted] = useState(false)

  const hasError = searchParams.get('error') === 'verification_failed'

  // Marcar como montado
  useEffect(() => {
    setMounted(true)
  }, [])

  // Obtener tamaño de ventana
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

  // Countdown y redirección - CORREGIDO
  useEffect(() => {
    if (!mounted || hasError) return

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    const confettiTimer = setTimeout(() => {
      setShowConfetti(false)
    }, 5000)

    return () => {
      clearInterval(timer)
      clearTimeout(confettiTimer)
    }
  }, [mounted, hasError])

  // Efecto separado para la redirección - NUEVO
  useEffect(() => {
    if (countdown <= 0 && mounted && !hasError) {
      router.push("/auth/login")
    }
  }, [countdown, mounted, hasError, router])

  if (!mounted) {
    return null
  }

  if (hasError) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader className="text-center">
              <XCircle className="mx-auto mb-4 h-20 w-20 text-red-500" />
              <CardTitle className="text-2xl">Error de Verificación</CardTitle>
              <CardDescription className="mt-2">
                No se pudo verificar tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-center text-sm text-muted-foreground">
                El enlace puede haber expirado o ya fue usado.
              </p>
              <Button onClick={() => router.push("/auth/registro")} className="w-full">
                Volver a Registro
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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
                    className="font-bold tabular-nums"
                  >
                    {countdown > 0 ? countdown : 0}
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

export default function EmailConfirmadoPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-svh w-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Cargando...</p>
        </div>
      </div>
    }>
      <EmailConfirmadoContent />
    </Suspense>
  )
}
