import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NeighborhoodWithCount, Neighborhood } from '@/types'

interface NeighborhoodCardProps {
  neighborhood: NeighborhoodWithCount | Neighborhood
  className?: string
}

const NEIGHBORHOOD_IMAGES: Record<string, string> = {
  altiplano:
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
  'cabo-branco':
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
  'jardim-oceania':
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
  bessa:
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
  manaira:
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
  tambau:
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
  aeroclube:
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80',
  intermares:
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80',
}

const DEFAULT_NEIGHBORHOOD_IMAGE =
  'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80'

export function NeighborhoodCard({
  neighborhood,
  className,
}: NeighborhoodCardProps) {
  const count =
    'property_count' in neighborhood ? neighborhood.property_count : null
  const image =
    neighborhood.cover_image_url ||
    NEIGHBORHOOD_IMAGES[neighborhood.slug] ||
    DEFAULT_NEIGHBORHOOD_IMAGE

  return (
    <Link
      href={`/bairros/${neighborhood.slug}`}
      className={cn(
        'group relative block h-72 overflow-hidden rounded-lg',
        className
      )}
    >
      <Image
        src={image}
        alt={neighborhood.name}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 gradient-overlay" />

      <div className="absolute inset-x-0 bottom-0 p-6">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="font-serif text-2xl font-medium text-white">
              {neighborhood.name}
            </h3>
            {count !== null && (
              <p className="mt-1 text-sm text-white/70">
                {count} {count === 1 ? 'imóvel' : 'imóveis'} disponíveis
              </p>
            )}
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-all duration-300 group-hover:border-brand-gold group-hover:bg-brand-gold group-hover:text-brand-navy">
            <ArrowUpRight className="h-5 w-5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
