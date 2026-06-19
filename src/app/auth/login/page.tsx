import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from './LoginForm'

export const metadata: Metadata = {
  title: 'Acesso restrito',
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-navy px-6">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 block text-center">
          <span className="font-serif text-2xl font-semibold text-white">
            Eduardo Vieira
          </span>
          <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.3em] text-brand-gold">
            Imóveis · Painel Administrativo
          </span>
        </Link>

        <div className="rounded-xl border border-white/10 bg-white p-8 shadow-2xl">
          <h1 className="mb-1 font-serif text-2xl font-medium text-brand-navy">
            Bem-vindo de volta
          </h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Entre com suas credenciais para acessar o painel.
          </p>
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-xs text-white/40">
          Acesso exclusivo para administradores.
        </p>
      </div>
    </div>
  )
}
