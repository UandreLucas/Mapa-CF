'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { BedDouble, Bath, Car, Maximize, MapPin, Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn, formatCurrency, formatArea, getPropertyTypeLabel } from '@/lib/utils'
import type { PropertyWithImages } from '@/types'

interface PropertyCardProps {
  property: PropertyWithImages
  className?: string
  priority?: boolean
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80'

export function PropertyCard({ property, className, priority }: PropertyCardProps) {
  const [favorite, setFavorite] = useState(false)

  const cover =
    property.images?.find((img) => img.is_cover)?.url ||
    property.images?.[0]?.url ||
    FALLBACK_IMAGE

  const purposeLabel =
    property.purpose === 'rent'
      ? 'Aluguel'
      : property.purpose === 'both'
        ? 'Venda / Aluguel'
        : 'Venda'

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setFavorite((v) => !v)
  }

  return (
    <Link
      href={`/imoveis/${property.slug}`}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
        className
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <Image
          src={cover}
          alt={property.images?.[0]?.alt || property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Top badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {property.is_luxury && <Badge variant="luxury">Alto Padrão</Badge>}
          {property.is_launch && <Badge variant="gold">Lançamento</Badge>}
        </div>

        {/* Favorite */}
        <button
          type="button"
          onClick={toggleFavorite}
          aria-label="Favoritar imóvel"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-brand-navy shadow-sm backdrop-blur transition-colors hover:bg-white"
        >
          <Heart
            className={cn('h-4 w-4', favorite && 'fill-brand-gold text-brand-gold')}
          />
        </button>

        {/* Purpose ribbon */}
        <div className="absolute bottom-3 left-3">
          <span className="rounded bg-brand-navy/90 px-2.5 py-1 text-xs font-medium uppercase tracking-wider text-white backdrop-blur">
            {purposeLabel}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-brand-gold" />
          <span className="line-clamp-1">
            {property.neighborhood}, {property.city}
          </span>
        </div>

        <h3 className="line-clamp-2 font-serif text-lg font-medium leading-snug text-foreground transition-colors group-hover:text-brand-gold">
          {property.title}
        </h3>

        <p className="mt-0.5 text-xs uppercase tracking-wide text-muted-foreground">
          {getPropertyTypeLabel(property.type)} · Cód. {property.code}
        </p>

        {/* Specs */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <BedDouble className="h-4 w-4" />
              {property.bedrooms}
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <Bath className="h-4 w-4" />
              {property.bathrooms}
            </span>
          )}
          {property.parking > 0 && (
            <span className="flex items-center gap-1.5">
              <Car className="h-4 w-4" />
              {property.parking}
            </span>
          )}
          {property.total_area ? (
            <span className="flex items-center gap-1.5">
              <Maximize className="h-4 w-4" />
              {formatArea(property.total_area)}
            </span>
          ) : null}
        </div>

        <div className="mt-auto border-t border-border pt-4">
          {property.hide_price ? (
            <p className="text-lg font-semibold text-brand-navy">Sob consulta</p>
          ) : (
            <p className="text-xl font-semibold text-brand-navy">
              {formatCurrency(property.price)}
              {property.purpose === 'rent' && (
                <span className="text-sm font-normal text-muted-foreground">
                  {' '}
                  /mês
                </span>
              )}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
