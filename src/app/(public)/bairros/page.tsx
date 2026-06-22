import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, MapPin } from 'lucide-react'
import { getNeighborhoodsWithCounts } from '@/lib/queries'

export const revalidate = 600

export const metadata: Metadata = {
  title: 'Bairros de João Pessoa | Eduardo Vieira Imóveis',
  description:
    'Conheça os melhores bairros de João Pessoa: Altiplano, Cabo Branco, Manaíra, Tambaú e mais. Descubra onde morar com Eduardo Vieira.',
}

const NEIGHBORHOOD_IMAGES: Record<string, string> = {
  altiplano: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
  'cabo-branco': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  'jardim-oceania': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
  bessa: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
  manaira: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
  tambau: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
  aeroclube: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80',
  intermares: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80',
}

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80'

export default async function BairrosPage() {
  const neighborhoods = await getNeighborhoodsWithCounts()

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy pb-16 pt-32">
        <div className="container-wide">
          <nav className="mb-6 flex items-center gap-2 text-sm text-white/50">
            <Link href="/" className="hover:text-white transition-colors">Início</Link>
            <span>/</span>
            <span className="text-white">Bairros</span>
          </nav>
          <p className="eyebrow mb-3 text-brand-gold-light">Onde morar</p>
          <h1 className="font-serif text-4xl font-medium text-white md:text-6xl">
            Bairros de João Pessoa
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/70">
            Cada bairro tem sua personalidade. Descubra as regiões mais valorizadas
            da capital paraibana e encontre o endereço perfeito para você.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="section-padding">
        <div className="container-wide">
          {neighborhoods.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              Nenhum bairro cadastrado ainda.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {neighborhoods.map((n) => {
                const image =
                  n.cover_image_url ||
                  NEIGHBORHOOD_IMAGES[n.slug] ||
                  DEFAULT_IMAGE

                return (
                  <Link
                    key={n.id}
                    href={`/bairros/${n.slug}`}
                    className="group relative flex h-72 flex-col justify-end overflow-hidden rounded-2xl"
                  >
                    <Image
                      src={image}
                      alt={n.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="relative z-10 p-5">
                      <p className="flex items-center gap-1 text-xs font-medium uppercase tracking-widest text-brand-gold-light">
                        <MapPin className="h-3 w-3" />
                        João Pessoa
                      </p>
                      <h2 className="mt-1 font-serif text-2xl font-medium text-white">
                        {n.name}
                      </h2>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm text-white/70">
                          {n.property_count}{' '}
                          {n.property_count === 1 ? 'imóvel' : 'imóveis'}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-medium text-brand-gold-light opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          Explorar <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary/40 section-padding">
        <div className="container-wide text-center">
          <p className="eyebrow mb-3">Não encontrou seu bairro?</p>
          <h2 className="font-serif text-3xl font-medium text-brand-navy">
            Fale com Eduardo Vieira
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Trabalhamos em toda João Pessoa e região. Entre em contato e
            encontraremos o imóvel ideal na região que você deseja.
          </p>
          <Link
            href="/contato"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-navy px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-navy/90"
          >
            Entrar em contato <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
