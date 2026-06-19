import type { Metadata } from 'next'
import { NeighborhoodCard } from '@/components/public/NeighborhoodCard'
import { SectionHeading } from '@/components/public/SectionHeading'
import { getNeighborhoodsWithCounts } from '@/lib/queries'

export const revalidate = 600

export const metadata: Metadata = {
  title: 'Bairros de João Pessoa | Onde morar',
  description:
    'Conheça os melhores bairros de João Pessoa para morar: Altiplano, Cabo Branco, Manaíra, Tambaú e mais. Encontre imóveis de alto padrão em cada região.',
}

export default async function BairrosPage() {
  const neighborhoods = await getNeighborhoodsWithCounts()

  return (
    <>
      <div className="bg-brand-navy pb-12 pt-32">
        <div className="container-wide">
          <p className="eyebrow mb-3 text-brand-gold-light">Onde morar</p>
          <h1 className="font-serif text-3xl font-medium text-white md:text-5xl">
            Bairros de João Pessoa
          </h1>
          <p className="mt-4 max-w-2xl text-white/70">
            Cada bairro tem sua personalidade. Descubra as regiões mais
            valorizadas da capital paraibana e encontre o endereço perfeito para
            você.
          </p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {neighborhoods.map((n) => (
              <NeighborhoodCard key={n.id} neighborhood={n} className="h-80" />
            ))}
          </div>

          {neighborhoods.length === 0 && (
            <div className="py-20 text-center text-muted-foreground">
              Nenhum bairro cadastrado ainda.
            </div>
          )}
        </div>
      </section>
    </>
  )
}
