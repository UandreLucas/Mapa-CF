import { PropertyCard } from './PropertyCard'
import { cn } from '@/lib/utils'
import type { PropertyWithImages } from '@/types'
import { SearchX } from 'lucide-react'

interface PropertyGridProps {
  properties: PropertyWithImages[]
  className?: string
  emptyMessage?: string
}

export function PropertyGrid({
  properties,
  className,
  emptyMessage = 'Nenhum imóvel encontrado com os filtros selecionados.',
}: PropertyGridProps) {
  if (!properties.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-20 text-center">
        <SearchX className="mb-4 h-10 w-10 text-muted-foreground" />
        <p className="max-w-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3',
        className
      )}
    >
      {properties.map((property, i) => (
        <PropertyCard key={property.id} property={property} priority={i < 3} />
      ))}
    </div>
  )
}
