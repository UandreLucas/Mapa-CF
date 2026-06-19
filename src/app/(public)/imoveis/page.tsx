import { Suspense } from 'react'
import type { Metadata } from 'next'
import { PropertyFilters, MobileFilters } from '@/components/public/PropertyFilters'
import { PropertySort } from '@/components/public/PropertySort'
import { PropertyGrid } from '@/components/public/PropertyGrid'
import { Pagination } from '@/components/public/Pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { getProperties } from '@/lib/queries'
import { PROPERTY_PURPOSES } from '@/lib/utils'
import type { PropertyFilters as Filters, PropertySort as Sort } from '@/types'

export const metadata: Metadata = {
  title: 'Imóveis à venda e para alugar em João Pessoa',
  description:
    'Explore nossa seleção de imóveis de alto padrão em João Pessoa. Filtre por bairro, tipo, preço e encontre o imóvel ideal.',
}

interface PageProps {
  searchParams: Record<string, string | undefined>
}

function parseFilters(sp: PageProps['searchParams']): Filters {
  return {
    purpose: sp.purpose,
    type: sp.type,
    neighborhood: sp.neighborhood,
    city: sp.city,
    minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
    maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
    bedrooms: sp.bedrooms ? Number(sp.bedrooms) : undefined,
    bathrooms: sp.bathrooms ? Number(sp.bathrooms) : undefined,
    parking: sp.parking ? Number(sp.parking) : undefined,
    isLuxury: sp.isLuxury === 'true' || undefined,
    isLaunch: sp.isLaunch === 'true' || undefined,
    search: sp.search,
    sort: (sp.sort as Sort) || 'recent',
    page: sp.page ? Number(sp.page) : 1,
    perPage: 12,
  }
}

function buildTitle(filters: Filters): string {
  const purpose = PROPERTY_PURPOSES.find((p) => p.value === filters.purpose)
  if (filters.isLuxury) return 'Imóveis de Alto Padrão'
  if (filters.isLaunch) return 'Lançamentos'
  if (filters.neighborhood) return `Imóveis em ${filters.neighborhood}`
  if (purpose && filters.purpose === 'rent') return 'Imóveis para Alugar'
  if (purpose && filters.purpose === 'sale') return 'Imóveis à Venda'
  return 'Todos os Imóveis'
}

async function Results({ filters }: { filters: Filters }) {
  const { data, total, page, totalPages } = await getProperties(filters)

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{total}</span>{' '}
          {total === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
        </p>
        <div className="flex items-center gap-3">
          <MobileFilters />
          <PropertySort />
        </div>
      </div>

      <PropertyGrid properties={data} />
      <Pagination page={page} totalPages={totalPages} />
    </>
  )
}

function ResultsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-[4/3] w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-6 w-1/3" />
        </div>
      ))}
    </div>
  )
}

export default function ImoveisPage({ searchParams }: PageProps) {
  const filters = parseFilters(searchParams)
  const title = buildTitle(filters)

  return (
    <>
      {/* Page header */}
      <div className="bg-brand-navy pb-12 pt-32">
        <div className="container-wide">
          <p className="eyebrow mb-3 text-brand-gold-light">Imóveis</p>
          <h1 className="font-serif text-3xl font-medium text-white md:text-4xl">
            {title}
          </h1>
        </div>
      </div>

      <div className="container-wide section-padding">
        <div className="flex gap-8">
          <Suspense fallback={null}>
            <PropertyFilters />
          </Suspense>

          <div className="min-w-0 flex-1">
            <Suspense
              key={JSON.stringify(searchParams)}
              fallback={<ResultsSkeleton />}
            >
              <Results filters={filters} />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  )
}
