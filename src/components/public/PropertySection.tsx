import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PropertyCard } from './PropertyCard'
import { cn } from '@/lib/utils'
import type { PropertyWithImages } from '@/types'

interface PropertySectionProps {
  eyebrow?: string
  title: string
  description?: string
  properties: PropertyWithImages[]
  viewAllHref?: string
  viewAllLabel?: string
  dark?: boolean
  className?: string
}

export function PropertySection({
  eyebrow,
  title,
  description,
  properties,
  viewAllHref,
  viewAllLabel = 'Ver todos',
  dark = false,
  className,
}: PropertySectionProps) {
  if (!properties.length) return null

  return (
    <section
      className={cn(
        'section-padding',
        dark ? 'bg-brand-navy' : 'bg-background',
        className
      )}
    >
      <div className="container-wide">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            {eyebrow && (
              <p className={cn('eyebrow mb-3', dark && 'text-brand-gold-light')}>
                {eyebrow}
              </p>
            )}
            <h2
              className={cn(
                'text-3xl font-medium leading-tight md:text-4xl',
                dark ? 'text-white' : 'text-brand-navy'
              )}
            >
              {title}
            </h2>
            {description && (
              <p
                className={cn(
                  'mt-4 text-base leading-relaxed',
                  dark ? 'text-white/70' : 'text-muted-foreground'
                )}
              >
                {description}
              </p>
            )}
          </div>

          {viewAllHref && (
            <Link
              href={viewAllHref}
              className={cn(
                'group flex shrink-0 items-center gap-2 text-sm font-medium transition-colors',
                dark
                  ? 'text-brand-gold-light hover:text-brand-gold'
                  : 'text-brand-navy hover:text-brand-gold'
              )}
            >
              {viewAllLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  )
}
