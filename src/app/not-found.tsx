import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <p className="font-serif text-7xl font-semibold text-brand-gold md:text-9xl">
        404
      </p>
      <h1 className="mt-4 font-serif text-2xl font-medium text-brand-navy md:text-3xl">
        Página não encontrada
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        O endereço que você procura não existe ou foi movido. Que tal explorar
        nossos imóveis?
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild variant="gold" size="lg">
          <Link href="/">Voltar ao início</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/imoveis">Ver imóveis</Link>
        </Button>
      </div>
    </div>
  )
}
