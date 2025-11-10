import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/auth/email-confirmado'

  if (code) {
    const cookieStore = await cookies()
    const supabase = await createClient()
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Redirigir a la página de confirmación exitosa
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    }
  }

  // Si hay error, redirigir al login
  return NextResponse.redirect(new URL('/auth/login?error=verification_failed', requestUrl.origin))
}
