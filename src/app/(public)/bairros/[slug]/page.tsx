import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ArrowRight, MapPin } from 'lucide-react'
import { PropertyGrid } from '@/components/public/PropertyGrid'
import { Button } from '@/components/ui/button'
import { getNeighborhoodBySlug, getNeighborhoods, getProperties } from '@/lib/queries'

export const revalidate = 600

const NEIGHBORHOOD_IMAGES: Record<string, string> = {
  altiplano: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80',
  'cabo-branco': 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80',
  'jardim-oceania': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80',
  bessa: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1600&q=80',
  manaira: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80',
  tambau: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=80',
  aeroclube: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1600&q=80',
  intermares: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1600&q=80',
}

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1600&q=80'

export async function generateStaticParams() {
  try {
    const neighborhoods = await getNeighborhoods()
    return neighborhoods.map((n) => ({ slug: n.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const neighborhood = await getNeighborhoodBySlug(params.slug)
  if (!neighborhood) return { title: 'Bairro não encontrado' }
  return {
    title: neighborhood.seo_title || `Imóveis em ${neighborhood.name}`,
    description:
      neighborhood.seo_description ||
      neighborhood.description ||
      `Imóveis à venda e para alugar em ${neighborhood.name}, João Pessoa.`,
  }
}

export default async function NeighborhoodDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const neighborhood = await getNeighborhoodBySlug(params.slug)
  if (!neighborhood) notFound()

  const { data: properties, total } = await getProperties({
    neighborhood: neighborhood.name,
    perPage: 9,
  })

  const image =
    neighborhood.cover_image_url ||
    NEIGHBORHOOD_IMAGES[neighborhood.slug] ||
    DEFAULT_IMAGE

  return (
    <>
      {/* Hero */}
      <section className="relative flex h-[60vh] min-h-[420px] items-end overflow-hidden">
        <Image
          src={image}
          alt={neighborhood.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 gradient-overlay" />
        <div className="container-wide relative z-10 pb-12">
          <p className="eyebrow mb-3 text-brand-gold-light">
            <MapPin className="mr-1 inline h-3.5 w-3.5" />
            João Pessoa - PB
          </p>
          <h1 className="font-serif text-4xl font-medium text-white md:text-6xl">
            {neighborhood.name}
          </h1>
        </div>
      </section>

      {/* Description */}
      {neighborhood.description && (
        <section className="border-b border-border bg-background py-12">
          <div className="container-wide max-w-3xl">
            <p className="text-lg leading-relaxed text-muted-foreground">
              {neighborhood.description}
            </p>
          </div>
        </section>
      )}

      {/* Properties */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="eyebrow mb-2">Disponíveis agora</p>
              <h2 className="font-serif text-3xl font-medium text-brand-navy">
                {total} {total === 1 ? 'imóvel' : 'imóveis'} em {neighborhood.name}
              </h2>
            </div>
            <Button asChild variant="gold-outline">
              <Link href={`/imoveis?neighborhood=${encodeURIComponent(neighborhood.name)}`}>
                Ver todos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <PropertyGrid
            properties={properties}
            emptyMessage={`Ainda não temos imóveis publicados em ${neighborhood.name}. Entre em contato e avisaremos assim que surgir uma oportunidade.`}
          />
        </div>
      </section>
    </>
  )
}
