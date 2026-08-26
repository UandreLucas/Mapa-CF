import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const BG_IMAGE =
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80'

export function AdvertiseCTA() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={BG_IMAGE}
          alt="Anuncie seu imóvel"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-brand-navy/85" />
      </div>

      <div className="container-wide relative z-10 py-20 text-center md:py-28">
        <p className="eyebrow mb-4 text-brand-gold-light">Para proprietários</p>
        <h2 className="mx-auto max-w-3xl text-balance font-serif text-3xl font-medium leading-tight text-white md:text-5xl">
          Quer vender ou alugar seu imóvel com quem entende de alto padrão?
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/75">
          Anuncie com Eduardo Vieira e tenha exposição qualificada, avaliação
          justa e negociação conduzida por um especialista.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button asChild variant="gold" size="xl">
            <Link href="/anuncie">Anunciar meu imóvel</Link>
          </Button>
          <Button
            asChild
            size="xl"
            variant="outline"
            className="border-white/40 bg-transparent text-white hover:bg-white hover:text-brand-navy"
          >
            <Link href="/avalie">Avaliar meu imóvel</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
